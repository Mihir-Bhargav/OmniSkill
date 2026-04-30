/**
 * Slash command handler with pill UX.
 *
 * Flow:
 *   1. User types /skill-name → autocomplete popup appears
 *   2. User selects → MCP skill is called, pill inserted in input
 *   3. User can keep typing after the pill
 *   4. User presses Enter → full content + user text submitted
 *   5. Chat message collapses to pill — AI has full context, user sees clean UI
 */

import { mcpClient } from '../core/mcp-client';
import { logMessage } from '../utils/helpers';
import * as autocomplete from './autocomplete';
import { isAIStudio, injectSystemPrompt } from './system-prompt';
import {
  insertPillInInput,
  extractFromInput,
  hasPill,
  watchAndHideSubmittedContent,
} from './pill';

const SLASH_RE = /^\/([a-zA-Z0-9_-]*)$/;

let _submitting = false;

// ── Input helpers ──────────────────────────────────────────────────────────────

function getInputText(el: Element): string {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return el.value;
  return (el as HTMLElement).innerText ?? '';
}

function setInputText(el: Element, text: string): void {
  el.focus();
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    setter ? setter.call(el, text) : (el.value = text);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    document.execCommand('selectAll', false, undefined);
    document.execCommand('insertText', false, text);
  }
}

function clearInput(el: Element): void {
  el.focus();
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    setter ? setter.call(el, '') : (el.value = '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    document.execCommand('selectAll', false, undefined);
    document.execCommand('delete', false, undefined);
  }
}

function submitInput(el: Element): void {
  _submitting = true;
  el.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Enter', code: 'Enter', keyCode: 13,
    bubbles: true, cancelable: true,
  }));
  setTimeout(() => { _submitting = false; }, 300);
}

// ── MCP result extraction ──────────────────────────────────────────────────────

function extractText(result: unknown): string {
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object' && 'content' in result) {
    const items = (result as any).content;
    if (Array.isArray(items))
      return items.filter((i: any) => i?.type === 'text').map((i: any) => i.text ?? '').join('\n');
  }
  if (Array.isArray(result))
    return result.filter((i): i is { type: string; text: string } => i?.type === 'text').map(i => i.text).join('\n');
  return String(result);
}

// ── Skill execution via pill ───────────────────────────────────────────────────

async function loadSkillIntoPill(el: Element, skillName: string): Promise<void> {
  try {
    logMessage(`[SlashCommands] Loading skill /${skillName} into pill`);
    const raw = await mcpClient.callTool(skillName, {});
    const content = extractText(raw);
    const memoryHint = `[Use everything you already know about me from memory to personalise this session. Do not ask me to re-introduce myself.]\n\n`;
    insertPillInInput(el, skillName, memoryHint + content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logMessage(`[SlashCommands] Failed to load /${skillName}: ${msg}`);
    setInputText(el, `/${skillName}`); // Restore so user can retry
  }
}

async function submitWithPill(el: Element): Promise<void> {
  const extracted = extractFromInput(el);
  if (!extracted) return;

  const { skillContent, userText } = extracted;
  const finalText = userText ? `${skillContent}\n\n${userText}` : skillContent;

  // Extract skill name from pill for chat hiding
  const pill = el.querySelector('.omniskill-pill');
  const skillName = pill?.textContent?.replace('⚡ ', '').trim() ?? 'skill';

  if (isAIStudio()) {
    const injected = await injectSystemPrompt(skillContent);
    if (injected) {
      clearInput(el);
      setInputText(el, userText || 'Begin.');
      watchAndHideSubmittedContent(skillName);
      submitInput(el);
      return;
    }
  }

  // Standard: inject full content, submit, then hide in chat
  clearInput(el);
  setInputText(el, finalText);
  watchAndHideSubmittedContent(skillName);
  submitInput(el);
}

// ── Main initializer ───────────────────────────────────────────────────────────

export function initSlashCommands(): void {

  // ── Input event → show autocomplete ─────────────────────────────────────────
  document.addEventListener('input', () => {
    const el = document.activeElement;
    if (!el) return;
    const isInput =
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLInputElement ||
      (el as HTMLElement).isContentEditable;
    if (!isInput) return;
    if (hasPill(el)) { autocomplete.hide(); return; } // Don't show popup when pill is present

    const text = getInputText(el).trim();
    const match = text.match(SLASH_RE);
    if (match) {
      autocomplete.show(el, match[1], async (skillName) => {
        autocomplete.hide();
        await loadSkillIntoPill(el, skillName);
      });
    } else {
      autocomplete.hide();
    }
  }, true);

  // ── Keydown → navigation + submit ───────────────────────────────────────────
  document.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (_submitting) return;

    // Autocomplete navigation
    if (autocomplete.isVisible()) {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); autocomplete.navigate('down'); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); e.stopPropagation(); autocomplete.navigate('up');   return; }
      if (e.key === 'Escape')    { e.preventDefault(); autocomplete.hide(); return; }
      if (e.key === 'Tab')       { e.preventDefault(); autocomplete.selectCurrent(); return; }
      if (e.key === 'Enter')     { e.preventDefault(); e.stopImmediatePropagation(); autocomplete.selectCurrent(); return; }
    }

    if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;

    const el = document.activeElement;
    if (!el) return;
    const isInput =
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLInputElement ||
      (el as HTMLElement).isContentEditable;
    if (!isInput) return;

    // If input has a pill, submit via pill handler
    if (hasPill(el)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      await submitWithPill(el);
      return;
    }

  }, true);

  // Hide autocomplete on outside click
  document.addEventListener('click', (e: MouseEvent) => {
    const p = document.getElementById('omniskill-autocomplete');
    if (p && !p.contains(e.target as Node)) autocomplete.hide();
  });

  logMessage('[SlashCommands] Ready — type /skill-name to start');
}
