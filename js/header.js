/* ==========================================================================
   Header component — Make A List Online
   Injects the sticky site header into #site-header-root
   ========================================================================== */
(function () {
  "use strict";

  var HEADER_HTML = [
    '<div class="header-inner">',
      '<a href="#top" class="brand" aria-label="Make A List Online home">',
        '<span class="brand-mark">',
          '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
            '<path d="M4 6h16M4 12h10M4 18h13" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>',
            '<path d="M17 17l2 2 4-4" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
          '</svg>',
        '</span>',
        '<span>Make A List<small>online list &amp; checklist maker</small></span>',
      '</a>',

      '<nav class="nav-links" id="primaryNav" aria-label="Primary">',
        '<a href="#list-maker">List Maker</a>',
        '<a href="#list-types">List Types</a>',
        '<a href="#how-it-works">How It Works</a>',
        '<a href="#templates">PDF Templates</a>',
        '<a href="#use-cases">Use Cases</a>',
        '<a href="#faq">FAQ</a>',
      '</nav>',      
    '</div>'
  ].join("");

  function mount() {
    var root = document.getElementById("site-header-root");
    if (!root) return;

    var header = document.createElement("header");
    header.className = "site-header";
    header.id = "top";
    header.innerHTML = HEADER_HTML;
    root.appendChild(header);

    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
