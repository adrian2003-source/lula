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

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = [...form.querySelectorAll('[required]')];
    const invalidField = requiredFields.find((field) => !field.value.trim());
    if (invalidField) {
      status.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
      status.className = 'form-status is-error';
      invalidField.focus();
      return;
    }

    const email = form.querySelector('#email');
    if (email && !email.value.trim() && email.hasAttribute('required')) {
      status.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      status.className = 'form-status is-error';
      email.focus();
      return;
    }

    if (email && email.value.trim() && !email.validity.valid) {
      status.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      status.className = 'form-status is-error';
      email.focus();
      return;
    }

    const honeypot = form.querySelector('.honeypot');
    if (honeypot && honeypot.value.trim()) {
      status.textContent = 'Ihre Anfrage wurde als Spam erkannt. Bitte senden Sie uns stattdessen per E-Mail oder WhatsApp.';
      status.className = 'form-status is-error';
      return;
    }

    const formData = new FormData(form);
    const values = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'photo' || !(typeof value === 'string')) continue;
      values[key] = value.trim();
    }

    const name = String(values.name || '').trim();
    const phone = String(values.phone || '').trim();
    const emailValue = String(values.email || '').trim();
    const city = String(values.city || '').trim();
    const service = String(values.service || '').trim();
    const message = String(values.message || '').trim();

    const subject = encodeURIComponent(name ? `Neue Anfrage von ${name}` : 'Neue Anfrage LULA Gartenpflege');
    const body = encodeURIComponent(
      [
        'Name: ' + name,
        'Telefon: ' + phone,
        'E-Mail: ' + emailValue,
        'Ort: ' + city,
        'Gewünschte Leistung: ' + service,
        '',
        'Nachricht:',
        message,
      ].join('\n')
    );

    window.location.href = `mailto:lula.gartenpflege@gmail.com?subject=${subject}&body=${body}`;

    status.textContent = 'Ihr E-Mail-Programm wurde geöffnet. Bitte senden Sie den Entwurf ab.';
    status.className = 'form-status is-success';
    form.reset();
  });
}
