/* ==========================================================================
   Make A List Online — app logic
   - Interactive list maker (multiple list types)
   - Save as PDF with stylish templates (via jsPDF)
   - Scroll-reveal animations
   ========================================================================== */
(function () {
  "use strict";

  var uid = 0;
  function nextId() { uid += 1; return "i" + uid; }
  function item(text, done) { return { id: nextId(), text: text, done: !!done }; }

  var TAB_ICONS = {
    todo: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    grocery: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.3" fill="currentColor"/><circle cx="17" cy="21" r="1.3" fill="currentColor"/></svg>',
    checklist: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v14H4z" stroke="currentColor" stroke-width="2"/><path d="M7 10l2 2 4-4M7 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shopping: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 7h12l-1 12H7L6 7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="2"/></svg>',
    travel: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 19l7-14 7 14M7.5 14h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    custom: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  var STATE = {
    active: "todo",
    template: "cards",
    lists: {
      todo: {
        label: "To-Do List",
        title: "Today's To Do List",
        items: [item("Reply to client emails"), item("Finish landing page copy"), item("Book dentist appointment", true), item("30-minute walk")]
      },
      grocery: {
        label: "Grocery List",
        title: "Weekly Grocery List",
        items: [item("Bananas"), item("Oat milk"), item("Chicken breast"), item("Spinach", true), item("Olive oil")]
      },
      checklist: {
        label: "Checklist",
        title: "Trip Prep Checklist",
        items: [item("Passport & ID", true), item("Charger + power bank"), item("Travel insurance confirmed"), item("Notify bank of travel")]
      },
      shopping: {
        label: "Shopping List",
        title: "Online Shopping List",
        items: [item("Running shoes"), item("Desk lamp"), item("Notebook set", true)]
      },
      travel: {
        label: "Packing List",
        title: "Travel Packing List",
        items: [item("Passport"), item("Phone charger"), item("Toiletry bag"), item("2 pairs of shoes")]
      },
      custom: {
        label: "Custom List",
        title: "My Custom List",
        items: [item("Add your first item below")]
      }
    }
  };

  var TEMPLATE_META = {
    minimal: { name: "Minimal", bg: [255, 255, 255], ink: [23, 21, 50], accent: [124, 58, 237] },
    notebook: { name: "Notebook", bg: [255, 252, 235], ink: [61, 46, 5], accent: [251, 191, 36] },
    cards: { name: "Color Cards", bg: [255, 255, 255], ink: [23, 21, 50], accent: [244, 63, 94] },
    mono: { name: "Mono Console", bg: [23, 21, 44], ink: [255, 255, 255], accent: [6, 182, 212] }
  };

  function els() {
    return {
      tabs: document.getElementById("editorTabs"),
      titleInput: document.getElementById("listTitleInput"),
      lines: document.getElementById("listLines"),
      newItemInput: document.getElementById("newItemInput"),
      addBtn: document.getElementById("addItemBtn"),
      swatches: document.querySelectorAll(".swatch"),
      pdfBtn: document.getElementById("saveAsPdfBtn"),
      clearBtn: document.getElementById("clearDoneBtn")
    };
  }

  function renderTabs() {
    var e = els();
    if (!e.tabs) return;
    var html = "";
    Object.keys(STATE.lists).forEach(function (key) {
      var l = STATE.lists[key];
      var active = key === STATE.active ? " is-active" : "";
      html += '<button class="tab-btn' + active + '" data-tab="' + key + '" role="tab" aria-selected="' + (key === STATE.active) + '">' +
        (TAB_ICONS[key] || "") + '<span>' + l.label + '</span></button>';
    });
    e.tabs.innerHTML = html;
    e.tabs.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        STATE.active = btn.getAttribute("data-tab");
        renderTabs();
        renderEditor();
      });
    });
  }

  function renderEditor() {
    var e = els();
    var list = STATE.lists[STATE.active];
    if (!list) return;

    if (e.titleInput) e.titleInput.value = list.title;

    if (e.lines) {
      if (!list.items.length) {
        e.lines.innerHTML = '<li class="list-empty">No items yet — add your first line below.</li>';
      } else {
        e.lines.innerHTML = list.items.map(function (it, idx) {
          return '<li class="list-line' + (it.done ? " is-done" : "") + '" data-id="' + it.id + '">' +
            '<span class="line-no">' + String(idx + 1).padStart(2, "0") + '</span>' +
            '<button class="line-check" aria-label="Toggle complete" data-action="toggle" data-id="' + it.id + '">' +
              '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<span class="line-text">' + escapeHtml(it.text) + '</span>' +
            '<button class="line-del" aria-label="Delete item" data-action="delete" data-id="' + it.id + '">' +
              '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
            '</button>' +
          '</li>';
        }).join("");
      }
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function addItemFromInput() {
    var e = els();
    if (!e.newItemInput) return;
    var val = e.newItemInput.value.trim();
    if (!val) return;
    STATE.lists[STATE.active].items.push(item(val));
    e.newItemInput.value = "";
    renderEditor();
  }

  function handleLinesClick(evt) {
    var target = evt.target.closest("[data-action]");
    if (!target) return;
    var id = target.getAttribute("data-id");
    var action = target.getAttribute("data-action");
    var items = STATE.lists[STATE.active].items;
    if (action === "toggle") {
      var found = items.find(function (i) { return i.id === id; });
      if (found) found.done = !found.done;
    } else if (action === "delete") {
      STATE.lists[STATE.active].items = items.filter(function (i) { return i.id !== id; });
    }
    renderEditor();
  }

  function clearCompleted() {
    var list = STATE.lists[STATE.active];
    list.items = list.items.filter(function (i) { return !i.done; });
    renderEditor();
  }

  function selectTemplate(tpl) {
    STATE.template = tpl;
    document.querySelectorAll(".swatch").forEach(function (s) {
      s.classList.toggle("is-active", s.getAttribute("data-tpl") === tpl);
    });
  }

  function exportPdf() {
    var jspdfNs = window.jspdf;
    if (!jspdfNs || !jspdfNs.jsPDF) {
      window.alert("PDF engine is still loading — please try again in a moment.");
      return;
    }
    var list = STATE.lists[STATE.active];
    var meta = TEMPLATE_META[STATE.template] || TEMPLATE_META.minimal;
    var doc = new jspdfNs.jsPDF({ unit: "pt", format: "a4" });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var margin = 48;

    doc.setFillColor(meta.bg[0], meta.bg[1], meta.bg[2]);
    doc.rect(0, 0, pageW, pageH, "F");

    if (STATE.template === "notebook") {
      doc.setDrawColor(251, 224, 150);
      for (var y = 120; y < pageH - 40; y += 26) {
        doc.line(margin, y, pageW - margin, y);
      }
      doc.setDrawColor(244, 63, 94);
      doc.line(margin + 26, 60, margin + 26, pageH - 40);
    }

    if (STATE.template === "cards") {
      doc.setFillColor(meta.accent[0], meta.accent[1], meta.accent[2]);
      doc.rect(0, 0, pageW, 10, "F");
    }

    if (STATE.template === "mono") {
      doc.setFillColor(30, 27, 58);
      doc.roundedRect(margin - 14, 50, pageW - (margin - 14) * 2, 46, 8, 8, "F");
    }

    doc.setTextColor(meta.ink[0], meta.ink[1], meta.ink[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(list.title || "My List", margin, 84);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(meta.accent[0], meta.accent[1], meta.accent[2]);
    doc.text("Made with Make A List Online — makealist.github.io", margin, 102);

    var cursorY = 140;
    doc.setFontSize(13);
    list.items.forEach(function (it) {
      if (cursorY > pageH - 60) {
        doc.addPage();
        doc.setFillColor(meta.bg[0], meta.bg[1], meta.bg[2]);
        doc.rect(0, 0, pageW, pageH, "F");
        cursorY = 70;
      }
      var boxX = margin;
      doc.setDrawColor(meta.accent[0], meta.accent[1], meta.accent[2]);
      doc.setLineWidth(1.4);
      if (it.done && STATE.template === "cards") {
        doc.setFillColor(meta.accent[0], meta.accent[1], meta.accent[2]);
        doc.roundedRect(boxX, cursorY - 11, 14, 14, 3, 3, "F");
      } else {
        doc.roundedRect(boxX, cursorY - 11, 14, 14, 3, 3, "S");
      }
      doc.setTextColor(meta.ink[0], meta.ink[1], meta.ink[2]);
      var text = it.text + (it.done ? "  (done)" : "");
      doc.text(text, boxX + 24, cursorY);
      cursorY += 28;
    });

    var fname = (list.title || "list").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    doc.save((fname || "make-a-list") + ".pdf");
  }

  function initListMaker() {
    var e = els();
    renderTabs();
    renderEditor();

    if (e.titleInput) {
      e.titleInput.addEventListener("input", function () {
        STATE.lists[STATE.active].title = e.titleInput.value;
      });
    }
    if (e.addBtn) e.addBtn.addEventListener("click", addItemFromInput);
    if (e.newItemInput) {
      e.newItemInput.addEventListener("keydown", function (evt) {
        if (evt.key === "Enter") { evt.preventDefault(); addItemFromInput(); }
      });
    }
    if (e.lines) e.lines.addEventListener("click", handleLinesClick);
    if (e.clearBtn) e.clearBtn.addEventListener("click", clearCompleted);
    if (e.pdfBtn) e.pdfBtn.addEventListener("click", exportPdf);

    document.querySelectorAll(".swatch").forEach(function (sw) {
      sw.addEventListener("click", function () { selectTemplate(sw.getAttribute("data-tpl")); });
    });

    document.querySelectorAll("[data-load-type]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-load-type");
        if (STATE.lists[key]) {
          STATE.active = key;
          renderTabs();
          renderEditor();
          var editorEl = document.getElementById("list-maker");
          if (editorEl) editorEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function initReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (!("IntersectionObserver" in window) || !targets.length) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  function init() {
    initListMaker();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
