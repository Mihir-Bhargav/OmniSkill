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

// Fetch skill content — tries the MCP server first, falls back to bundled SKILL.md file.
async function fetchSkillContent(skillName: string): Promise<string> {
  if (mcpClient.isReady()) {
    try {
      const result = await mcpClient.callTool(skillName, {});
      return extractText(result);
    } catch { /* fall through to bundled */ }
  }
  const url = chrome.runtime.getURL(`skills/${skillName}/SKILL.md`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Skill not found: ${skillName}`);
  return res.text();
}

function prefetchSkills(skillNames: string[]): void {
  for (const name of skillNames) {
    if (_prefetchCache.has(name)) continue;
    _prefetchCache.set(
      name,
      fetchSkillContent(name).catch(() => {
        _prefetchCache.delete(name);
        return '';
      })
    );
  }
}

// ── Pending skill visual indicator ────────────────────────────────────────────

let _styleEl: HTMLStyleElement | null = null;

function injectPillStyle(): void {
  if (_styleEl) return;
  _styleEl = document.createElement('style');
  _styleEl.id = 'omniskill-pending-style';
  _styleEl.textContent = `[data-omniskill-pill]{color:#1a73e8!important;font-weight:700!important;user-select:none;cursor:default}`;
  document.head.appendChild(_styleEl);
}


function clearPendingStyle(el: Element): void {
  el.querySelectorAll('[data-omniskill-pill]').forEach(span => {
    span.replaceWith(...Array.from(span.childNodes));
  });
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

function isLovable(): boolean {
  return location.hostname.includes('lovable.dev');
}

function isTextareaEditor(): boolean {
  // Platforms with real <textarea> inputs use _pendingSkill side-state instead of DOM pill.
  // ChatGPT uses ProseMirror (contentEditable) but also routes through _pendingSkill.
  return isChatGPT() || isGitHubCopilot() || isLovable();
}

async function setInputText(el: Element, text: string): Promise<void> {
  el.focus();
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    setter ? setter.call(el, text) : (el.value = text);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (isChatGPT()) {
    // ProseMirror needs <p> per line — plain text nodes collapse newlines into one block
    const htmlEl = el as HTMLElement;
    htmlEl.innerHTML = text
      .split('\n')
      .map(line => `<p>${line.length === 0 ? '<br>' : line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
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
    const sendBtn = document.querySelector<HTMLButtonElement>(
      'button[aria-labelledby*="Send"], button:has(.octicon-paper-airplane), button[type="submit"]'
    );
    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
    } else {
      el.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true,
      }));
    }
  } else if (isLovable()) {
    // Lovable uses a round send button — click it directly
    const sendBtn = document.querySelector<HTMLButtonElement>(
      'button.rounded-full.bg-foreground, button[type="submit"], button[aria-label*="Send"], button[title*="Send"]'
    );
    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
    } else {
      el.closest('form')?.dispatchEvent(new KeyboardEvent('keydown', {
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
    const contentPromise = _prefetchCache.get(skillName) ?? fetchSkillContent(skillName);
    _prefetchCache.delete(skillName);
    const content = await contentPromise;

    if (isChatGPT()) {
      // Set innerHTML WITHOUT firing input event — React won't re-render so our
      // blue span survives. React reconciles on the next real user keypress.
      _pendingSkill = { name: skillName, content };
      injectPillStyle();
      const htmlEl = el as HTMLElement;
      htmlEl.focus();
      htmlEl.innerHTML =
        `<p><span data-omniskill-pill="true">/${skillName}</span> </p>`;
      // Move cursor to end without triggering React
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(htmlEl);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      logMessage(`[SlashCommands] Pending skill set (ChatGPT): /${skillName}`);
    } else if (isTextareaEditor()) {
      // GitHub Copilot textarea — no partial colour possible, just set text
      _pendingSkill = { name: skillName, content };
      await setInputText(el, `/${skillName} `);
      logMessage(`[SlashCommands] Pending skill set (Copilot): /${skillName}`);
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

    clearPendingStyle(el);
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
    if (hasPill(el) || _pendingSkill) {
      autocomplete.hide();
      // If input is empty or doesn't start with /skillname, skill was consumed — clear state
      if (_pendingSkill) {
        const inputText = getInputText(el as Element).trim().replace(/\n/g, '');
        if (inputText === '' || !inputText.startsWith(`/${_pendingSkill.name}`)) {
          _pendingSkill = null;
          clearPendingStyle(el as Element);
          // Don't return — fall through so autocomplete can show if text matches /
        } else {
          return;
        }
      } else {
        return;
      }
    }

    const text = getInputText(el).trim().replace(/\n/g, '');
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
        if (el) clearPendingStyle(el);
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

  // First-run banner: shown once after the very first successful connection.
  // Lets users know / is the trigger without needing to find the sidebar.
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'connection:status-changed' && message?.payload?.isConnected) {
      showFirstRunBanner();
    }
  });
}

// ── First-run banner ───────────────────────────────────────────────────────────

function showFirstRunBanner(): void {
  chrome.storage.local.get('omniskillFirstRunDone', (result) => {
    if (result.omniskillFirstRunDone) return;
    chrome.storage.local.set({ omniskillFirstRunDone: true });

    const BANNER_ID = 'omniskill-first-run-banner';
    if (document.getElementById(BANNER_ID)) return;

    const style = document.createElement('style');
    style.textContent = `
      #${BANNER_ID} {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        background: #1e1e2e;
        border: 1px solid #313244;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
        padding: 12px 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 13px;
        color: #cdd6f4;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        animation: omniskill-fadein 0.2s ease;
      }
      #${BANNER_ID} .os-banner-key {
        background: #313244;
        border-radius: 5px;
        padding: 2px 7px;
        color: #89b4fa;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.02em;
      }
      @keyframes omniskill-fadein {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    const banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.innerHTML = `<span class="os-banner-key">/</span><span>OmniSkill connected — type <strong>/</strong> to use your skills</span>`;
    document.body.appendChild(banner);

    const dismiss = () => {
      banner.style.opacity = '0';
      banner.style.transition = 'opacity 0.2s';
      setTimeout(() => { banner.remove(); style.remove(); }, 200);
    };

    banner.addEventListener('click', dismiss);
    setTimeout(dismiss, 6000);
  });
}
