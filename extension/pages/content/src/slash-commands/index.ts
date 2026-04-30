/**
 * Slash command handler — intercepts /skill-name in any AI chat input.
 * Also shows an autocomplete popup as the user types /
 */

import { mcpClient } from '../core/mcp-client';
import { logMessage } from '../utils/helpers';
import * as autocomplete from './autocomplete';

const SLASH_RE = /^\/([a-zA-Z0-9_-]*)$/;          // /word or just /
const SLASH_EXEC_RE = /^\/([a-zA-Z0-9_-]+)([\s\S]*)$/; // /word [rest]

// Prevent re-intercepting the synthetic Enter dispatched after skill execution
let _submitting = false;

// ── Input text helpers ─────────────────────────────────────────────────────────
function getInputText(el: Element): string {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    return el.value;
  }
  return (el as HTMLElement).innerText ?? '';
}

function setInputText(el: Element, text: string): void {
  el.focus();
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    el.value = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    document.execCommand('selectAll', false, undefined);
    document.execCommand('insertText', false, text);
  }
}

function clearInput(el: Element): void {
  setInputText(el, '');
}

// ── MCP result extraction ──────────────────────────────────────────────────────
function extractText(result: unknown): string {
  if (typeof result === 'string') return result;
  // MCP protocol: { content: [{type:"text", text:"..."}], isError: false }
  if (result && typeof result === 'object' && 'content' in result) {
    const items = (result as any).content;
    if (Array.isArray(items)) {
      return items
        .filter((item: any) => item?.type === 'text')
        .map((item: any) => item.text ?? '')
        .join('\n');
    }
  }
  if (Array.isArray(result)) {
    return result
      .filter((item): item is { type: string; text: string } => item?.type === 'text')
      .map(item => item.text)
      .join('\n');
  }
  return String(result);
}

// ── Submit helper ──────────────────────────────────────────────────────────────
function submitInput(el: Element): void {
  _submitting = true;
  el.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter', code: 'Enter', keyCode: 13,
    bubbles: true, cancelable: true,
  }));
  setTimeout(() => { _submitting = false; }, 300);
}

// ── Execute a skill ────────────────────────────────────────────────────────────
async function runSkill(el: Element, skillName: string, rest: string): Promise<void> {
  clearInput(el);

  try {
    const raw = await mcpClient.callTool(skillName, {});
    const content = extractText(raw);
    const userContext = `[Use everything you already know about me from memory to personalise this session. Do not ask me to re-introduce myself.]\n\n`;
    const body = rest.trim() ? `${content}\n\n${rest.trim()}` : content;
    const finalText = userContext + body;
    setInputText(el, finalText);
    submitInput(el);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logMessage(`[SlashCommands] /${skillName} failed: ${msg}`);
    // Restore slash command so user can retry or correct
    setInputText(el, `/${skillName}${rest}`);
  }
}

// ── Main initializer ───────────────────────────────────────────────────────────
export function initSlashCommands(): void {

  // ── Input event → show/update autocomplete popup ────────────────────────────
  document.addEventListener('input', (e: Event) => {
    const el = document.activeElement;
    if (!el) return;
    const isInput =
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLInputElement ||
      (el as HTMLElement).isContentEditable;
    if (!isInput) return;

    const text = getInputText(el).trim();
    const match = text.match(SLASH_RE);

    if (match) {
      const query = match[1]; // text after /
      autocomplete.show(el, query, (skillName) => {
        setInputText(el, `/${skillName}`);
        el.focus();
        // Immediately execute on selection
        runSkill(el, skillName, '');
      });
    } else {
      autocomplete.hide();
    }
  }, true);

  // ── Keydown → navigation + execution ────────────────────────────────────────
  document.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (_submitting) return;

    // Arrow navigation inside popup
    if (autocomplete.isVisible()) {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); autocomplete.navigate('down'); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); e.stopPropagation(); autocomplete.navigate('up');   return; }
      if (e.key === 'Escape')    { e.preventDefault(); autocomplete.hide(); return; }
      if (e.key === 'Tab')       { e.preventDefault(); autocomplete.selectCurrent(); return; }
    }

    // Enter — execute if text is a slash command
    if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;

    // If popup is open, Enter selects (popup handles execution)
    if (autocomplete.isVisible()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      autocomplete.selectCurrent();
      return;
    }

    const el = document.activeElement;
    if (!el) return;
    const isInput =
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLInputElement ||
      (el as HTMLElement).isContentEditable;
    if (!isInput) return;

    const text = getInputText(el).trim();
    const match = text.match(SLASH_EXEC_RE);
    if (!match) return;

    const [, skillName, rest] = match;
    if (!mcpClient.isReady()) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    logMessage(`[SlashCommands] Executing /${skillName}`);
    await runSkill(el, skillName, rest);

  }, true); // capture phase

  // Hide popup on click outside
  document.addEventListener('click', (e: MouseEvent) => {
    const p = document.getElementById('omniskill-autocomplete');
    if (p && !p.contains(e.target as Node)) autocomplete.hide();
  });

  logMessage('[SlashCommands] Ready');
}
