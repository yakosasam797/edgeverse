/* ============================================
   EDGEVERSE — MAIN JS v3.1
   Theme toggle, testimonials, nav, reveals
   ============================================ */

// --- THEME TOGGLE ---
const themeToggles = document.querySelectorAll('.theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('ev-theme', theme);
}

// Init theme
const savedTheme = localStorage.getItem('ev-theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const curr = html.getAttribute('data-theme');
    setTheme(curr === 'dark' ? 'light' : 'dark');
  });
});

// --- NAV SCROLL ---
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  if (nav) {
    nav.classList.toggle('nav--scrolled', scroll > 20);
  }
  lastScroll = scroll;
}, { passive: true });

// --- MOBILE NAV TOGGLE ---
const navToggle = document.querySelector('.nav__toggle');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
  });
}

// --- SCROLL REVEAL ---
const reveals = document.querySelectorAll('.reveal, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// --- ANIMATED COUNTERS ---
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// --- WAYMO-STYLE TESTIMONIALS ---
const testimonials = [
  {
    quote: "Alerts in Low-Light scenarios are extremely critical.",
    author: "Pranay C Nath — Avid Rider"
  },
  {
    quote: "An alert for cars in your blind spot would be very helpful.",
    author: "Vivek C — Avid Rider"
  },
  {
    quote: "Collision detection and alert will be life saving features.",
    author: "Ashok P — Avid Rider"
  },
  {
    quote: "Economical blind spot alerts reduce road accident rates.",
    author: "Akshat P — Avid Rider"
  }
];

const quoteEl = document.getElementById('testimonial-quote');
const authorEl = document.getElementById('testimonial-author');
const dots = document.querySelectorAll('.testimonials-brand__dot');
let currentTestimonial = 0;
let testimonialTimer;

function showTestimonial(index) {
  if (!quoteEl || !authorEl) return;
  currentTestimonial = index;

  // Fade out
  quoteEl.style.opacity = '0';
  authorEl.style.opacity = '0';
  quoteEl.style.transform = 'translateY(8px)';

  setTimeout(() => {
    quoteEl.textContent = testimonials[index].quote;
    authorEl.textContent = testimonials[index].author;

    // Fade in
    quoteEl.style.opacity = '1';
    authorEl.style.opacity = '1';
    quoteEl.style.transform = 'translateY(0)';
  }, 300);

  // Update dots
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

function startTestimonialTimer() {
  testimonialTimer = setInterval(() => {
    showTestimonial((currentTestimonial + 1) % testimonials.length);
  }, 6000);
}

if (quoteEl && authorEl) {
  quoteEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  authorEl.style.transition = 'opacity 0.4s ease';

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(testimonialTimer);
      showTestimonial(parseInt(dot.dataset.index));
      startTestimonialTimer();
    });
  });

  startTestimonialTimer();
}

// --- BLOG CATEGORY FILTER ---
const catBtns = document.querySelectorAll('.blog-section__cat');
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
