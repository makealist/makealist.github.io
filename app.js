// MakeAList — Main Application Logic

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────
  const state = {
    lists: JSON.parse(localStorage.getItem('mal_lists') || '[]'),
    activeListId: null,
    filter: 'all',
    searchQuery: '',
    darkMode: localStorage.getItem('mal_dark') === 'true',
  };

  const LIST_TYPES = [
    { id: 'grocery',  label: 'Grocery List',   icon: '🛒', color: '#10b981' },
    { id: 'shopping', label: 'Shopping List',   icon: '🛍️', color: '#f59e0b' },
    { id: 'todo',     label: 'To-Do List',      icon: '✅', color: '#6366f1' },
    { id: 'task',     label: 'Task List',       icon: '📋', color: '#3b82f6' },
    { id: 'checklist',label: 'Checklist',       icon: '☑️', color: '#ec4899' },
    { id: 'mailing',  label: 'Mailing List',    icon: '📧', color: '#14b8a6' },
    { id: 'custom',   label: 'Custom List',     icon: '📝', color: '#8b5cf6' },
  ];

  const SUGGESTIONS = {
    grocery:   ['Milk','Eggs','Bread','Butter','Cheese','Apples','Bananas','Chicken','Rice','Pasta','Tomatoes','Onions','Garlic','Yogurt','Orange Juice','Coffee','Tea','Sugar','Salt','Olive Oil','Spinach','Carrots','Potatoes','Cereal','Water'],
    shopping:  ['T-Shirt','Jeans','Sneakers','Jacket','Headphones','Charger','Backpack','Sunglasses','Watch','Books','Notebook','Pens','Wallet','Umbrella'],
    todo:      ['Reply to emails','Exercise','Read 30 minutes','Drink 8 glasses of water','Call family','Plan weekly goals','Clean desk','Meditate','Journal','Prep meals'],
    task:      ['Write project proposal','Review documents','Schedule meeting','Update spreadsheet','Send report','Fix bug','Deploy update','Research topic','Draft email','Set deadline'],
    checklist: ['Passport','Tickets','Hotel booking','Phone charger','Adapter','Toiletries','Medications','Travel insurance','Local currency','Itinerary'],
    mailing:   ['Name','Email address','Phone number','Street address','City','State','ZIP code','Country','Company','Notes'],
    custom:    ['Item 1','Item 2','Item 3'],
  };

  function save() {
    localStorage.setItem('mal_lists', JSON.stringify(state.lists));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function getActiveList() {
    return state.lists.find(l => l.id === state.activeListId) || null;
  }

  // ── Render ─────────────────────────────────────────────────────────────
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  function renderApp() {
    appRoot.innerHTML = `
      <div class="app-shell ${state.darkMode ? 'dark' : ''}">
        ${renderSidebar()}
        <main class="app-main">
          ${state.activeListId ? renderListEditor() : renderWelcome()}
        </main>
      </div>
    `;
    attachAppEvents();
  }

  function renderSidebar() {
    return `
      <aside class="app-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">My Lists</span>
          <button class="btn-icon" id="btnNewList" title="New List" aria-label="Create new list">＋</button>
        </div>
        <div class="sidebar-search">
          <input type="search" id="sidebarSearch" placeholder="Search lists…" value="${state.searchQuery}" aria-label="Search lists">
        </div>
        <ul class="list-nav" role="list">
          ${filteredLists().map(l => `
            <li class="list-nav-item ${l.id === state.activeListId ? 'active' : ''}"
                data-id="${l.id}" role="listitem">
              <span class="list-nav-icon">${l.icon}</span>
              <span class="list-nav-name">${escHtml(l.name)}</span>
              <span class="list-nav-count">${l.items.filter(i=>!i.done).length}</span>
              <button class="list-nav-del" data-del="${l.id}" aria-label="Delete list" title="Delete">✕</button>
            </li>
          `).join('')}
          ${state.lists.length === 0 ? '<li class="list-nav-empty">No lists yet. Create one!</li>' : ''}
        </ul>
        <div class="sidebar-footer">
          <button class="btn-toggle-dark" id="btnDark" title="${state.darkMode?'Light mode':'Dark mode'}">
            ${state.darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </aside>
    `;
  }

  function filteredLists() {
    const q = state.searchQuery.toLowerCase();
    return state.lists.filter(l => !q || l.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q));
  }

  function renderWelcome() {
    return `
      <div class="app-welcome">
        <div class="welcome-emoji">📋</div>
        <h2>Welcome to MakeAList</h2>
        <p>Create grocery lists, shopping lists, to-do lists, checklists, task lists, and more — all in one place.</p>
        <div class="list-type-grid">
          ${LIST_TYPES.map(t => `
            <button class="list-type-card" data-create="${t.id}" style="--card-color:${t.color}">
              <span class="ltc-icon">${t.icon}</span>
              <span class="ltc-label">${t.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderListEditor() {
    const list = getActiveList();
    if (!list) return renderWelcome();
    const typeObj = LIST_TYPES.find(t => t.id === list.type) || LIST_TYPES[6];
    const filtered = list.items.filter(item => {
      if (state.filter === 'active') return !item.done;
      if (state.filter === 'done') return item.done;
      return true;
    });
    const doneCount = list.items.filter(i => i.done).length;
    const total = list.items.length;
    const pct = total ? Math.round((doneCount / total) * 100) : 0;

    return `
      <div class="list-editor">
        <div class="list-editor-header">
          <div class="list-meta">
            <span class="list-icon-lg" style="background:${typeObj.color}20;color:${typeObj.color}">${typeObj.icon}</span>
            <div>
              <h2 class="list-title" contenteditable="true" id="listTitleEdit" data-id="${list.id}"
                  spellcheck="false" aria-label="List name">${escHtml(list.name)}</h2>
              <span class="list-type-badge" style="background:${typeObj.color}20;color:${typeObj.color}">${typeObj.label}</span>
            </div>
          </div>
          <div class="list-actions">
            <button class="btn-secondary" id="btnExportTxt" title="Export as text">⬇ Export</button>
            <button class="btn-secondary" id="btnShare" title="Copy share link">🔗 Share</button>
            <button class="btn-secondary" id="btnClearDone" title="Clear completed">🗑 Clear Done</button>
          </div>
        </div>

        ${total > 0 ? `
        <div class="progress-bar-wrap" aria-label="${pct}% complete">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <span class="progress-label">${doneCount}/${total} done</span>
        </div>` : ''}

        <div class="list-add-row">
          <input type="text" id="newItemInput" class="item-input" placeholder="Add an item…"
            autocomplete="off" aria-label="New item" list="suggestions-list">
          <datalist id="suggestions-list">
            ${(SUGGESTIONS[list.type] || []).map(s => `<option value="${escHtml(s)}">`).join('')}
          </datalist>
          <select id="itemPriority" class="priority-select" aria-label="Priority">
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
          <input type="date" id="itemDue" class="due-input" aria-label="Due date" title="Due date">
          <button class="btn-add" id="btnAddItem">Add</button>
        </div>

        <div class="filter-bar">
          <button class="filter-btn ${state.filter==='all'?'active':''}" data-filter="all">All (${total})</button>
          <button class="filter-btn ${state.filter==='active'?'active':''}" data-filter="active">Active (${total-doneCount})</button>
          <button class="filter-btn ${state.filter==='done'?'active':''}" data-filter="done">Done (${doneCount})</button>
        </div>

        <ul class="items-list" id="itemsList" role="list">
          ${filtered.length === 0 ? '<li class="items-empty">Nothing here yet. Add your first item above!</li>' : ''}
          ${filtered.map(item => renderItem(item)).join('')}
        </ul>

        <div class="suggestions-row">
          <span class="sug-label">Quick add:</span>
          ${(SUGGESTIONS[list.type]||[]).slice(0,8).filter(s => !list.items.some(i=>i.text===s)).map(s=>`
            <button class="sug-chip" data-sug="${escHtml(s)}">${escHtml(s)}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderItem(item) {
    const priorityClass = item.priority === 'high' ? 'pri-high' : item.priority === 'low' ? 'pri-low' : '';
    const dueStr = item.due ? `<span class="item-due ${isOverdue(item.due)?'overdue':''}">${formatDate(item.due)}</span>` : '';
    return `
      <li class="item-row ${item.done ? 'done' : ''} ${priorityClass}" data-item="${item.id}" draggable="true">
        <button class="item-check" data-check="${item.id}" aria-label="${item.done?'Mark undone':'Mark done'}">
          ${item.done ? '✓' : ''}
        </button>
        <span class="item-text" contenteditable="true" data-edit="${item.id}" aria-label="Edit item">${escHtml(item.text)}</span>
        ${dueStr}
        ${item.priority !== 'normal' ? `<span class="priority-badge ${priorityClass}">${item.priority}</span>` : ''}
        <button class="item-del" data-del-item="${item.id}" aria-label="Delete item">✕</button>
      </li>
    `;
  }

  // ── Events ─────────────────────────────────────────────────────────────
  function attachAppEvents() {
    // Sidebar: new list
    const btnNew = document.getElementById('btnNewList');
    if (btnNew) btnNew.addEventListener('click', () => showNewListModal());

    // Sidebar: search
    const search = document.getElementById('sidebarSearch');
    if (search) search.addEventListener('input', e => { state.searchQuery = e.target.value; renderApp(); });

    // Sidebar: select list
    document.querySelectorAll('.list-nav-item').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[data-del]')) return;
        state.activeListId = el.dataset.id;
        state.filter = 'all';
        renderApp();
      });
    });

    // Sidebar: delete list
    document.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!confirm('Delete this list?')) return;
        state.lists = state.lists.filter(l => l.id !== btn.dataset.del);
        if (state.activeListId === btn.dataset.del) state.activeListId = null;
        save(); renderApp();
      });
    });

    // Dark mode
    const btnDark = document.getElementById('btnDark');
    if (btnDark) btnDark.addEventListener('click', () => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('mal_dark', state.darkMode);
      renderApp();
    });

    // Create from type card
    document.querySelectorAll('[data-create]').forEach(btn => {
      btn.addEventListener('click', () => createList(btn.dataset.create));
    });

    // List title edit
    const titleEl = document.getElementById('listTitleEdit');
    if (titleEl) {
      titleEl.addEventListener('blur', e => {
        const list = getActiveList();
        if (list) { list.name = e.target.innerText.trim() || list.name; save(); }
      });
      titleEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); titleEl.blur(); } });
    }

    // Add item
    const addBtn = document.getElementById('btnAddItem');
    const inputEl = document.getElementById('newItemInput');
    if (addBtn) addBtn.addEventListener('click', addItemFromInput);
    if (inputEl) inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') addItemFromInput(); });

    // Filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => { state.filter = btn.dataset.filter; renderApp(); });
    });

    // Check item
    document.querySelectorAll('[data-check]').forEach(btn => {
      btn.addEventListener('click', () => {
        const list = getActiveList();
        const item = list?.items.find(i => i.id === btn.dataset.check);
        if (item) { item.done = !item.done; save(); renderApp(); }
      });
    });

    // Delete item
    document.querySelectorAll('[data-del-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const list = getActiveList();
        if (list) { list.items = list.items.filter(i => i.id !== btn.dataset.delItem); save(); renderApp(); }
      });
    });

    // Edit item text
    document.querySelectorAll('[data-edit]').forEach(span => {
      span.addEventListener('blur', e => {
        const list = getActiveList();
        const item = list?.items.find(i => i.id === span.dataset.edit);
        if (item) { item.text = e.target.innerText.trim() || item.text; save(); }
      });
      span.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); span.blur(); } });
    });

    // Suggestions
    document.querySelectorAll('[data-sug]').forEach(btn => {
      btn.addEventListener('click', () => addItem(btn.dataset.sug, 'normal', ''));
    });

    // Export
    const btnExp = document.getElementById('btnExportTxt');
    if (btnExp) btnExp.addEventListener('click', exportList);

    // Share
    const btnShare = document.getElementById('btnShare');
    if (btnShare) btnShare.addEventListener('click', shareList);

    // Clear done
    const btnClear = document.getElementById('btnClearDone');
    if (btnClear) btnClear.addEventListener('click', () => {
      const list = getActiveList();
      if (list) { list.items = list.items.filter(i => !i.done); save(); renderApp(); }
    });
  }

  function addItemFromInput() {
    const input = document.getElementById('newItemInput');
    const priority = document.getElementById('itemPriority')?.value || 'normal';
    const due = document.getElementById('itemDue')?.value || '';
    const text = input?.value.trim();
    if (!text) return;
    addItem(text, priority, due);
    if (input) input.value = '';
  }

  function addItem(text, priority = 'normal', due = '') {
    const list = getActiveList();
    if (!list) return;
    list.items.push({ id: uid(), text, done: false, priority, due, created: Date.now() });
    save(); renderApp();
    // Refocus
    setTimeout(() => document.getElementById('newItemInput')?.focus(), 50);
  }

  function createList(type) {
    const typeObj = LIST_TYPES.find(t => t.id === type) || LIST_TYPES[6];
    const newList = {
      id: uid(),
      type,
      name: typeObj.label,
      icon: typeObj.icon,
      items: [],
      created: Date.now(),
    };
    state.lists.unshift(newList);
    state.activeListId = newList.id;
    state.filter = 'all';
    save(); renderApp();
    setTimeout(() => document.getElementById('listTitleEdit')?.focus(), 100);
  }

  function showNewListModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Create new list">
        <h3>Choose List Type</h3>
        <div class="modal-type-grid">
          ${LIST_TYPES.map(t => `
            <button class="modal-type-btn" data-create="${t.id}" style="--card-color:${t.color}">
              <span>${t.icon}</span> ${t.label}
            </button>
          `).join('')}
        </div>
        <button class="modal-close" aria-label="Close">✕</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-create]').forEach(btn => {
      btn.addEventListener('click', () => {
        createList(btn.dataset.create);
        document.body.removeChild(modal);
      });
    });
    modal.querySelector('.modal-close').addEventListener('click', () => document.body.removeChild(modal));
    modal.addEventListener('click', e => { if (e.target === modal) document.body.removeChild(modal); });
  }

  function exportList() {
    const list = getActiveList();
    if (!list) return;
    const lines = [`${list.name}\n${'─'.repeat(list.name.length)}\n`];
    list.items.forEach(item => {
      const check = item.done ? '[✓]' : '[ ]';
      const due = item.due ? ` (Due: ${item.due})` : '';
      lines.push(`${check} ${item.text}${due}`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${list.name.replace(/\s+/g,'-')}.txt`;
    a.click();
  }

  function shareList() {
    const list = getActiveList();
    if (!list) return;
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(list))));
    const url = `${location.href.split('?')[0]}?list=${data}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => prompt('Copy this link:', url));
  }

  // ── Toast ──────────────────────────────────────────────────────────────
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
  }

  // ── Utils ──────────────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function isOverdue(dateStr) {
    return dateStr && new Date(dateStr) < new Date(new Date().toDateString());
  }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month:'short', day:'numeric' });
  }

  // ── Import from URL ────────────────────────────────────────────────────
  function tryImportFromURL() {
    const params = new URLSearchParams(location.search);
    const raw = params.get('list');
    if (!raw) return;
    try {
      const list = JSON.parse(decodeURIComponent(escape(atob(raw))));
      list.id = uid();
      list.name = list.name + ' (Shared)';
      state.lists.unshift(list);
      state.activeListId = list.id;
      save();
      showToast('Shared list imported!');
    } catch (e) { /* ignore */ }
  }

  // ── Init ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    tryImportFromURL();
    if (state.lists.length) state.activeListId = state.lists[0].id;
    renderApp();
  });

})();
