/* ===================================================
   Footer component — Make A List Online
   Injects the site footer into #footer-root
   =================================================== */
(function () {
  function renderFooter() {
    const root = document.getElementById('footer-root');
    if (!root) return;

    const year = new Date().getFullYear();

    root.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <div class="brand">
              <svg viewBox="0 0 32 32" class="brand-mark" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="#2563eb"/>
                <path d="M9 11h14M9 16h14M9 21h10" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
              </svg>
              <span class="brand-text">make<span class="brand-accent">A</span>list<span class="brand-dim">.online</span></span>
            </div>
            <p class="footer-blurb">
              A free list maker for making a list online — to do lists, checklists, grocery lists and more,
              built to run entirely in your browser with no sign-up.
            </p>
          </div>

          <div class="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#list-maker">List Maker</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>List Types</h4>
            <ul>
              <li><a href="#use-cases">Grocery List Maker</a></li>
              <li><a href="#use-cases">To Do List Maker</a></li>
              <li><a href="#use-cases">Checklist Maker</a></li>
              <li><a href="#use-cases">Online Shopping List Maker</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>About</h4>
            <p class="footer-note">
              Make A List Online is a lightweight list website — no accounts, no tracking of your list content,
              just a fast place to create a list online whenever you need one.
            </p>
          </div>
        </div>

        <div class="container footer-bottom">
          <p>&copy; ${year} Make A List Online. All lists belong to you.</p>
          <a href="#hero" class="back-to-top">Back to top ↑</a>
        </div>
      </footer>
    `;
  }

  document.addEventListener('DOMContentLoaded', renderFooter);
})();
