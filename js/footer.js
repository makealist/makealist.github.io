/* ==========================================================================
   Footer component — Make A List Online
   Injects the site footer into #site-footer-root
   ========================================================================== */
(function () {
  "use strict";

  var YEAR = new Date().getFullYear();

  var FOOTER_HTML = [
    '<div class="container">',
      '<div class="footer-grid">',
        '<div class="footer-brand">',
          '<a href="/#top" class="brand">',
            '<span class="brand-mark">',
              '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
                '<path d="M4 6h16M4 12h10M4 18h13" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>',
                '<path d="M17 17l2 2 4-4" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
              '</svg>',
            '</span>',
            '<span>Make A List</span>',
          '</a>',
          '<p>A free, colorful list maker for building a to do list, grocery list, checklist or any list online — then saving it as a stylish PDF in seconds.</p>',
          '<div class="footer-social">',
            '<a href="#" aria-label="Make A List on X">',
              '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="0"/><path d="M3 3l7.5 9.6L3.4 21H6l6-6.9 4.7 6.9H21l-8-10.3L20 3h-2.6l-5.4 6.2L7.3 3H3z" fill="currentColor"/></svg>',
            '</a>',
            '<a href="#" aria-label="Make A List on GitHub">',
              '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.5v-1.87c-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.41.2 2.45.1 2.71.65.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z" fill="currentColor"/></svg>',
            '</a>',
            '<a href="#" aria-label="Make A List on Pinterest">',
              '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 0 0-3.64 19.31c-.05-.82-.09-2.08.02-2.98.1-.8.66-5.1.66-5.1s-.17-.34-.17-.83c0-.78.45-1.36 1.02-1.36.48 0 .71.36.71.79 0 .48-.31 1.2-.46 1.87-.13.56.28 1.02.83 1.02 1 0 1.77-1.06 1.77-2.58 0-1.35-.97-2.29-2.35-2.29-1.6 0-2.54 1.2-2.54 2.44 0 .48.18.99.42 1.27a.17.17 0 0 1 .04.16c-.04.18-.14.56-.16.64-.03.1-.09.13-.2.08-1.1-.44-1.7-1.86-1.7-3 0-2.44 1.9-4.85 5.36-4.85 2.8 0 4.98 1.99 4.98 4.65 0 2.77-1.75 5-4.18 5-.82 0-1.58-.43-1.84-.93l-.5 1.9c-.18.7-.68 1.58-1 2.11.75.23 1.55.36 2.38.36A10 10 0 0 0 12 2z" fill="currentColor"/></svg>',
            '</a>',
          '</div>',
        '</div>',

        '<div class="footer-col">',
          '<h4>List Maker</h4>',
          '<ul>',
            '<li><a href="/#list-maker">Online List Maker</a></li>',
            '<li><a href="/#list-maker">To Do List Maker</a></li>',
            '<li><a href="/#list-maker">Checklist Maker</a></li>',
            '<li><a href="/#list-maker">Grocery List Maker</a></li>',
            '<li><a href="/#templates">Save List as PDF</a></li>',
          '</ul>',
        '</div>',

        '<div class="footer-col">',
          '<h4>Explore</h4>',
          '<ul>',
            '<li><a href="/#list-types">List Types</a></li>',
            '<li><a href="/#how-it-works">How It Works</a></li>',
            '<li><a href="/#features">Features</a></li>',
            '<li><a href="/#use-cases">Use Cases</a></li>',
            '<li><a href="/#faq">FAQ</a></li>',
          '</ul>',
        '</div>',

        '<div class="footer-col">',
          '<h4>Company</h4>',
          '<ul>',
            '<li><a href="/#">About</a></li>',
            '<li><a href="/#">Blog</a></li>',
            '<li><a href="/#">Contact</a></li>',
            '<li><a href="/#">Privacy Policy</a></li>',
            '<li><a href="/#">Terms of Use</a></li>',
          '</ul>',
        '</div>',
      '</div>',

      '<div class="footer-bottom">',
        '<span>© ' + YEAR + ' Make A List Online — makealist.github.io. All rights reserved.</span>',
        '<span>Built for people who like their lists (and their UI) colorful.</span>',
      '</div>',
    '</div>'
  ].join("");

  function mount() {
    var root = document.getElementById("site-footer-root");
    if (!root) return;
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = FOOTER_HTML;
    root.appendChild(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
