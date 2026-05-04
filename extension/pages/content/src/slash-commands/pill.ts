/**
 * Pill system — shows a compact blue pill in the input instead of raw /skill-name text.
 * Full skill content is stored as a data attribute and extracted on submission.
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

export function insertPillInInput(el: Element, skillName: string, skillContent: string): void {
  if (!(el as HTMLElement).isContentEditable) {
    (el as HTMLTextAreaElement).value = `/${skillName} `;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  el.focus();
  document.execCommand('selectAll', false, undefined);
  document.execCommand('delete', false, undefined);

  const pill = document.createElement('span');
  pill.className = PILL_CLASS;
  pill.setAttribute('contenteditable', 'false');
  pill.setAttribute(HIDDEN_CONTENT_ATTR, skillContent);
  pill.setAttribute('style', PILL_STYLE);
  pill.textContent = `/${skillName}`;

  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.insertNode(document.createTextNode('​'));
    range.insertNode(pill);
    range.setStartAfter(pill);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  el.dispatchEvent(new Event('input', { bubbles: true }));
  logMessage(`[Pill] Inserted pill for /${skillName}`);
}

export function extractFromInput(el: Element): { skillContent: string; userText: string } | null {
  if (!(el as HTMLElement).isContentEditable) return null;

  const pills = Array.from(el.querySelectorAll(`.${PILL_CLASS}`));
  if (pills.length === 0) return null;

  const skillContent = pills
    .map(p => p.getAttribute(HIDDEN_CONTENT_ATTR) ?? '')
    .join('\n\n');

  const clone = (el as HTMLElement).cloneNode(true) as HTMLElement;
  clone.querySelectorAll(`.${PILL_CLASS}`).forEach(p => p.remove());
  const userText = clone.innerText.replace(/​/g, '').trim();

  return { skillContent, userText };
}

export function hasPill(el: Element): boolean {
  return el.querySelectorAll(`.${PILL_CLASS}`).length > 0;
}
