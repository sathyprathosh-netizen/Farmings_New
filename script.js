/* ══════════════════
   VETRIVELFARAMS — MAIN JS
   ══════════════════ */

(function () {
  'use strict';

  /* ─── NAVBAR scroll effect ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ─── HAMBURGER menu ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ─── PARALLAX layers (mouse + scroll) ─── */
  const parallaxLayers = document.querySelectorAll('.parallax-layer[data-depth]');

  // Mouse parallax (hero only)
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth);
      const tx = dx * depth * 18;
      const ty = dy * depth * 12;
      layer.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });

  // Scroll parallax — depth-based translateY
  function updateScrollParallax() {
    const scrollY = window.scrollY;
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth);
      const ty = scrollY * depth * 0.35;
      layer.style.transform = `translateY(${ty}px)`;
    });

    // Plantation bg slow zoom-parallax
    const plantBg = document.querySelector('.plantation-bg');
    if (plantBg) {
      const section = plantBg.closest('.plantation-section');
      const rect = section.getBoundingClientRect();
      const offset = -rect.top * 0.12;
      plantBg.style.transform = `translateY(${offset}px) scale(1.05)`;
    }
  }

  window.addEventListener('scroll', updateScrollParallax, { passive: true });

  /* ─── POLLEN particles ─── */
  const pollenContainer = document.getElementById('pollenContainer');
  if (pollenContainer) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'pollen';
      const size = 2 + Math.random() * 4;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${-10 + Math.random() * 20}%;
        width: ${size}px;
        height: ${size}px;
        opacity: ${0.3 + Math.random() * 0.5};
        animation-duration: ${8 + Math.random() * 14}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      pollenContainer.appendChild(p);
    }
  }

  /* ─── FALLING COCONUT (removed) ─── */

  /* ─── ACTIVE NAV link on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(lnk => {
      lnk.classList.remove('active');
      if (lnk.getAttribute('href') === `#${current}`) lnk.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ─── INTERSECTION OBSERVER: reveal animations ─── */
  const ioOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  // Origin icon cards
  const io1 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, ioOptions);
  document.querySelectorAll('.origin-card').forEach(el => io1.observe(el));

  // Process text blocks
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, ioOptions);
  document.querySelectorAll('.process-text').forEach(el => io2.observe(el));

  // Alevior cards — staggered
  const ioAlevior = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 120);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.alevior-card').forEach(el => ioAlevior.observe(el));

  // Sustainability pillars
  const io3 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, ioOptions);
  document.querySelectorAll('.sustain-card').forEach(el => io3.observe(el));

  // Human quote
  const io4 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, ioOptions);
  document.querySelectorAll('.human-quote').forEach(el => io4.observe(el));

  /* ─── COUNTER ANIMATION (stats) ─── */
  function animateCount(el, target, duration) {
    const numEl = el.querySelector('.stat-num');
    if (!numEl) return;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      numEl.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const ioStats = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        animateCount(e.target, target, 2000);
        ioStats.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat[data-count]').forEach(el => ioStats.observe(el));

  /* ─── 3D CARD TILT (Alevior) ─── */
  document.querySelectorAll('.alevior-card[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-12px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── COCONUT INTERACTIONS (removed) ─── */
  /* ─── NAV link active style injection ─── */
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--gold) !important; }
  .nav-link.active::after { width: 100% !important; }`;
  document.head.appendChild(style);

  /* ─── LEAF SCATTER on CTA button ─── */
  window.scatterLeaves = function () {
    const container = document.getElementById('ctaLeaves');
    if (!container) return;
    // Clear old leaves
    container.innerHTML = '';
    const icons = ['eco', 'spa', 'psychiatry', 'forest', 'energy_savings_leaf'];
    const cx = window.innerWidth / 2;
    const cy = container.getBoundingClientRect().height / 2;

    for (let i = 0; i < 18; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'cta-leaf';
      leaf.innerHTML = `<span class="material-symbols-outlined" style="display:inline-block">${icons[Math.floor(Math.random() * icons.length)]}</span>`;
      const angle = (i / 18) * 360;
      const dist = 100 + Math.random() * 180;
      const dx = Math.cos((angle * Math.PI) / 180) * dist;
      const dy = Math.sin((angle * Math.PI) / 180) * dist - 80;
      const dr = (Math.random() - 0.5) * 540 + 'deg';
      leaf.style.cssText = `
        left: ${cx}px; top: ${cy}px;
        font-size: ${0.8 + Math.random() * 1.2}rem;
        --dx: ${dx}px; --dy: ${dy}px; --dr: ${dr};
        animation-delay: ${Math.random() * 0.2}s;
      `;
      container.appendChild(leaf);
    }
    // Remove after animation
    setTimeout(() => { container.innerHTML = ''; }, 2000);
  };

  /* ─── SMOOTH ANCHOR SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── INITIAL CALL ─── */
  updateScrollParallax();
  updateActiveNav();

})();
