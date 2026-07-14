/* ===================================================
   List Maker — core functionality
   Add / check / delete / persist / export
   =================================================== */
(function () {
  const STORAGE_KEY = 'makealist_items_v1';
  const TITLE_KEY = 'makealist_title_v1';

  const TEMPLATES = {
    grocery: {
      title: 'grocery-list.txt',
      items: ['Milk', 'Eggs', 'Bread', 'Bananas', 'Chicken breast', 'Rice', 'Pasta', 'Olive oil', 'Coffee', 'Paper towels']
    },
    todo: {
      title: 'to-do-list.txt',
      items: ['Reply to emails', 'Book dentist appointment', 'Pay electricity bill', 'Pick up dry cleaning', 'Call plumber', 'Renew car insurance']
    },
    checklist: {
      title: 'checklist.txt',
      items: ['Confirm venue booking', 'Send invites', 'Order supplies', 'Assign tasks', 'Test equipment', 'Print materials', 'Confirm headcount']
    },
    packing: {
      title: 'packing-list.txt',
      items: ['Passport', 'Phone charger', 'Toothbrush', 'Medication', 'Weather-appropriate clothes', 'Travel adapter', 'Headphones', 'Snacks']
    },
    shopping: {
      title: 'shopping-list.txt',
      items: ['Detergent', 'Shampoo', 'Toilet paper', 'Light bulbs', 'Batteries', 'Trash bags', 'Hand soap']
    },
    study: {
      title: 'study-list.txt',
      items: ['Review chapter notes', 'Complete practice problems', 'Watch lecture recording', 'Prepare flashcards', 'Read assigned pages', 'Join study group session']
    },
    habit: {
      title: 'habit-tracker.txt',
      items: ['Drink water', 'Stretch for 10 minutes', 'Read for 20 minutes', 'No phone after 10pm', 'Write in journal', 'Walk 8,000 steps']
    },
    project: {
      title: 'project-tasks.txt',
      items: ['Define project scope', 'Set milestones', 'Assign owners', 'Draft timeline', 'Schedule kickoff meeting', 'Set up shared docs']
    },
    bucket: {
      title: 'bucket-list.txt',
      items: ['Visit a new country', 'Learn a new language', 'Run a 5k', 'Try a new cuisine', 'Read 12 books this year', 'Learn to cook a signature dish']
    },
    reading: {
      title: 'reading-list.txt',
      items: ['Finish current book', 'Add a classic novel', 'Try a new genre', 'Reread a favorite', 'Add a nonfiction pick', 'Join a book club']
    }
  };

  let items = [];
  let renderTimeout = null;
  let listEl = null;
  let countEl = null;
  let terminalEl = null;

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
      /* storage unavailable — fail silently */
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

  // Optimized render with debouncing and DOM caching
  function render() {
    // Clear any pending render
    if (renderTimeout) {
      cancelAnimationFrame(renderTimeout);
    }

    renderTimeout = requestAnimationFrame(() => {
      if (!listEl) {
        listEl = document.getElementById('list-items');
        if (!listEl) return;
      }
      
      // Use DocumentFragment for batch DOM updates
      const fragment = document.createDocumentFragment();
      
      items.forEach((item, i) => {
        const li = document.createElement('li');
        li.dataset.id = item.id;
        
        const lineNo = document.createElement('span');
        lineNo.className = 'line-no';
        lineNo.textContent = String(i + 1).padStart(2, '0');
        li.appendChild(lineNo);
        
        const checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = `item-check ${item.done ? 'done' : ''}`;
        checkBtn.setAttribute('aria-label', item.done ? 'Mark as not done' : 'Mark as done');
        checkBtn.dataset.action = 'toggle';
        checkBtn.dataset.id = item.id;
        if (item.done) {
          checkBtn.innerHTML = '&#10003;';
        }
        li.appendChild(checkBtn);
        
        const textSpan = document.createElement('span');
        textSpan.className = `item-text ${item.done ? 'done' : ''}`;
        textSpan.textContent = item.text;
        li.appendChild(textSpan);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'item-delete';
        deleteBtn.setAttribute('aria-label', 'Delete item');
        deleteBtn.dataset.action = 'delete';
        deleteBtn.dataset.id = item.id;
        deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        li.appendChild(deleteBtn);
        
        fragment.appendChild(li);
      });
      
      // Clear and update in one operation
      listEl.innerHTML = '';
      listEl.appendChild(fragment);

      // Update counts
      if (!countEl) {
        countEl = document.getElementById('item-count');
      }
      if (countEl) {
        const doneCount = items.filter((i) => i.done).length;
        countEl.textContent = `${items.length} item${items.length === 1 ? '' : 's'} • ${doneCount} done`;
      }
      
      if (!terminalEl) {
        terminalEl = document.querySelector('.terminal');
      }
      if (terminalEl) {
        terminalEl.classList.toggle('is-empty', items.length === 0);
      }
      
      renderTimeout = null;
    });
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

  function makeId() {
    return Date.now() + Math.random().toString(16).slice(2);
  }

  function loadTemplate(key) {
    const template = TEMPLATES[key];
    if (!template) return;

    if (items.length > 0) {
      const confirmed = confirm('Loading this template will replace your current list. Continue?');
      if (!confirmed) return;
    }

    items = template.items.map((text) => ({ id: makeId(), text, done: false }));

    const titleInput = document.getElementById('list-title');
    if (titleInput) {
      titleInput.value = template.title;
      saveTitle(template.title);
    }

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

  function downloadPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF export is unavailable right now. Please check your connection and try again.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const titleInput = document.getElementById('list-title');
    const rawTitle = (titleInput && titleInput.value.trim()) || 'my-list';
    const baseName = rawTitle.replace(/\.(txt|pdf)$/i, '');

    const doc = new jsPDF();
    const margin = 20;
    const pageBottom = 280;
    let y = margin;

    doc.setFont('courier', 'bold');
    doc.setFontSize(16);
    doc.text(baseName, margin, y);
    y += 8;
    doc.setDrawColor(180);
    doc.line(margin, y, 190, y);
    y += 10;

    doc.setFont('courier', 'normal');
    doc.setFontSize(12);

    if (items.length === 0) {
      doc.text('This list is empty.', margin, y);
    } else {
      items.forEach((item) => {
        const box = item.done ? '[x]' : '[ ]';
        const lines = doc.splitTextToSize(`${box} ${item.text}`, 165);
        lines.forEach((line) => {
          if (y > pageBottom) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 8;
        });
      });
    }

    doc.save(`${baseName}.pdf`);
  }

  function init() {
    const form = document.getElementById('list-form');
    const input = document.getElementById('list-input');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const clearAllBtn = document.getElementById('clear-all');
    const downloadBtn = document.getElementById('download-list');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const titleInput = document.getElementById('list-title');
    const typeSelect = document.getElementById('list-type');

    if (!form || !input || !document.getElementById('list-items')) return;

    // Cache DOM elements
    listEl = document.getElementById('list-items');
    countEl = document.getElementById('item-count');
    terminalEl = document.querySelector('.terminal');

    loadState();
    render();

    // Use event delegation for form
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addItem(input.value);
      input.value = '';
      input.focus();
    });

    // Use event delegation for list items
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
    if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);

    if (titleInput) {
      titleInput.addEventListener('change', () => saveTitle(titleInput.value.trim() || 'my-list.txt'));
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', () => {
        const key = typeSelect.value;
        if (key === 'blank') return;
        loadTemplate(key);
        typeSelect.value = 'blank';
      });
    }

    document.querySelectorAll('[data-template]').forEach((chip) => {
      chip.addEventListener('click', () => {
        loadTemplate(chip.dataset.template);
        const tool = document.getElementById('list-maker');
        if (tool) tool.scrollIntoView({ behavior: 'smooth', block: 'start' });
        input.focus();
      });
    });
  }

  // Run init immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
