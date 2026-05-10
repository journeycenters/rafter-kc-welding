// Rafter KC — site behaviors

document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll state
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav .menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach((el) => observer.observe(el));

  // Safety: anything already on screen at load (or within 1.2 viewports)
  // gets revealed immediately — users without scroll never see blank sections.
  const revealInRange = () => {
    const cutoff = window.scrollY + window.innerHeight * 1.2;
    reveals.forEach((el) => {
      if (el.classList.contains('in')) return;
      if (el.getBoundingClientRect().top + window.scrollY < cutoff) {
        el.classList.add('in');
        observer.unobserve(el);
      }
    });
  };
  requestAnimationFrame(revealInRange);
  setTimeout(revealInRange, 800);

  // Honor reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Set current year
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  // Active nav link based on pathname
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav .menu a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  // Form (no backend yet — preview only)
  const form = document.querySelector('form.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Sent — we’ll be in touch';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 3000);
    });
  }
});
