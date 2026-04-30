/**
 * Slash command autocomplete popup.
 * Appears when the user types /  in any AI chat input.
 * Keyboard: arrows to navigate, Enter/Tab to select, Escape to dismiss.
 */

import { useToolStore } from '../stores/tool.store';
import { logMessage } from '../utils/helpers';

interface Tool { name: string; description: string; }

const POPUP_ID = 'omniskill-autocomplete';

// ── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
#${POPUP_ID} {
  position: fixed;
  z-index: 2147483647;
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  width: 340px;
  max-height: 320px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
  padding: 6px;
}
#${POPUP_ID} .os-header {
  padding: 4px 8px 6px;
  font-size: 11px;
  color: #6c7086;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
#${POPUP_ID} .os-item {
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  border-radius: 7px;
  cursor: pointer;
  gap: 2px;
  transition: background 80ms;
}
#${POPUP_ID} .os-item:hover,
#${POPUP_ID} .os-item.selected {
  background: #313244;
}
#${POPUP_ID} .os-name {
  color: #cdd6f4;
  font-weight: 600;
}
#${POPUP_ID} .os-name span {
  color: #89b4fa;
}
#${POPUP_ID} .os-desc {
  color: #7f849c;
  font-size: 11.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#${POPUP_ID} .os-empty {
  padding: 12px 10px;
  color: #6c7086;
  text-align: center;
}
`;

function injectStyles() {
  if (document.getElementById(`${POPUP_ID}-style`)) return;
  const style = document.createElement('style');
  style.id = `${POPUP_ID}-style`;
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ── Popup state ────────────────────────────────────────────────────────────────
let popup: HTMLDivElement | null = null;
let selectedIndex = 0;
let visibleTools: Tool[] = [];
let onSelect: ((name: string) => void) | null = null;

function getPopup(): HTMLDivElement {
  if (!popup) {
    injectStyles();
    popup = document.createElement('div');
    popup.id = POPUP_ID;
    document.body.appendChild(popup);
  }
  return popup;
}

function positionAboveInput(inputEl: Element) {
  const p = getPopup();
  const rect = inputEl.getBoundingClientRect();
  // Place popup above the input; if not enough room, place below
  const popupHeight = Math.min(320, visibleTools.length * 56 + 36);
  const top = rect.top - popupHeight - 8;
  p.style.left = `${rect.left}px`;
  p.style.width = `${Math.max(340, rect.width)}px`;
  if (top > 0) {
    p.style.top = `${top}px`;
    p.style.bottom = 'auto';
  } else {
    p.style.top = `${rect.bottom + 8}px`;
    p.style.bottom = 'auto';
  }
}

function renderItems(query: string) {
  const p = getPopup();
  if (visibleTools.length === 0) {
    p.innerHTML = `<div class="os-empty">No matching skills</div>`;
    return;
  }
  const highlight = (name: string) => {
    if (!query) return `<span>${name}</span>`;
    const idx = name.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return `<span>${name}</span>`;
    return `${name.slice(0, idx)}<span>${name.slice(idx, idx + query.length)}</span>${name.slice(idx + query.length)}`;
  };
  p.innerHTML =
    `<div class="os-header">OmniSkill — ${visibleTools.length} skills</div>` +
    visibleTools.map((t, i) => `
      <div class="os-item${i === selectedIndex ? ' selected' : ''}" data-index="${i}">
        <div class="os-name">/${highlight(t.name)}</div>
        <div class="os-desc">${t.description || ''}</div>
      </div>`
    ).join('');

  // Click handler
  p.querySelectorAll('.os-item').forEach(el => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault(); // don't blur input
      const idx = parseInt((el as HTMLElement).dataset.index ?? '0', 10);
      selectedIndex = idx;
      confirmSelection();
    });
  });
}

function confirmSelection() {
  if (visibleTools[selectedIndex] && onSelect) {
    onSelect(visibleTools[selectedIndex].name);
  }
  hide();
}

// ── Public API ─────────────────────────────────────────────────────────────────
export function show(inputEl: Element, query: string, selectCallback: (name: string) => void) {
  onSelect = selectCallback;
  selectedIndex = 0;

  const all: Tool[] = useToolStore.getState().availableTools as Tool[];
  visibleTools = query
    ? all.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
    : all;

  if (visibleTools.length === 0 && query.length > 0) {
    // No matches — hide unless query is very short
    if (query.length > 2) { hide(); return; }
  }

  renderItems(query);
  positionAboveInput(inputEl);
  getPopup().style.display = 'block';
  logMessage(`[Autocomplete] Showing ${visibleTools.length} skills for query "${query}"`);
}

export function hide() {
  if (popup) popup.style.display = 'none';
  visibleTools = [];
  onSelect = null;
}

export function isVisible(): boolean {
  return !!popup && popup.style.display !== 'none';
}

export function navigate(dir: 'up' | 'down') {
  if (!isVisible() || visibleTools.length === 0) return;
  selectedIndex = dir === 'down'
    ? (selectedIndex + 1) % visibleTools.length
    : (selectedIndex - 1 + visibleTools.length) % visibleTools.length;
  renderItems(''); // re-render to update highlight (query not needed for nav)
  // Scroll selected into view
  const items = getPopup().querySelectorAll('.os-item');
  items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
}

export function selectCurrent(): boolean {
  if (!isVisible()) return false;
  confirmSelection();
  return true;
}
