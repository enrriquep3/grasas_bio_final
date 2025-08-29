/* ===============================
   Lucide icons loader (safe if already present)
   =============================== */
(function ensureLucide(cb){
  if (window.lucide && typeof window.lucide.createIcons === 'function') return cb();
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
  s.async = true;
  s.onload = cb;
  document.head.appendChild(s);
})(function initIcons(){
  try { window.lucide.createIcons(); } catch(e) {}
});

/* ===============================
   Mobile nav toggle + close behavior
   =============================== */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => navList.classList.toggle('is-open'));

  // Close after clicking a link
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('is-open'));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
      navList.classList.remove('is-open');
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navList.classList.remove('is-open');
  });
}

/* ===============================
   Mark active nav link by path
   =============================== */
(function markActiveLink() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href.endsWith(path)) link.classList.add('is-active');
  });
})();

/* ===============================
   Hero video autoplay nudge (mobile friendly)
   =============================== */
(function playHeroVideo(){
  const v = document.querySelector('.hero__video');
  if (!v) return;
  v.muted = true; v.playsInline = true;
  const tryPlay = () => v.play().catch(()=>{});
  if (document.readyState === 'complete') tryPlay();
  else window.addEventListener('load', tryPlay);
  ['touchstart','click'].forEach(evt => {
    window.addEventListener(evt, () => v.play().catch(()=>{}), { once:true, passive:true });
  });
})();

/* ===============================
   Animated counters (slower by default)
   Read optional duration from data-duration (ms). Default: 3500
   =============================== */
function animateCounter(el, target, duration = 3500) {
  const start = 0;
  const t0 = performance.now();
  function frame(now) {
    const t = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const value = Math.floor(start + (target - start) * eased);
    el.textContent = value.toLocaleString('es-CO');
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

(function setupCounters(){
  const els = document.querySelectorAll('.counter');
  if (!els.length) return;

  const run = el => {
    if (el.dataset.animated === '1') return;
    el.dataset.animated = '1';
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = parseInt(el.getAttribute('data-duration'), 10) || 3500;
    animateCounter(el, target, duration);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(run);
  }
})();

/* ===============================
   Smooth scroll for same-page anchors
   =============================== */
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
