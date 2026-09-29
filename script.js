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

const form = document.querySelector('#kontakt-form');
const status = document.querySelector('.form-status');
const FORM_ENDPOINT = 'FORM_ENDPOINT_HIER_EINTRAGEN';
if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const requiredFields = [...form.querySelectorAll('[required]')];
    const invalidField = requiredFields.find((field) => !field.value.trim() || (field.type === 'checkbox' && !field.checked));
    if (invalidField) {
      status.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
      status.className = 'form-status is-error';
      invalidField.focus();
      return;
    }
    const email = form.querySelector('#email');
    if (!email.validity.valid) {
      status.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      status.className = 'form-status is-error';
      email.focus();
      return;
    }
    if (form.querySelector('.honeypot').value) return;
    const formData = new FormData(form);
    if (FORM_ENDPOINT === 'FORM_ENDPOINT_HIER_EINTRAGEN') {
      status.textContent = 'Der Formular-Dienst ist noch nicht eingerichtet. Bitte schreiben Sie direkt an lula-gartenpflege@gmail.com.';
      status.className = 'form-status is-error';
      return;
    }
    fetch(FORM_ENDPOINT, { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error('Formularversand fehlgeschlagen');
        status.textContent = 'Danke für Ihre Anfrage. Wir melden uns persönlich bei Ihnen.';
        status.className = 'form-status is-success';
        form.reset();
      })
      .catch(() => {
        status.textContent = 'Der Versand ist gerade nicht möglich. Bitte versuchen Sie es später erneut.';
        status.className = 'form-status is-error';
      });
  });
}
