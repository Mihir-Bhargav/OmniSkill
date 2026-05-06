/**
 * Slash command handler with pill UX.
 *
 * Flow:
 *   1. User types /skill-name → autocomplete popup appears
 *   2. User selects → MCP skill is called, pill inserted in input
 *   3. User can keep typing after the pill
 *   4. User presses Enter → full skill content + user text submitted as-is
 */

import { mcpClient } from '../core/mcp-client';
import { logMessage } from '../utils/helpers';
import * as autocomplete from './autocomplete';
import { isAIStudio, injectSystemPrompt } from './system-prompt';
import {
  insertPillInInput,
  extractFromInput,
  hasPill,
} from './pill';

const SLASH_RE = /^\/([a-zA-Z0-9_-]*)$/;

let _submitting = false;

// Prefetch cache — populated when autocomplete opens, consumed on selection
const _prefetchCache = new Map<string, Promise<string>>();

// Side-state for textarea-based editors (ChatGPT, GitHub Copilot) where DOM pill can't be used.
let _pendingSkill: { name: string; content: string } | null = null;

function prefetchSkills(skillNames: string[]): void {
  for (const name of skillNames) {
    if (_prefetchCache.has(name)) continue;
    if (!mcpClient.isReady()) break;
    _prefetchCache.set(
      name,
      mcpClient.callTool(name, {}).then(extractText).catch(() => {
        _prefetchCache.delete(name);
        return '';
      })
    );
  }
}

// ── Input helpers ──────────────────────────────────────────────────────────────

function getInputText(el: Element): string {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return el.value;
  return (el as HTMLElement).innerText ?? '';
}

function isChatGPT(): boolean {
  return location.hostname.includes('chatgpt.com');
}

function isGitHubCopilot(): boolean {
  return location.hostname.includes('github.com');
}

function isTextareaEditor(): boolean {
  // Only GitHub Copilot uses true textarea — ChatGPT is contentEditable (DOM pill)
  return isGitHubCopilot();
}

async function setInputText(el: Element, text: string): Promise<void> {
  el.focus();
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    setter ? setter.call(el, text) : (el.value = text);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else if (isChatGPT()) {
    // ProseMirror needs <p> per paragraph — plain text nodes collapse newlines
    const htmlEl = el as HTMLElement;
    htmlEl.innerHTML = text
      .split('\n')
      .map(line => `<p>${line === '' ? '<br>' : line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('');
    htmlEl.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    await new Promise(r => setTimeout(r, 50));
  } else {
    const htmlEl = el as HTMLElement;
    htmlEl.innerHTML = '';
    htmlEl.appendChild(document.createTextNode(text));
    htmlEl.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    await new Promise(r => setTimeout(r, 50));
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
  if (isChatGPT()) {
    const sendBtn = document.querySelector<HTMLButtonElement>(
      'button[data-testid="send-button"], button[aria-label*="Send message"]'
    );
    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
    } else {
      el.closest('form')?.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true,
      }));
    }
  } else if (isGitHubCopilot()) {
    // GitHub Copilot doesn't submit on textarea keydown — click the send button
    const sendBtn = document.querySelector<HTMLButtonElement>(
      'button[aria-labelledby*="Send"], button:has(.octicon-paper-airplane), button[type="submit"]'
    );
    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
    } else {
      // Fallback: Enter on the textarea
      el.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true,
      }));
    }
  } else {
    el.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter', code: 'Enter', keyCode: 13,
      bubbles: true, cancelable: true,
    }));
  }
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
    const contentPromise = _prefetchCache.get(skillName) ?? mcpClient.callTool(skillName, {}).then(extractText);
    _prefetchCache.delete(skillName);
    const content = await contentPromise;

    if (isTextareaEditor()) {
      // GitHub Copilot textarea: show /skillname in blue to signal skill is loaded.
      _pendingSkill = { name: skillName, content };
      await setInputText(el, `/${skillName} `);
      (el as HTMLElement).style.color = '#1a73e8';
      (el as HTMLElement).style.fontWeight = '700';
      logMessage(`[SlashCommands] Pending skill set: /${skillName}`);
    } else {
      insertPillInInput(el, skillName, content);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logMessage(`[SlashCommands] Failed to load /${skillName}: ${msg}`);
    await setInputText(el, `/${skillName}`);
  }
}

async function submitWithPill(el: Element): Promise<void> {
  // Textarea path (GitHub Copilot): combine user text with skill content then submit
  if (isTextareaEditor() && _pendingSkill) {
    const { content: skillContent } = _pendingSkill;
    _pendingSkill = null;

    const rawText = getInputText(el);
    const userText = rawText.replace(/^\/[\w-]+\s*/, '').trim();
    const finalText = userText ? `${userText}\n\n---\n\n${skillContent}` : skillContent;

    // Reset textarea styling before submitting
    (el as HTMLElement).style.color = '';
    (el as HTMLElement).style.fontWeight = '';
    await setInputText(el, finalText);
    await new Promise(r => setTimeout(r, 80)); // let React settle before submit
    submitInput(el);
    return;
  }

  // DOM pill path (Gemini, AI Studio, others)
  const extracted = extractFromInput(el);
  if (!extracted) return;

  const { skillContent, userText } = extracted;
  const finalText = userText ? `${userText}\n\n---\n\n${skillContent}` : skillContent;

  if (isAIStudio()) {
    const injected = await injectSystemPrompt(skillContent);
    if (injected) {
      clearInput(el);
      await setInputText(el, userText || 'Begin.');
      submitInput(el);
      return;
    }
  }

  clearInput(el);
  await setInputText(el, finalText);
  submitInput(el);
}

// ── Main initializer ───────────────────────────────────────────────────────────

export function initSlashCommands(): void {

  document.addEventListener('input', () => {
    const el = document.activeElement;
    if (!el) return;
    const isInput =
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLInputElement ||
      (el as HTMLElement).isContentEditable;
    if (!isInput) return;
    if (hasPill(el) || _pendingSkill) { autocomplete.hide(); return; }

    const text = getInputText(el).trim();
    const match = text.match(SLASH_RE);
    if (match) {
      autocomplete.show(el, match[1], async (skillName) => {
        autocomplete.hide();
        await loadSkillIntoPill(el, skillName);
      });
      prefetchSkills(autocomplete.getVisibleToolNames().slice(0, 5));
    } else {
      autocomplete.hide();
      if (text === '' && _pendingSkill) {
        _pendingSkill = null;
        logMessage('[SlashCommands] Pending skill cleared (input emptied)');
      }
    }
  }, true);

  document.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (_submitting) return;

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

    if (hasPill(el) || _pendingSkill) {
      e.preventDefault();
      e.stopImmediatePropagation();
      await submitWithPill(el);
      return;
    }
  }, true);

  document.addEventListener('click', (e: MouseEvent) => {
    const p = document.getElementById('omniskill-autocomplete');
    if (p && !p.contains(e.target as Node)) autocomplete.hide();
  });

  logMessage('[SlashCommands] Ready — type /skill-name to start');
}
