/**
 * AI Studio system prompt injector.
 *
 * Instead of stuffing 500-line skill content into the chat input (slow, freezes page),
 * this injects it directly into AI Studio's System Instructions field.
 * The AI receives skill content as background context — user just sends "Begin."
 */

import { logMessage } from '../utils/helpers';

// AI Studio system instructions field selectors (multiple fallbacks)
const SYSTEM_FIELD_SELECTORS = [
  'ms-system-instructions textarea',
  'textarea[aria-label="System instructions"]',
  'textarea[aria-label*="system" i]',
  'textarea[placeholder*="system" i]',
  'textarea[placeholder*="Optional" i]',
  'textarea[placeholder*="instructions" i]',
  'textarea[placeholder*="tone" i]',
  '.system-instructions-container textarea',
  'ms-prompt-input[label="System instructions"] textarea',
  'ms-chunk-input textarea',
  '[data-test-id="system-instructions"] textarea',
];

// Expand button selectors — the field is often collapsed
const EXPAND_SELECTORS = [
  'ms-system-instructions button[aria-expanded="false"]',
  'button[aria-label*="system" i][aria-expanded="false"]',
  '.system-instructions button.expand',
];

function findSystemField(): HTMLTextAreaElement | null {
  for (const sel of SYSTEM_FIELD_SELECTORS) {
    const el = document.querySelector(sel) as HTMLTextAreaElement | null;
    if (el) { logMessage(`[SystemPrompt] Found field with selector: ${sel}`); return el; }
  }
  // Log all textareas on the page to help find the right selector
  const all = Array.from(document.querySelectorAll('textarea'));
  logMessage(`[SystemPrompt] No field found. All textareas on page (${all.length}):`);
  all.forEach((t, i) => logMessage(`  [${i}] placeholder="${t.placeholder}" aria-label="${t.getAttribute('aria-label')}" class="${t.className.slice(0, 60)}"`));
  return null;
}

function tryExpand(): void {
  for (const sel of EXPAND_SELECTORS) {
    const btn = document.querySelector(sel) as HTMLElement | null;
    if (btn) { btn.click(); return; }
  }
}

function setNativeValue(el: HTMLTextAreaElement, value: string): void {
  // Use React/Angular-safe native setter so the framework detects the change
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 'value'
  )?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(el, value);
  } else {
    el.value = value;
  }
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function isAIStudio(): boolean {
  return window.location.hostname === 'aistudio.google.com';
}

/**
 * Injects skill content into AI Studio's System Instructions field.
 * Returns true if successful, false if the field wasn't found.
 */
export async function injectSystemPrompt(content: string): Promise<boolean> {
  // Try to expand the system instructions panel if collapsed
  tryExpand();

  // Small delay to let the panel open
  await new Promise(r => setTimeout(r, 300));

  let field = findSystemField();

  if (!field) {
    logMessage('[SystemPrompt] System instructions field not found — falling back');
    return false;
  }

  logMessage('[SystemPrompt] Injecting skill into system instructions field');
  setNativeValue(field, content);
  field.focus();
  field.blur(); // Trigger validation/save in Angular

  return true;
}
