/* ===================================================
   List Maker — core functionality
   Add / check / delete / persist / export
   =================================================== */
(function () {
  const STORAGE_KEY = 'makealist_items_v1';
  const TITLE_KEY = 'makealist_title_v1';

  let items = [];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      items = raw ? JSON.parse(raw) : [];
    } catch (e) {
      items = [];
    }
    const savedTitle = localStorage.getItem(TITLE_KEY);
    if (savedTitle) {
      const titleInput = document.getElementById('list-title');
      if (titleInput) titleInput.value = savedTitle;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* storage unavailable — fail silently, list still works in-memory */
    }
  }

  function saveTitle(title) {
    try {
      localStorage.setItem(TITLE_KEY, title);
    } catch (e) {
      /* ignore */
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    const list = document.getElementById('list-items');
    const terminal = document.querySelector('.terminal');
    const count = document.getElementById('item-count');
    if (!list) return;

    list.innerHTML = items
      .map(
        (item, i) => `
        <li data-id="${item.id}">
          <span class="line-no">${String(i + 1).padStart(2, '0')}</span>
          <button type="button" class="item-check ${item.done ? 'done' : ''}" aria-label="${item.done ? 'Mark as not done' : 'Mark as done'}" data-action="toggle" data-id="${item.id}">
            ${item.done ? '&#10003;' : ''}
          </button>
          <span class="item-text ${item.done ? 'done' : ''}">${escapeHtml(item.text)}</span>
          <button type="button" class="item-delete" aria-label="Delete item" data-action="delete" data-id="${item.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </li>`
      )
      .join('');

    const doneCount = items.filter((i) => i.done).length;
    if (count) {
      count.textContent = `${items.length} item${items.length === 1 ? '' : 's'} • ${doneCount} done`;
    }
    if (terminal) {
      terminal.classList.toggle('is-empty', items.length === 0);
    }
  }

  function addItem(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    items.push({ id: Date.now() + Math.random().toString(16).slice(2), text: trimmed, done: false });
    saveState();
    render();
  }

  function toggleItem(id) {
    const item = items.find((i) => i.id === id);
    if (item) item.done = !item.done;
    saveState();
    render();
  }

  function deleteItem(id) {
    items = items.filter((i) => i.id !== id);
    saveState();
    render();
  }

  function clearCompleted() {
    items = items.filter((i) => !i.done);
    saveState();
    render();
  }

  function clearAll() {
    if (items.length === 0) return;
    if (!confirm('Clear the entire list? This cannot be undone.')) return;
    items = [];
    saveState();
    render();
  }

  function downloadList() {
    const titleInput = document.getElementById('list-title');
    const title = (titleInput && titleInput.value.trim()) || 'my-list.txt';
    const filename = title.endsWith('.txt') ? title : `${title}.txt`;

    const body = items
      .map((i) => `${i.done ? '[x]' : '[ ]'} ${i.text}`)
      .join('\n');

    const blob = new Blob([body || '// this list is empty'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function init() {
    const form = document.getElementById('list-form');
    const input = document.getElementById('list-input');
    const listEl = document.getElementById('list-items');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const clearAllBtn = document.getElementById('clear-all');
    const downloadBtn = document.getElementById('download-list');
    const titleInput = document.getElementById('list-title');

    if (!form || !input || !listEl) return;

    loadState();
    render();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addItem(input.value);
      input.value = '';
      input.focus();
    });

    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      if (btn.dataset.action === 'toggle') toggleItem(id);
      if (btn.dataset.action === 'delete') deleteItem(id);
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);
    downloadBtn.addEventListener('click', downloadList);

    if (titleInput) {
      titleInput.addEventListener('change', () => saveTitle(titleInput.value.trim() || 'my-list.txt'));
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
