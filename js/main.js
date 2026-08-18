/* ══════════════════════════════════════════════════════════════
   JIREH ASESORES DE SEGUROS — main.js
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── WhatsApp config ─────────────────────────────────────── */
  var WA_NUMBER = '529322068037';

  /* ── Loader ───────────────────────────────────────────────── */
  function hideLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return revealHero();
    window.setTimeout(function () {
      loader.classList.add('is-hidden');
      revealHero();
    }, reduceMotion ? 0 : 900);
  }

  function revealHero() {
    var title = document.getElementById('hero-heading');
    if (title) title.classList.add('is-revealed');
  }

  window.addEventListener('load', hideLoader);
  // Safety net in case 'load' fires very late (slow external assets)
  window.setTimeout(hideLoader, 4000);

  /* ── Navbar scroll state + mobile menu ───────────────────── */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ── Scroll reveal ────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Marquee content ──────────────────────────────────────── */
  var marqueeWords = [
    'Seguro de Auto', 'Seguro de Vida', 'Gastos Médicos Mayores',
    'Seguro de Viaje', 'Protección de Hogar', 'Protección por Invalidez',
    'Daños a Terceros', 'Asesoría Personalizada'
  ];
  var marqueeEl = document.getElementById('marquee');
  if (marqueeEl) {
    var buildSet = function () {
      return marqueeWords.map(function (w) {
        return '<span class="marquee-item"><i class="fa-solid fa-shield-halved"></i>' + w + '</span>';
      }).join('');
    };
    // duplicated for a seamless infinite loop
    marqueeEl.innerHTML = buildSet() + buildSet();
  }

  /* ── Hero canvas — soft floating particles ───────────────── */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var hero = document.getElementById('hero');
    var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticles() {
      var count = w < 700 ? 26 : 50;
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102,204,102,' + p.a + ')';
        ctx.fill();
      }
      // faint connective lines between close particles
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(102,204,102,' + (0.12 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }

    resize();
    makeParticles();
    requestAnimationFrame(tick);
    window.addEventListener('resize', function () {
      resize();
      makeParticles();
    });
  }

  /* ── Footer year ──────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Contact form → WhatsApp ──────────────────────────────── */
  var form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name').value.trim();
      var interest = document.getElementById('f-interest').value;
      var msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) {
        form.reportValidity();
        return;
      }

      var text = 'Hola, soy ' + name + '. Me interesa cotizar: ' + interest + '.\n\n' + msg;
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
