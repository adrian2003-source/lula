const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  const navLabel = navToggle.querySelector('.sr-only');

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    if (navLabel) {
      navLabel.textContent = isOpen ? 'Menü schließen' : 'Menü öffnen';
    }
  });

  document.querySelectorAll('.nav-menu a').forEach((link) => link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (navLabel) {
      navLabel.textContent = 'Menü öffnen';
    }
  }));
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else revealItems.forEach((item) => item.classList.add('is-visible'));
