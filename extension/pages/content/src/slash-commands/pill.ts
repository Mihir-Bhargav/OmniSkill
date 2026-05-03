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
// Strategy: body overlay — Angular owns everything inside user-query-content,
// but document.body is outside its reach. We:
//   1. Hide the host element's content with a <style> using :nth-of-type
//      so Angular stripping our attributes doesn't matter.
//   2. Append a positioned <div> to document.body over the message rect.
//   3. Reposition on scroll/resize. Stop once message is gone.

const FINGERPRINT = '[Use everything you already know about me from memory';

const HOST_SELECTORS = [
  'user-query-content',
  '[data-message-author-role="user"]',
];

const HIDE_STYLE_ID = 'omniskill-hide-style';
const OVERLAY_ID = 'omniskill-overlay';

let _findObserver: MutationObserver | null = null;
let _pendingHideTimer: ReturnType<typeof setTimeout> | null = null;
let _collapsedDisplayText = '';
let _targetHost: HTMLElement | null = null;
let _rafId: number | null = null;

export function watchAndHideSubmittedContent(skillName: string, userText: string = ''): void {
  if (_pendingHideTimer) clearTimeout(_pendingHideTimer);
  if (_findObserver) { _findObserver.disconnect(); _findObserver = null; }
  removeOverlay();

  _collapsedDisplayText = userText.trim() ? `/${skillName} ${userText.trim()}` : `/${skillName}`;
  _targetHost = null;

  const existingHosts = new Set(findHosts());

  _findObserver = new MutationObserver(() => {
    if (tryCollapse(existingHosts)) {
      _findObserver?.disconnect();
      _findObserver = null;
      if (_pendingHideTimer) clearTimeout(_pendingHideTimer);
    }
  });
  _findObserver.observe(document.body, { childList: true, subtree: true });

  if (tryCollapse(existingHosts)) {
    _findObserver.disconnect();
    _findObserver = null;
    return;
  }

  _pendingHideTimer = setTimeout(() => {
    _findObserver?.disconnect();
    _findObserver = null;
    tryCollapseFallback();
  }, 8000);
}

function findHosts(): HTMLElement[] {
  for (const sel of HOST_SELECTORS) {
    const nodes = document.querySelectorAll<HTMLElement>(sel);
    if (nodes.length > 0) return Array.from(nodes);
  }
  return [];
}

function tryCollapse(existingHosts: Set<HTMLElement>): boolean {
  for (const host of findHosts()) {
    if (existingHosts.has(host)) continue;
    if (!host.textContent?.includes(FINGERPRINT)) continue;
    collapseWithOverlay(host);
    return true;
  }
  return false;
}

function tryCollapseFallback(): void {
  const all = findHosts();
  for (let i = all.length - 1; i >= 0; i--) {
    const host = all[i];
    if (!host.textContent?.includes(FINGERPRINT)) continue;
    collapseWithOverlay(host);
    return;
  }
}

function collapseWithOverlay(host: HTMLElement): void {
  _targetHost = host;

  // Assign a stable index to this host among its tag siblings so we can
  // target it with :nth-of-type in CSS (survives attribute stripping).
  const siblings = Array.from(
    host.parentElement?.children ?? []
  ).filter(el => el.tagName === host.tagName);
  const idx = siblings.indexOf(host) + 1; // 1-based for CSS

  // Inject a <style> that hides the content of this specific element.
  // We scope by parent > tag:nth-of-type(N) — no attribute needed.
  let styleEl = document.getElementById(HIDE_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = HIDE_STYLE_ID;
    document.head.appendChild(styleEl);
  }

  const parentTag = host.parentElement?.tagName.toLowerCase() ?? '*';
  const hostTag = host.tagName.toLowerCase();
  styleEl.textContent = `
${parentTag} > ${hostTag}:nth-of-type(${idx}) {
  visibility: hidden !important;
}`;

  // Create overlay on document.body
  removeOverlay();
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = [
    'position:fixed',
    'z-index:2147483647',
    'pointer-events:none',
    'color:#1a73e8',
    'font-weight:700',
    'font-family:Google Sans,Roboto,sans-serif',
    'font-size:16px',
    'line-height:1.5',
    'background:transparent',
    'display:flex',
    'align-items:center',
  ].join(';');
  overlay.textContent = _collapsedDisplayText;
  document.body.appendChild(overlay);

  positionOverlay(host, overlay);
  startRepositioning(host, overlay);

  logMessage(`[Pill] Overlay collapse for "${_collapsedDisplayText}" (nth-of-type: ${idx})`);
}

function positionOverlay(host: HTMLElement, overlay: HTMLElement): void {
  const rect = host.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

function startRepositioning(host: HTMLElement, overlay: HTMLElement): void {
  if (_rafId !== null) cancelAnimationFrame(_rafId);

  const tick = () => {
    if (!host.isConnected || !overlay.isConnected) {
      removeOverlay();
      return;
    }
    positionOverlay(host, overlay);
    _rafId = requestAnimationFrame(tick);
  };
  _rafId = requestAnimationFrame(tick);
}

function removeOverlay(): void {
  if (_rafId !== null) { cancelAnimationFrame(_rafId); _rafId = null; }
  const existing = document.getElementById(OVERLAY_ID);
  if (existing) existing.remove();
  _targetHost = null;
}
