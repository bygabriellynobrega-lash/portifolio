/* ============================================================
   STÚDIO GABRIELLY NÓBREGA — SCRIPT.JS
   Pure JavaScript — sem dependências externas
   GitHub Pages ready
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     ELEMENTOS DOM
  ---------------------------------------------------------- */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const backToTop  = document.getElementById('backToTop');
  const navLinks   = document.querySelectorAll('.nav-links a');

  /* ----------------------------------------------------------
     NAVBAR — scroll + hamburger
  ---------------------------------------------------------- */
  function onScroll() {
    const y = window.scrollY;

    // Scrolled class
    navbar.classList.toggle('scrolled', y > 20);

    // Back-to-top
    if (backToTop) backToTop.classList.toggle('visible', y > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init

  /* Hamburger toggle */
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Fechar ao clicar num link
    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     SMOOTH SCROLL para âncoras
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     VOLTAR AO TOPO
  ---------------------------------------------------------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     REVEAL ON SCROLL — IntersectionObserver
  ---------------------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => obs.observe(el));
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK no scroll
  ---------------------------------------------------------- */
  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || !navLinks.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + entry.target.id
              );
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(s => obs.observe(s));
  }

  /* ----------------------------------------------------------
     GALLERY — hover overlay com label
  ---------------------------------------------------------- */
  function initGallery() {
    document.querySelectorAll('.gphoto').forEach(photo => {
      photo.addEventListener('mouseenter', () => {
        photo.style.opacity = '0.92';
      });
      photo.addEventListener('mouseleave', () => {
        photo.style.opacity = '1';
      });
    });
  }

  /* ----------------------------------------------------------
     SERVICE CARD — micro tilt (desktop)
  ---------------------------------------------------------- */
  function initCardTilt() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.svc-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r   = card.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const dx  = (e.clientX - cx) / (r.width  / 2);
        const dy  = (e.clientY - cy) / (r.height / 2);
        card.style.transform = `translateY(-4px) rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     MARQUEE — pausa ao hover (acessibilidade)
  ---------------------------------------------------------- */
  function initMarquee() {
    const strip = document.querySelector('.values-strip');
    const track = document.querySelector('.values-track');
    if (!strip || !track) return;

    strip.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    strip.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  /* ----------------------------------------------------------
     HERO PORTRAIT — parallax suave
  ---------------------------------------------------------- */
  function initParallax() {
    const wrap = document.querySelector('.hero-portrait-wrap');
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        wrap.style.transform = `translateY(${y * 0.06}px)`;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     NÚMEROS HERO — counter animation
  ---------------------------------------------------------- */
  function initCounters() {
    const items = document.querySelectorAll('.hero-meta-item .num');
    if (!items.length) return;

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el  = entry.target;
          const raw = el.textContent.trim();
          const num = parseFloat(raw);
          const suf = raw.replace(/[\d.]/g, '');
          if (isNaN(num)) return;

          let start = 0;
          const duration = 1400;
          const startTime = performance.now();

          function step(now) {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);
            const current  = Math.round(ease * num * 10) / 10;
            el.textContent = (Number.isInteger(num) ? Math.round(current) : current) + suf;
            if (progress < 1) requestAnimationFrame(step);
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.7 }
    );

    items.forEach(el => obs.observe(el));
  }

  /* ----------------------------------------------------------
     TESTIMONIALS — slider simples para mobile
  ---------------------------------------------------------- */
  function initTestimonialSwipe() {
    const grid = document.querySelector('.test-grid');
    if (!grid) return;

    let touchStartX = 0;
    let currentCard = 0;
    const cards = grid.querySelectorAll('.test-card');

    grid.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    grid.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      // No mobile, o grid é coluna única; só rola naturalmente
      // Reservado para futuras expansões
    });
  }

  /* ----------------------------------------------------------
     IMAGENS — fallback elegante se não carregar
  ---------------------------------------------------------- */
  function initImageFallbacks() {
    // onerror inline já cuida disso no HTML,
    // mas garantimos via JS também
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('onerror')) {
        img.addEventListener('error', function () {
          const ph = this.nextElementSibling;
          if (ph) {
            this.style.display = 'none';
            ph.style.display = 'flex';
          }
        });
      }
    });
  }

  /* ----------------------------------------------------------
     ESTILO ATIVO NAV LINKS (injetar CSS)
  ---------------------------------------------------------- */
  function injectActiveStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-links a.active { color: var(--gold-deep) !important; }
    `;
    document.head.appendChild(style);
  }

  /* ----------------------------------------------------------
     PROCEDURE LIST — animação de entrada sequencial
  ---------------------------------------------------------- */
  function initProcedureList() {
    const list = document.querySelector('.procedure-list');
    if (!list) return;

    const items = list.querySelectorAll('li');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    obs.observe(list);
  }

  /* ----------------------------------------------------------
     GALLERY — stagger reveal
  ---------------------------------------------------------- */
  function initGalleryReveal() {
    const photos = document.querySelectorAll('.gphoto');
    photos.forEach((p, i) => {
      p.style.opacity = '0';
      p.style.transform = 'scale(0.96)';
      p.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          photos.forEach(p => {
            p.style.opacity = '1';
            p.style.transform = 'scale(1)';
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) obs.observe(galleryGrid);
  }

  /* ----------------------------------------------------------
     INIT ALL
  ---------------------------------------------------------- */
  function init() {
    initReveal();
    initActiveLinks();
    initGallery();
    initCardTilt();
    initMarquee();
    initParallax();
    initCounters();
    initTestimonialSwipe();
    initImageFallbacks();
    injectActiveStyle();
    initProcedureList();
    initGalleryReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
