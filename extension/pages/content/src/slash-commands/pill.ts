/**
 * Pill system — two responsibilities:
 * 1. Show a compact blue pill in the input instead of raw /skill-name text
 * 2. After submission, hide the wall-of-text in the chat and replace with the same pill
 */

import { logMessage } from '../utils/helpers';

const PILL_CLASS = 'omniskill-pill';
const PILL_STYLE = [
  'color:#1a73e8',
  'font-weight:700',
  'cursor:default',
  'user-select:none',
].join(';');

const HIDDEN_CONTENT_ATTR = 'data-omniskill-content';

// ── Input pill ─────────────────────────────────────────────────────────────────

/**
 * Replaces the current text in a contenteditable input with a pill span.
 * The full skill content is stored as a data attribute so we can retrieve
 * it on submission without any DOM tricks.
 */
export function insertPillInInput(el: Element, skillName: string, skillContent: string): void {
  if (!(el as HTMLElement).isContentEditable) {
    // Textarea fallback — just keep the short text, store content separately
    (el as HTMLTextAreaElement).value = `/${skillName} `;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  el.focus();

  // Clear existing content
  document.execCommand('selectAll', false, undefined);
  document.execCommand('delete', false, undefined);

  // Build the pill
  const pill = document.createElement('span');
  pill.className = PILL_CLASS;
  pill.setAttribute('contenteditable', 'false');
  pill.setAttribute(HIDDEN_CONTENT_ATTR, skillContent);
  pill.setAttribute('style', PILL_STYLE);
  pill.textContent = `/${skillName}`;

  // Insert pill + trailing space so user can keep typing
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.insertNode(document.createTextNode('​')); // zero-width space after
    range.insertNode(pill);
    // Move cursor after the pill
    range.setStartAfter(pill);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  el.dispatchEvent(new Event('input', { bubbles: true }));
  logMessage(`[Pill] Inserted pill for /${skillName}`);
}

/**
 * Extracts all pill contents + remaining user text from the input.
 * Returns { skillContent, userText } ready for submission.
 */
export function extractFromInput(el: Element): { skillContent: string; userText: string } | null {
  if (!(el as HTMLElement).isContentEditable) {
    return null; // Textarea handled separately
  }

  const pills = Array.from(el.querySelectorAll(`.${PILL_CLASS}`));
  if (pills.length === 0) return null;

  // Collect skill content from pills
  const skillContent = pills
    .map(p => p.getAttribute(HIDDEN_CONTENT_ATTR) ?? '')
    .join('\n\n');

  // Clone the node and remove pills to get remaining user text
  const clone = (el as HTMLElement).cloneNode(true) as HTMLElement;
  clone.querySelectorAll(`.${PILL_CLASS}`).forEach(p => p.remove());
  const userText = clone.innerText.replace(/​/g, '').trim();

  return { skillContent, userText };
}

/**
 * Returns true if the input contains at least one pill.
 */
export function hasPill(el: Element): boolean {
  return el.querySelectorAll(`.${PILL_CLASS}`).length > 0;
}

// ── Chat history collapsing ───────────────────────────────────────────────────
//
// Strategy: inject an <div class="omniskill-label"> as the first child of the
// user message container, then set display:none inline on every other child.
// Inline styles survive React/Lit re-renders better than CSS classes.
// A MutationObserver re-hides any new children Gemini streaming adds.

const FINGERPRINT = '[Use everything you already know about me from memory';
const LABEL_CLASS = 'omniskill-label';

// Ordered selector groups — each entry is [containerSelector, textSelector].
// containerSelector: the stable parent we insert our label into.
// textSelector: the child element we hide (relative to container).
const SITE_CONFIGS = [
  // Gemini: inject label before .query-text, hide .query-text itself
  { container: 'user-query-content .query-content', text: '.query-text' },
  // ChatGPT
  { container: '[data-message-author-role="user"]', text: '.whitespace-pre-wrap' },
];

let _findObserver: MutationObserver | null = null;
let _persistObserver: MutationObserver | null = null;
let _pendingHideTimer: ReturnType<typeof setTimeout> | null = null;
let _collapsedDisplayText = '';
let _activeLabel: HTMLElement | null = null;

export function watchAndHideSubmittedContent(skillName: string, userText: string = ''): void {
  if (_pendingHideTimer) clearTimeout(_pendingHideTimer);
  if (_findObserver) { _findObserver.disconnect(); _findObserver = null; }
  if (_persistObserver) { _persistObserver.disconnect(); _persistObserver = null; }

  _collapsedDisplayText = userText.trim() ? `/${skillName} ${userText.trim()}` : `/${skillName}`;
  _activeLabel = null;

  const existingContainers = new Set(findMatches().map(m => m.container));

  // Phase 1: wait for the new message to appear with fingerprint
  _findObserver = new MutationObserver(() => {
    if (tryCollapse(existingContainers)) {
      _findObserver?.disconnect();
      _findObserver = null;
      if (_pendingHideTimer) clearTimeout(_pendingHideTimer);
      startPersistObserver();
    }
  });
  _findObserver.observe(document.body, { childList: true, subtree: true });

  if (tryCollapse(existingContainers)) {
    _findObserver.disconnect();
    _findObserver = null;
    startPersistObserver();
    return;
  }

  _pendingHideTimer = setTimeout(() => {
    _findObserver?.disconnect();
    _findObserver = null;
    tryCollapseFallback();
    startPersistObserver();
  }, 8000);
}

interface SiteMatch {
  container: HTMLElement;
  textEl: HTMLElement;
}

function findMatches(): SiteMatch[] {
  for (const cfg of SITE_CONFIGS) {
    const containers = document.querySelectorAll<HTMLElement>(cfg.container);
    if (containers.length === 0) continue;
    const results: SiteMatch[] = [];
    for (const container of Array.from(containers)) {
      const textEl = container.querySelector<HTMLElement>(cfg.text);
      if (textEl) results.push({ container, textEl });
    }
    if (results.length > 0) return results;
  }
  return [];
}

function tryCollapse(existingContainers: Set<HTMLElement>): boolean {
  for (const { container, textEl } of findMatches()) {
    if (existingContainers.has(container)) continue;
    if (!textEl.textContent?.includes(FINGERPRINT)) continue;
    injectLabel(container, textEl);
    return true;
  }
  return false;
}

function tryCollapseFallback(): void {
  const all = findMatches();
  for (let i = all.length - 1; i >= 0; i--) {
    const { container, textEl } = all[i];
    if (container.querySelector(`.${LABEL_CLASS}`)) continue;
    if (!textEl.textContent?.includes(FINGERPRINT)) continue;
    injectLabel(container, textEl);
    return;
  }
}

function injectLabel(container: HTMLElement, textEl: HTMLElement): void {
  if (container.querySelector(`.${LABEL_CLASS}`)) return;

  const label = document.createElement('div');
  label.className = LABEL_CLASS;
  label.style.cssText = 'color:#1a73e8;font-weight:700;font-family:inherit;font-size:inherit;line-height:inherit;padding:8px 0;';
  label.textContent = _collapsedDisplayText;

  textEl.parentElement!.insertBefore(label, textEl);
  textEl.style.setProperty('display', 'none', 'important');
  _activeLabel = label;

  logMessage(`[Pill] Injected label "${_collapsedDisplayText}", hid .${textEl.className.split(' ')[0]}`);
}

function startPersistObserver(): void {
  if (_persistObserver) { _persistObserver.disconnect(); _persistObserver = null; }
  if (!_activeLabel) return;

  // Watch user-query-content — stable custom element Angular never replaces.
  const host = _activeLabel.closest('user-query-content, [data-message-author-role="user"]') as HTMLElement;
  if (!host) return;

  _persistObserver = new MutationObserver(() => {
    if (!host.isConnected) return;

    if (_activeLabel && !_activeLabel.isConnected) {
      // Angular wiped our label — find new .query-text and re-inject
      logMessage(`[Pill] Label removed by re-render, re-injecting...`);
      _activeLabel = null;
      const newContainer = host.querySelector<HTMLElement>('.query-content');
      const newTextEl = host.querySelector<HTMLElement>('.query-text');
      if (newContainer && newTextEl && !newContainer.querySelector(`.${LABEL_CLASS}`)) {
        injectLabel(newContainer, newTextEl);
      }
      return;
    }

    // Label present — re-hide textEl if Angular un-hid it
    if (_activeLabel) {
      const textEl = _activeLabel.nextElementSibling as HTMLElement | null;
      if (textEl && textEl.style.display !== 'none') {
        textEl.style.setProperty('display', 'none', 'important');
      }
    }
  });

  _persistObserver.observe(host, { childList: true, subtree: true });
  logMessage(`[Pill] Persist observer on <${host.tagName.toLowerCase()}>`);
}
