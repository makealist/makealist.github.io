// Footer Component
function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="/" class="logo" aria-label="MakeAList Home">
            <span class="logo-icon">✓</span>
            <span class="logo-text">Make<em>A</em>List</span>
          </a>
          <p class="footer-tagline">The smartest way to organize your life — one list at a time.</p>
          <div class="footer-social">
            <a href="#" aria-label="Twitter" class="social-link">𝕏</a>
            <a href="#" aria-label="Facebook" class="social-link">f</a>
            <a href="#" aria-label="Instagram" class="social-link">◎</a>
            <a href="#" aria-label="Pinterest" class="social-link">𝒫</a>
          </div>
        </div>
        <div class="footer-links-grid">
          <div class="footer-col">
            <h3>List Types</h3>
            <ul>
              <li><a href="#app">Grocery List Maker</a></li>
              <li><a href="#app">Shopping List</a></li>
              <li><a href="#app">To-Do List Maker</a></li>
              <li><a href="#app">Task List</a></li>
              <li><a href="#app">Checklist Maker</a></li>
              <li><a href="#app">Mailing List</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Features</h3>
            <ul>
              <li><a href="#features">Smart Suggestions</a></li>
              <li><a href="#features">Categories & Tags</a></li>
              <li><a href="#features">Export & Share</a></li>
              <li><a href="#features">Priority Levels</a></li>
              <li><a href="#features">Due Dates</a></li>
              <li><a href="#features">Templates</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Resources</h3>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} MakeAList. All rights reserved.</p>
        <p class="footer-meta">Free online list maker — no account required.</p>
      </div>
    </div>
  `;

  // Smooth scroll
  footer.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  return footer;
}

document.addEventListener('DOMContentLoaded', () => {
  const footerContainer = document.getElementById('footer-root');
  if (footerContainer) footerContainer.appendChild(createFooter());
});
