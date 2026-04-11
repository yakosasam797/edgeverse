/* ============================================
   EDGEVERSE — MAIN JS v3.2
   Theme toggle (URL-synced), testimonials, nav, reveals
   ============================================ */

// --- THEME TOGGLE (URL-synced) ---
const themeToggles = document.querySelectorAll('.theme-toggle');
const html = document.documentElement;

// Helper: get current URL params
function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

// Helper: update a query param without reload
function setUrlParam(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url.toString());
}

function setTheme(theme, updateUrl = true) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('ev-theme', theme);
  if (updateUrl) {
    setUrlParam('theme', theme);
  }
}

// Init theme — URL param takes priority > localStorage > system preference
const urlParams = getUrlParams();
const urlTheme = urlParams.get('theme');

if (urlTheme === 'dark' || urlTheme === 'light') {
  setTheme(urlTheme);
} else {
  const savedTheme = localStorage.getItem('ev-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    // Ensure URL always reflects current theme
    setUrlParam('theme', html.getAttribute('data-theme') || 'light');
  }
}

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const curr = html.getAttribute('data-theme');
    setTheme(curr === 'dark' ? 'light' : 'dark');
  });
});

// --- CARRY THEME ACROSS NAV LINKS ---
// Append ?theme= to all internal links so the URL always reflects theme
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  // Skip external links, anchors-only, mailto, tel, javascript
  if (!href || href.startsWith('http') || href.startsWith('mailto:') ||
      href.startsWith('tel:') || href.startsWith('javascript:') ||
      href === '#') return;

  // For internal links (relative .html links or paths)
  try {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const url = new URL(href, window.location.origin);

    // Only modify links that navigate to a different page (not just #hash on same page)
    if (url.pathname === window.location.pathname && href.startsWith('#')) return;

    url.searchParams.set('theme', currentTheme);
    link.setAttribute('href', url.pathname + url.search + url.hash);
  } catch {
    // If URL parsing fails, just let the default behavior happen
  }
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
