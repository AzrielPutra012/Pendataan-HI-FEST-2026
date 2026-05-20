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
/* ═══════════════════════════════════════════════════
   about-script.js — HI-FEST 2026 | Section About Us
   Letakkan setelah script.js, sebelum </body>
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────
  // 1. SIMPLE AOS (Animate On Scroll) — Lightweight
  //    Triggers .aos-visible class via IntersectionObserver
  // ────────────────────────────────────────────────
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        aosObserver.unobserve(entry.target); // once only
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  aosElements.forEach(el => aosObserver.observe(el));


  // ────────────────────────────────────────────────
  // 2. TIMELINE — Scroll Progress Bar
  // ────────────────────────────────────────────────
  const track    = document.getElementById('timeline-track');
  const progress = document.getElementById('tl-progress');

  if (track && progress) {
    const updateProgress = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const maxScroll = scrollWidth - clientWidth;
      const pct       = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      progress.style.width = `${pct}%`;
    };

    track.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Init
  }


  // ────────────────────────────────────────────────
  // 3. TIMELINE — Click & Drag to Scroll (desktop)
  // ────────────────────────────────────────────────
  if (track) {
    let isDragging  = false;
    let startX      = 0;
    let scrollStart = 0;
    let moved       = false;

    track.addEventListener('mousedown', (e) => {
      isDragging  = true;
      moved       = false;
      startX      = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = (e.pageX - track.offsetLeft) - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = scrollStart - dx;
    });

    const stopDrag = () => {
      isDragging = false;
      track.style.cursor = 'grab';
    };

    track.addEventListener('mouseup',    stopDrag);
    track.addEventListener('mouseleave', stopDrag);

    // Prevent card clicks from firing when dragging
    track.addEventListener('click', (e) => {
      if (moved) e.stopPropagation();
    }, true);
  }


  // ────────────────────────────────────────────────
  // 4. TIMELINE — Keyboard Arrow Navigation
  // ────────────────────────────────────────────────
  if (track) {
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
      const step = 204; // card width + gap
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });
  }


  // ────────────────────────────────────────────────
  // 5. ACCORDION — Toggle with smooth grid-row animation
  // ────────────────────────────────────────────────
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header  = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (single open at a time)
      accordionItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          other.querySelector('.accordion-header')
               ?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked
      item.classList.toggle('open', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  });


  // ────────────────────────────────────────────────
  // 6. PROFILE CARDS — Subtle tilt on hover (desktop)
  // ────────────────────────────────────────────────
  const profileCards = document.querySelectorAll('.profile-card');
  const isDesktop    = window.matchMedia('(min-width: 1024px)').matches;

  if (isDesktop) {
    profileCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect    = card.getBoundingClientRect();
        const cx      = rect.left + rect.width  / 2;
        const cy      = rect.top  + rect.height / 2;
        const rotateX = ((e.clientY - cy) / (rect.height / 2)) * -3;
        const rotateY = ((e.clientX - cx) / (rect.width  / 2)) *  3;

        card.style.transform  = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
        card.style.transition = 'transform 0.05s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease, border-color 0.3s ease';
      });
    });
  }


  // ────────────────────────────────────────────────
  // 7. TIMELINE — Auto-scroll to active card on load
  // ────────────────────────────────────────────────
  if (track) {
    const activeCard = track.querySelector('.active-card');
    if (activeCard) {
      // Slight delay to let layout settle
      setTimeout(() => {
        const cardOffset = activeCard.offsetLeft;
        const padding    = 24;
        track.scrollTo({ left: cardOffset - padding, behavior: 'smooth' });
      }, 600);
    }
  }


  // ────────────────────────────────────────────────
  // 8. DEV LOG
  // ────────────────────────────────────────────────
  console.log('%c[HI-FEST 2026] About Us Section Loaded · Fase 2 ✓', 'color:#54ACBF; font-weight:bold;');

});

/* ═══════════════════════════════════════════════════
   data-script.js — HI-FEST 2026 | All Data Update
   Letakkan setelah about-script.js, sebelum </body>
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────
  // INTERNAL STATE
  // ────────────────────────────────────────────────
  let tableData  = [];   // raw kekeluargaan rows
  let sortMode   = 'az'; // 'az' | 'za' | 'asc' | 'desc'
  let searchTerm = '';
  let chartsAnimated = false;

  // ────────────────────────────────────────────────
  // 1. INTERSECTION OBSERVER — Animate charts when visible
  // ────────────────────────────────────────────────
  const dataSection = document.getElementById('alldata');
  if (dataSection) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !chartsAnimated) {
          chartsAnimated = true;
          animateAllCharts();
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sectionObserver.observe(dataSection);
  }


  // ────────────────────────────────────────────────
  // 2. CHART ANIMATIONS — Trigger all on scroll-into-view
  // ────────────────────────────────────────────────
  function animateAllCharts() {
    // Horizontal bars (jenis lomba)
    document.querySelectorAll('.hchart-bar').forEach((bar, i) => {
      setTimeout(() => {
        const targetW = bar.getAttribute('data-target-w') || '0%';
        bar.style.width = targetW;
      }, i * 100);
    });

    // Vertical bars (jenjang)
    document.querySelectorAll('.vcol-bar').forEach((bar, i) => {
      setTimeout(() => {
        const targetH = bar.getAttribute('data-target-h') || '0%';
        bar.style.height = targetH;
      }, i * 120);
    });

    // Horizontal bars (peserta)
    ['bar-indep', 'bar-deleg'].forEach((id, i) => {
      const bar = document.getElementById(id);
      if (bar) {
        setTimeout(() => {
          const tw = bar.getAttribute('data-target-w') || '0%';
          bar.style.width = tw;
        }, i * 150 + 200);
      }
    });

    // Ring charts
    animateRings();

    // Mini-bar fills in table
    animateTableBars();
  }


  // ────────────────────────────────────────────────
  // 3. RING CHART ANIMATION
  // ────────────────────────────────────────────────
  function animateRings() {
    const ringSport = document.getElementById('ring-sport');
    const ringEdu   = document.getElementById('ring-edu');
    if (!ringSport || !ringEdu) return;

    const targetSport = parseFloat(ringSport.getAttribute('data-pct') || 0);
    const targetEdu   = parseFloat(ringEdu.getAttribute('data-pct')   || 0);

    const circumSport = 188.5;
    const circumEdu   = 138.2;

    ringSport.style.strokeDashoffset = circumSport - (circumSport * targetSport / 100);
    ringEdu.style.strokeDashoffset   = circumEdu   - (circumEdu   * targetEdu   / 100);
  }


  // ────────────────────────────────────────────────
  // 4. TABLE MINI-BAR ANIMATION
  // ────────────────────────────────────────────────
  function animateTableBars() {
    document.querySelectorAll('.td-mini-fill').forEach((fill, i) => {
      const targetW = fill.getAttribute('data-target-w') || '0%';
      setTimeout(() => { fill.style.width = targetW; }, i * 40 + 300);
    });
  }


  // ────────────────────────────────────────────────
  // 5. TABLE — Search
  // ────────────────────────────────────────────────
  const searchInput = document.getElementById('search-kekel');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      renderTable();
    });
  }


  // ────────────────────────────────────────────────
  // 6. TABLE — Sort
  // ────────────────────────────────────────────────
  const sortBtn   = document.getElementById('sort-btn');
  const sortLabel = document.getElementById('sort-label');
  const sortIcon  = document.getElementById('sort-icon');

  const sortCycles = ['az', 'za', 'desc', 'asc'];
  const sortLabels = { az: 'A–Z', za: 'Z–A', desc: '↓ Max', asc: '↑ Min' };

  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      const idx = sortCycles.indexOf(sortMode);
      sortMode = sortCycles[(idx + 1) % sortCycles.length];
      if (sortLabel) sortLabel.textContent = sortLabels[sortMode];
      renderTable();
    });
  }


  // ────────────────────────────────────────────────
  // 7. TABLE RENDER — Filter + Sort + Zebra + Highlight top
  // ────────────────────────────────────────────────
  function renderTable() {
    const bodyEl  = document.getElementById('table-kekel-body');
    const emptyEl = document.getElementById('table-empty');
    if (!bodyEl) return;

    const rows = Array.from(bodyEl.querySelectorAll('.tr-row'));

    // Filter
    const filtered = rows.filter(row => {
      const name = (row.getAttribute('data-name') || '').toLowerCase();
      return name.includes(searchTerm);
    });

    // Sort
    filtered.sort((a, b) => {
      const nameA = a.getAttribute('data-name') || '';
      const nameB = b.getAttribute('data-name') || '';
      const valA  = parseInt(a.getAttribute('data-val')) || 0;
      const valB  = parseInt(b.getAttribute('data-val')) || 0;

      if (sortMode === 'az')   return nameA.localeCompare(nameB);
      if (sortMode === 'za')   return nameB.localeCompare(nameA);
      if (sortMode === 'desc') return valB - valA;
      if (sortMode === 'asc')  return valA - valB;
      return 0;
    });

    // Find max val
    const maxVal = Math.max(...filtered.map(r => parseInt(r.getAttribute('data-val')) || 0));

    // Hide all rows first
    rows.forEach(r => { r.style.display = 'none'; r.classList.remove('is-top'); });

    // Show & reorder filtered
    filtered.forEach((row, idx) => {
      row.style.display  = '';
      row.style.order    = idx;

      // Renumber
      const tdNo = row.querySelector('.td-no');
      if (tdNo) tdNo.textContent = idx + 1;

      // Highlight top
      const val = parseInt(row.getAttribute('data-val')) || 0;
      if (val > 0 && val === maxVal) row.classList.add('is-top');

      // Reapply zebra (nth-child doesn't work with display toggling, so manual)
      row.style.background = '';
      if (idx % 2 === 0) {
        row.style.background = 'rgba(167, 235, 242, 0.025)';
      }
    });

    // Reorder DOM
    filtered.forEach(row => bodyEl.appendChild(row));

    // Empty state
    if (emptyEl) {
      emptyEl.classList.toggle('hidden', filtered.length > 0);
    }
  }


  // ────────────────────────────────────────────────
  // 8. LAST UPDATED TIMESTAMP
  // ────────────────────────────────────────────────
  function setLastUpdated() {
    const el = document.getElementById('last-updated-time');
    if (!el) return;
    const now = new Date();
    const formatted = now.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) + ' · ' + now.toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit',
    });
    el.textContent = formatted;
  }


  // ────────────────────────────────────────────────
  // 9. PUBLIC API — window.updateAllData(data)
  //
  //  Call this to inject real data into the dashboard.
  //
  //  @param {Object} data — full data shape:
  //  {
  //    // Kategori Lomba (Ring)
  //    sport: 320, edu: 180,
  //
  //    // Kategori Peserta (Hbar)
  //    indep: 280, deleg: 220,
  //
  //    // Jenis Perlombaan (Hchart) — values
  //    futsal: 95, badminton: 80, tenis: 60,
  //    lcc: 70, pidato: 55, story: 40,
  //
  //    // Jenjang Pendidikan (Vchart)
  //    dk: 30, mahad: 55, idady: 70, tsanawy: 90,
  //    kuliah: 110, aldk: 40, almahad: 50,
  //
  //    // Kekeluargaan (Table) — array
  //    kekeluargaan: [
  //      { name: 'FOSGAMA', total: 45 },
  //      ...
  //    ]
  //  }
  // ────────────────────────────────────────────────
  window.updateAllData = function(data = {}) {

    setLastUpdated();

    // ── Ring Chart ──
    const sportVal = data.sport || 0;
    const eduVal   = data.edu   || 0;
    const totalLomba = sportVal + eduVal;

    const ringSport = document.getElementById('ring-sport');
    const ringEdu   = document.getElementById('ring-edu');
    const elRingTotal = document.getElementById('ring-total-lomba');
    const elValSport  = document.getElementById('val-sport');
    const elValEdu    = document.getElementById('val-edu');

    if (ringSport) ringSport.setAttribute('data-pct', totalLomba ? (sportVal / totalLomba * 100).toFixed(1) : 0);
    if (ringEdu)   ringEdu.setAttribute('data-pct',   totalLomba ? (eduVal   / totalLomba * 100).toFixed(1) : 0);
    if (elRingTotal) elRingTotal.textContent = totalLomba.toLocaleString('id-ID');
    if (elValSport)  elValSport.textContent  = sportVal.toLocaleString('id-ID');
    if (elValEdu)    elValEdu.textContent    = eduVal.toLocaleString('id-ID');

    // ── Kategori Peserta Bars ──
    const indepVal = data.indep || 0;
    const delegVal = data.deleg || 0;
    const totalPeserta = indepVal + delegVal;

    const setHbar = (id, pctId, valId, val, total, fillId) => {
      const pct = total ? Math.round(val / total * 100) : 0;
      const bar = document.getElementById(fillId);
      if (bar) {
        bar.setAttribute('data-target-w', `${pct}%`);
        if (chartsAnimated) bar.style.width = `${pct}%`;
      }
      const elVal = document.getElementById(valId);
      const elPct = document.getElementById(pctId);
      if (elVal) elVal.textContent = val.toLocaleString('id-ID');
      if (elPct) elPct.textContent = `${pct}%`;
    };

    setHbar(null, 'pct-indep', 'val-indep', indepVal, totalPeserta, 'bar-indep');
    setHbar(null, 'pct-deleg', 'val-deleg', delegVal, totalPeserta, 'bar-deleg');

    const elTotalPeserta = document.getElementById('total-peserta');
    if (elTotalPeserta) elTotalPeserta.textContent = totalPeserta.toLocaleString('id-ID');

    // ── Horizontal Bar Chart (Jenis Lomba) ──
    const jenisData = {
      'hbar-futsal':   data.futsal   || 60,
      'hbar-badminton':data.badminton || 0,
      'hbar-tenis':    data.tenis    || 0,
      'hbar-lcc':      data.lcc      || 0,
      'hbar-pidato':   data.pidato   || 0,
      'hbar-story':    data.story    || 0,
    };

    const maxJenis = Math.max(...Object.values(jenisData));
    Object.entries(jenisData).forEach(([id, val]) => {
      const bar = document.getElementById(id);
      if (!bar) return;
      const pct = maxJenis ? Math.round(val / maxJenis * 88) : 0;
      bar.setAttribute('data-target-w', `${pct}%`);
      bar.setAttribute('data-val', val);
      const valEl = bar.querySelector('.hchart-val');
      if (valEl) valEl.textContent = val > 0 ? val.toLocaleString('id-ID') : '—';
      if (chartsAnimated) bar.style.width = `${pct}%`;
    });

    // Re-sort hchart rows by value
    const hchartWrap = document.getElementById('hchart-jenis');
    if (hchartWrap) {
      const hrows = Array.from(hchartWrap.querySelectorAll('.hchart-row'));
      hrows.sort((a, b) => {
        const barA = a.querySelector('.hchart-bar');
        const barB = b.querySelector('.hchart-bar');
        return (parseInt(barB?.getAttribute('data-val')) || 0) -
               (parseInt(barA?.getAttribute('data-val')) || 0);
      });
      hrows.forEach(r => hchartWrap.appendChild(r));
    }

    // ── Vertical Chart (Jenjang) ──
    const jenjangData = {
      dk:      data.dk      || 0,
      mahad:   data.mahad   || 0,
      idady:   data.idady   || 0,
      tsanawy: data.tsanawy || 0,
      kuliah:  data.kuliah  || 0,
      aldk:    data.aldk    || 0,
      almahad: data.almahad || 0,
    };

    const maxJenjang = Math.max(...Object.values(jenjangData));
    Object.entries(jenjangData).forEach(([key, val]) => {
      const bar  = document.getElementById(`vbar-${key}`);
      const valEl = document.getElementById(`vval-${key}`);
      if (!bar) return;
      const pct = maxJenjang ? Math.round(val / maxJenjang * 90) : 0;
      bar.setAttribute('data-target-h', `${pct}%`);
      if (valEl) valEl.textContent = val > 0 ? val : '—';
      if (chartsAnimated) bar.style.height = `${pct}%`;
    });

    // ── Kekeluargaan Table ──
    if (Array.isArray(data.kekeluargaan) && data.kekeluargaan.length > 0) {
      tableData = data.kekeluargaan;
      const maxKekel = Math.max(...data.kekeluargaan.map(k => k.total || 0));
      const bodyEl   = document.getElementById('table-kekel-body');

      if (bodyEl) {
        const rows = bodyEl.querySelectorAll('.tr-row');
        rows.forEach(row => {
          const name  = row.getAttribute('data-name');
          const match = data.kekeluargaan.find(k =>
            k.name.toUpperCase() === name.toUpperCase()
          );
          if (!match) return;

          const val  = match.total || 0;
          const pct  = maxKekel ? Math.round(val / maxKekel * 100) : 0;

          row.setAttribute('data-val', val);

          const tdTotal  = row.querySelector('.td-total');
          const miniFill = row.querySelector('.td-mini-fill');

          if (tdTotal)  tdTotal.textContent = val > 0 ? val.toLocaleString('id-ID') : '—';
          if (miniFill) {
            miniFill.setAttribute('data-target-w', `${pct}%`);
            if (chartsAnimated) miniFill.style.width = `${pct}%`;
          }
        });
      }

      renderTable();
    }

    // If section already visible, re-trigger animations
    if (chartsAnimated) {
      setTimeout(animateAllCharts, 50);
    }

    console.log('%c[HI-FEST 2026] All Data updated ✓', 'color:#54ACBF;');
  };


  // ────────────────────────────────────────────────
  // 10. DEV LOG
  // ────────────────────────────────────────────────
  console.log('%c[HI-FEST 2026] All Data Section Loaded · Fase 3 ✓', 'color:#54ACBF; font-weight:bold;');
  console.log('%cHook ready: window.updateAllData({ sport, edu, indep, deleg, futsal, badminton, tenis, lcc, pidato, story, dk, mahad, idady, tsanawy, kuliah, aldk, almahad, kekeluargaan:[{name,total}] })', 'color:#A7EBF2; font-size:10px;');

});