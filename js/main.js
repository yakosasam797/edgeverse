/* EDGEVERSE — MAIN JS v7 — Light-only */

// Nav scroll
const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('nav--scrolled', window.scrollY > 20), { passive: true });

// Mobile nav
const navToggle = document.querySelector('.nav__toggle');
if (navToggle && nav) navToggle.addEventListener('click', () => nav.classList.toggle('nav--open'));

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .reveal-scale');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

// Scroll statement word reveal
const stEl = document.getElementById('scroll-statement');
if (stEl) {
  const words = stEl.textContent.trim().split(/\s+/);
  stEl.innerHTML = words.map(w => '<span class="scroll-word">' + w + '</span>').join(' ');
  const scrollWords = stEl.querySelectorAll('.scroll-word');
  const sec = document.getElementById('statement');
  function upd() {
    if (!sec) return;
    var r = sec.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.5)));
    scrollWords.forEach(function(w, i) { w.classList.toggle('active', p > i / scrollWords.length + 0.1); });
  }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
}

// Features with progress bars
var fItems = document.querySelectorAll('.w-features__item');
var fSlides = document.querySelectorAll('.w-features__slide');
var fTimer = null;
var FDUR = 5000;

function showF(idx) {
  fItems.forEach(function(item, i) {
    item.classList.toggle('active', i === idx);
    var bar = item.querySelector('.w-features__progress div');
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0';
      if (i === idx) {
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            bar.style.transition = 'width ' + FDUR + 'ms linear';
            bar.style.width = '100%';
          });
        });
      }
    }
  });
  fSlides.forEach(function(s, i) { s.classList.toggle('active', i === idx); });
}

function startF() {
  clearInterval(fTimer);
  fTimer = setInterval(function() {
    var cur = document.querySelector('.w-features__item.active');
    if (!cur) return;
    var idx = parseInt(cur.dataset.feature);
    showF((idx + 1) % fSlides.length);
  }, FDUR);
}

if (fItems.length > 0) {
  showF(0);
  startF();
  fItems.forEach(function(item, i) {
    item.addEventListener('click', function() { showF(i); startF(); });
  });
  var showcase = document.querySelector('.w-features__wrap');
  if (showcase) {
    showcase.addEventListener('mouseenter', function() { clearInterval(fTimer); });
    showcase.addEventListener('mouseleave', startF);
  }
}

// Testimonials
var testimonials = [
  { quote: "Alerts in Low-Light scenarios are extremely critical.", author: "Pranay C Nath \u2014 Avid Rider" },
  { quote: "An alert for cars in your blind spot would be very helpful.", author: "Vivek C \u2014 Avid Rider" },
  { quote: "Collision detection and alert will be life saving features.", author: "Ashok P \u2014 Avid Rider" },
  { quote: "Economical blind spot alerts reduce road accident rates.", author: "Akshat P \u2014 Avid Rider" }
];
var quoteEl = document.getElementById('testimonial-quote');
var authorEl = document.getElementById('testimonial-author');
var dots = document.querySelectorAll('.testimonials-brand__dot');
var curT = 0, tTimer;

function showT(i) {
  if (!quoteEl || !authorEl) return;
  curT = i;
  quoteEl.style.opacity = '0'; authorEl.style.opacity = '0';
  quoteEl.style.transform = 'translateY(8px)';
  setTimeout(function() {
    quoteEl.textContent = testimonials[i].quote;
    authorEl.textContent = testimonials[i].author;
    quoteEl.style.opacity = '1'; authorEl.style.opacity = '1';
    quoteEl.style.transform = 'translateY(0)';
  }, 300);
  dots.forEach(function(d, j) { d.classList.toggle('active', j === i); });
}

if (quoteEl && authorEl) {
  quoteEl.style.transition = 'opacity .4s ease, transform .4s ease';
  authorEl.style.transition = 'opacity .4s ease';
  dots.forEach(function(d) {
    d.addEventListener('click', function() {
      clearInterval(tTimer);
      showT(parseInt(d.dataset.index));
      tTimer = setInterval(function() { showT((curT + 1) % testimonials.length); }, 6000);
    });
  });
  tTimer = setInterval(function() { showT((curT + 1) % testimonials.length); }, 6000);
}

// Back to top
var btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', function() { btt.classList.toggle('visible', window.scrollY > window.innerHeight); }, { passive: true });
  btt.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// Counters (other pages)
var counters = document.querySelectorAll('[data-count]');
var cObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      var el = e.target, target = parseInt(el.dataset.count), suffix = el.dataset.suffix || '', dur = 1500, start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(function(el) { cObs.observe(el); });
