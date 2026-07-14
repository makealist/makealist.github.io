/* ===================================================
   Header component — Make A List Online
   Injects the site header into #header-root
   =================================================== */
(function () {
  const NAV_LINKS = [
    { href: '#list-maker', label: 'List Maker' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#use-cases', label: 'Use Cases' },
    { href: '#faq', label: 'FAQ' }
  ];

  function renderHeader() {
    const root = document.getElementById('header-root');
    if (!root) return;

    const links = NAV_LINKS.map(
      (l) => `<a class="nav-link" href="${l.href}">${l.label}</a>`
    ).join('');

    root.innerHTML = `
      <header class="site-header" id="site-header">
        <div class="container header-inner">
          <a class="brand" href="#hero" aria-label="Make A List Online — home">
            <svg viewBox="0 0 32 32" class="brand-mark" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#2563eb"/>
              <path d="M9 11h14M9 16h14M9 21h10" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
            <span class="brand-text">make<span class="brand-accent">A</span>list<span class="brand-dim">.online</span></span>
          </a>

          <nav class="site-nav" id="site-nav" aria-label="Primary">
            ${links}
          </nav>

          <a class="btn btn-primary btn-small header-cta" href="#list-maker">Make A List</a>

          <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
    `;

    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('site-nav');

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // shrink header on scroll
    const header = document.getElementById('site-header');
    window.addEventListener(
      'scroll',
      () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
      },
      { passive: true }
    );
  }

  document.addEventListener('DOMContentLoaded', renderHeader);
})();
