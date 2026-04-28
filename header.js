// Header Component
function createHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <a href="/" class="logo" aria-label="MakeAList Home">
          <span class="logo-icon">✓</span>
          <span class="logo-text">Make<em>A</em>List</span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" id="navLinks" role="list">
          <li><a href="/#app" class="nav-link">App</a></li>
          <li><a href="/watchlist" class="nav-link">Watch List</a></li>
          <li><a href="/bucketlist" class="nav-link">Bucket List</a></li>
          <li><a href="#how-it-works" class="nav-link">How It Works</a></li>
          <li><a href="#faq" class="nav-link">FAQ</a></li>
          <li><a href="/#app" class="nav-cta">Start Free</a></li>
        </ul>
      </div>
    </nav>
  `;

  // Mobile toggle
  const toggle = header.querySelector('#navToggle');
  const links = header.querySelector('#navLinks');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Sticky scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll for nav links
  header.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      }
    });
  });

  return header;
}

document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header-root');
  if (headerContainer) headerContainer.appendChild(createHeader());
});
