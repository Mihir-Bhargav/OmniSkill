/**
 * Pill system — two responsibilities:
 * 1. Show a compact blue pill in the input instead of raw /skill-name text
 * 2. After submission, hide the wall-of-text in the chat and replace with the same pill
 */

import { logMessage } from '../utils/helpers';

const PILL_CLASS = 'omniskill-pill';
const PILL_STYLE = [
  'display:inline-flex',
  'align-items:center',
  'background:#e8f0fe',
  'color:#1a73e8',
  'border-radius:16px',
  'padding:2px 10px',
  'font-size:13px',
  'font-weight:600',
  'margin:0 2px',
  'cursor:default',
  'user-select:none',
  'vertical-align:middle',
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
  pill.textContent = `⚡ ${skillName}`;

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

// ── Chat history hiding ────────────────────────────────────────────────────────

const USER_MSG_SELECTORS = [
  '.user-query-container', '.user-query',
  'message-content[messagetype="human"]',
  '[data-message-author-role="user"] .whitespace-pre-wrap',
  '.user-prompt-container',
  '[data-role="user"] .content',
];

let _observer: MutationObserver | null = null;
let _pendingSkillName: string | null = null;
let _pendingHideTimer: ReturnType<typeof setTimeout> | null = null;

export function watchAndHideSubmittedContent(skillName: string): void {
  _pendingSkillName = skillName;
  if (_pendingHideTimer) clearTimeout(_pendingHideTimer);
  if (_observer) { _observer.disconnect(); _observer = null; }

  _observer = new MutationObserver(() => {
    if (!_pendingSkillName) return;
    const hidden = tryHideLatestUserMessage(_pendingSkillName);
    if (hidden) {
      _observer?.disconnect();
      _observer = null;
      _pendingSkillName = null;
    }
  });

  _observer.observe(document.body, { childList: true, subtree: true });

  _pendingHideTimer = setTimeout(() => {
    _observer?.disconnect();
    _observer = null;
    _pendingSkillName = null;
  }, 5000);
}

function tryHideLatestUserMessage(skillName: string): boolean {
  for (const sel of USER_MSG_SELECTORS) {
    const msgs = Array.from(document.querySelectorAll(sel));
    if (msgs.length === 0) continue;
    const latest = msgs[msgs.length - 1] as HTMLElement;
    if (latest.textContent && latest.textContent.length > 200 && !latest.dataset.omniskillHidden) {
      collapseToChip(latest, skillName);
      return true;
    }
  }
  return false;
}

function collapseToChip(el: HTMLElement, skillName: string): void {
  const original = el.innerHTML;
  el.dataset.omniskillHidden = 'true';

  // Replace with a pill + toggle
  const chip = document.createElement('span');
  chip.setAttribute('style', PILL_STYLE + ';cursor:pointer;');
  chip.textContent = `⚡ ${skillName}`;
  chip.title = 'Click to expand skill content';

  let expanded = false;
  chip.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      el.innerHTML = original;
      // Re-attach click to collapse again
      const collapseBtn = document.createElement('span');
      collapseBtn.setAttribute('style', PILL_STYLE + ';cursor:pointer;margin-left:6px;font-size:11px;');
      collapseBtn.textContent = '▲ collapse';
      collapseBtn.addEventListener('click', () => collapseToChip(el, skillName));
      el.appendChild(collapseBtn);
    } else {
      collapseToChip(el, skillName);
    }
  });

  el.innerHTML = '';
  el.appendChild(chip);
  logMessage(`[Pill] Collapsed chat message for /${skillName}`);
}
