// Stinger Solutions LLC — site behavior

document.addEventListener('DOMContentLoaded', () => {

  // ---- footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- mobile nav toggle ----
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) closeAllDropdowns();
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
      });
    });
  }

  // ---- services nav dropdown ----
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  function closeAllDropdowns() {
    dropdownItems.forEach(item => {
      item.classList.remove('open');
      const toggle = item.querySelector('.dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownItems.forEach(item => {
    const toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !item.classList.contains('open');
      closeAllDropdowns();
      if (willOpen) {
        item.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // ---- active nav link (multi-page) ----
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a[href]:not(.nav-cta)').forEach(link => {
    const linkPage = link.getAttribute('href').split('#')[0] || 'index.html';
    if (linkPage === currentPage) link.classList.add('active');
  });
  if (currentPage === 'services.html') {
    const servicesToggle = document.getElementById('servicesToggle');
    if (servicesToggle) servicesToggle.classList.add('active');
  }

  // ---- contact form (static-site friendly: opens a pre-filled email) ----
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const interest = form.interest.value;
      const message = form.message.value.trim();

      if (!name || !email) {
        formNote.textContent = 'Please fill in your name and email.';
        formNote.style.color = 'var(--danger)';
        return;
      }

      const subject = encodeURIComponent(`New inquiry: ${interest}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Interested in: ${interest}`,
        '',
        message || '(no message provided)'
      ].filter(Boolean);
      const body = encodeURIComponent(bodyLines.join('\n'));

      window.location.href = `mailto:stingersolutionsdev@gmail.com?subject=${subject}&body=${body}`;

      formNote.textContent = 'Opening your email client to send this message…';
      formNote.style.color = 'var(--teal)';
    });
  }
});
