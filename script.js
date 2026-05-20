/* ═══════════════════════════════════════════════════
   script.js — HI-FEST 2026 | Divisi Pendataan
   Author  : Azriel (Prompt Engineer & Koordinator Data)
   Version : 1.0.0 · Fase 1 — Home Page
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────
  // 1. NAVBAR — Scroll Effect (add .scrolled class)
  // ────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load


  // ────────────────────────────────────────────────
  // 2. NAVBAR — Active Link on Scroll (Intersection Observer)
  // ────────────────────────────────────────────────
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('main[id], section[id]');

  const observerOptions = {
    root:       null,
    rootMargin: '-30% 0px -60% 0px',
    threshold:  0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  // ────────────────────────────────────────────────
  // 3. MOBILE HAMBURGER MENU — Toggle
  // ────────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamBars    = document.querySelectorAll('.ham-bar');
  let isMenuOpen   = false;

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    isMenuOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');

    // Animate bars → X
    hamBars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    hamBars[1].style.opacity   = '0';
    hamBars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    isMenuOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');

    // Restore bars
    hamBars[0].style.transform = '';
    hamBars[1].style.opacity   = '';
    hamBars[2].style.transform = '';
  };

  hamburger.addEventListener('click', () => {
    isMenuOpen ? closeMenu() : openMenu();
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isMenuOpen) closeMenu();
  });


  // ────────────────────────────────────────────────
  // 4. SMOOTH SCROLL — Internal anchor links
  // ────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;

      window.scrollTo({
        top:      target.offsetTop - navHeight,
        behavior: 'smooth',
      });
    });
  });


  // ────────────────────────────────────────────────
  // 5. BENTO CARD — Subtle Tilt on Mouse Move (desktop)
  // ────────────────────────────────────────────────
  const bentoCard = document.querySelector('.bento-card');
  if (bentoCard && window.matchMedia('(min-width: 1024px)').matches) {

    const MAX_TILT = 5; // degrees

    bentoCard.addEventListener('mousemove', (e) => {
      const rect   = bentoCard.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;

      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -MAX_TILT;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  MAX_TILT;

      bentoCard.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(6px)
      `;
      bentoCard.style.transition = 'transform 0.08s ease-out';
    });

    bentoCard.addEventListener('mouseleave', () => {
      bentoCard.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      bentoCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  }


  // ────────────────────────────────────────────────
  // 6. HERO LEFT — Staggered entrance observer
  //    (Re-triggers animation when element enters view)
  // ────────────────────────────────────────────────
  const heroLeft = document.querySelector('.hero-left');
  if (heroLeft) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.visibility = 'visible';
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroLeft);
  }


  // ────────────────────────────────────────────────
  // 7. PLACEHOLDER — Future: Chart Integration Hook
  //    (Expose a global function for easy data injection)
  // ────────────────────────────────────────────────

  /**
   * updateStats(data)
   * Call this function when your data source is ready.
   *
   * @param {Object} data
   * @param {number|string} data.total    - Total pendaftar
   * @param {number|string} data.verified - Verified count
   * @param {number|string} data.pending  - Pending count
   * @param {number|string} data.divisi   - Jumlah divisi
   *
   * Example:
   *   window.updateStats({ total: 1248, verified: 984, pending: 264, divisi: 12 });
   */
  window.updateStats = function(data = {}) {
    const formatNum = n => (typeof n === 'number')
      ? n.toLocaleString('id-ID')
      : (n ?? '—');

    const el = {
      counter:  document.querySelector('.counter'),
      verified: document.querySelectorAll('.mini-stat-val')[0],
      pending:  document.querySelectorAll('.mini-stat-val')[1],
      divisi:   document.querySelectorAll('.mini-stat-val')[2],
    };

    if (el.counter && data.total !== undefined) {
      animateCounter(el.counter, 0, data.total, 1500);
    }
    if (el.verified && data.verified !== undefined) el.verified.textContent = formatNum(data.verified);
    if (el.pending  && data.pending  !== undefined) el.pending.textContent  = formatNum(data.pending);
    if (el.divisi   && data.divisi   !== undefined) el.divisi.textContent   = formatNum(data.divisi);
  };

  /**
   * animateCounter — Number roll animation
   */
  function animateCounter(el, from, to, duration) {
    const start    = performance.now();
    const isNumber = typeof to === 'number';
    if (!isNumber) { el.textContent = to; return; }

    const step = (timestamp) => {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(from + (to - from) * ease);

      el.textContent = current.toLocaleString('id-ID');
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }


  // ────────────────────────────────────────────────
  // 8. DEV LOG
  // ────────────────────────────────────────────────
  console.log('%c[HI-FEST 2026] Dashboard Loaded · Fase 1 ✓', 'color:#54ACBF; font-weight:bold;');
  console.log('%cHook ready: window.updateStats({ total, verified, pending, divisi })', 'color:#A7EBF2; font-size:11px;');

});