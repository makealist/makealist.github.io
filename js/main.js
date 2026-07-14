/* ===================================================
   Main — scroll-reveal animations & misc UI behavior
   =================================================== */
(function () {
  let observer = null;

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Use a single observer instance
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
  }

  function initSmoothAnchors() {
    // Use event delegation instead of individual listeners
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      }
    });
  }

  // Run immediately when DOM is ready, without setTimeout
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveal();
      initSmoothAnchors();
    });
  } else {
    // DOM is already ready
    initReveal();
    initSmoothAnchors();
  }

  // Clean up observer on page unload
  window.addEventListener('beforeunload', () => {
    if (observer) {
      observer.disconnect();
    }
  });
})();
