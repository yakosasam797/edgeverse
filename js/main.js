/* ============================================
   EDGEVERSE — Main JavaScript v2.0
   ============================================ */

// --- Navigation ---
const nav = document.getElementById('nav');
const toggle = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.nav__mobile');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav__mobile a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav--open');
  });
});

// Nav scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }

  // Dark nav on hero
  const hero = document.querySelector('.hero, .page-hero--dark');
  if (hero) {
    const heroHeight = hero.offsetHeight;
    if (scrollY < heroHeight - 80) {
      nav.classList.add('nav--dark');
    } else {
      nav.classList.remove('nav--dark');
    }
  }

  lastScroll = scrollY;
}, { passive: true });

// Initial check for dark nav
window.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero, .page-hero--dark');
  if (hero) {
    nav.classList.add('nav--dark');
  }
});

// --- Scroll Reveal ---
const revealElements = document.querySelectorAll('.reveal, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// --- Counter Animation ---
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = prefix + current + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

counters.forEach(el => counterObserver.observe(el));

// --- Smooth anchor scrolls ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Contact Form (simple handler) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Message Sent ✓';
    btn.style.background = '#00C6A7';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
