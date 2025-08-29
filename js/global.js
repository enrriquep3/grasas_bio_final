/* ========== Mobile nav toggle ========== */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('is-open');
  });

  // Close menu when clicking a link (mobile)
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('is-open'));
  });
}

/* ========== Animated counters (IO + RAF) ========== */
function animateCounter(el, target, duration = 1600) {
  const start = 0;
  const startTime = performance.now();
  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (target - start) * progress);
    // es-CO formatting (thousands as dots)
    el.textContent = value.toLocaleString('es-CO');
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterEls = document.querySelectorAll('.counter');
if ('IntersectionObserver' in window && counterEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        animateCounter(el, target);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counterEls.forEach(el => io.observe(el));
} else {
  // Fallback: animate immediately
  counterEls.forEach(el => animateCounter(el, parseInt(el.dataset.target, 10) || 0));
}

/* ========== Smooth scroll for same-page anchors ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========== Highlight active nav item by path ========== */
(function markActiveLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(path)) {
      link.classList.add('is-active');
    }
  });
})();
