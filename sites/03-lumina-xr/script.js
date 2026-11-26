/* ==========================================================================
   Lumina XR — Interactive Behaviors
   - Liquid-glass visor tilt, specular glare & spec mode toggle
   - Engineering FAQ accordion
   - Case Study frosted modal
   - Interactive Calendar Date & Time Picker + Demo Confirmation
   - Mobile Drawer
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileDrawer.hidden = isOpen;
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.hidden = true;
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Interactive Liquid-Glass Visor Card (Tilt + Specular + Spec Toggle)
     ------------------------------------------------------------------------ */
  const visorCard = document.getElementById('visorCard');
  const visorGlare = document.getElementById('visorGlare');
  const visorSpecsGrid = document.getElementById('visorSpecsGrid');
  const visorTagLeft = document.getElementById('visorTagLeft');
  const visorTagRight = document.getElementById('visorTagRight');
  const specTabs = document.querySelectorAll('.spec-tab');

  const SPEC_DATA = {
    optics: {
      left: '46.5',
      right: '185g',
      cells: [
        { k: 'Resolution', v: '3840 × 3552 / eye' },
        { k: 'Color Gamut', v: '99% DCI-P3 · 10-bit' },
        { k: 'Optical Stack', v: '4-Element Pancake' },
        { k: 'Passthrough', v: 'Dual 32MP · 90Hz' },
      ],
    },
    ergo: {
      left: '58–74mm',
      right: '185g',
      cells: [
        { k: 'Chassis Mass', v: '185g Magnesium Alloy' },
        { k: 'Thermal Load', v: 'Silent Rear Puck' },
        { k: 'IPD Range', v: 'Auto-Motorized' },
        { k: 'Battery Swap', v: '3.5 hr Hot-Swap' },
      ],
    },
    stream: {
      left: '10.4ms',
      right: 'Wi-Fi 7',
      cells: [
        { k: 'Wireless Link', v: '6 GHz Wi-Fi 7 · 4.2 Gbps' },
        { k: 'CAD Plugins', v: 'Rhino · Revit · Alias' },
        { k: 'Foveation', v: '240Hz Eye-Tracked' },
        { k: 'Security', v: 'Zero-Copy AES-256' },
      ],
    },
  };

  specTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-spec');
      const data = SPEC_DATA[key];
      if (!data) return;

      specTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });

      if (visorTagLeft) visorTagLeft.textContent = data.left;
      if (visorTagRight) visorTagRight.textContent = data.right;

      if (visorSpecsGrid) {
        visorSpecsGrid.innerHTML = data.cells
          .map(
            (c, i) => `
              <div class="spec-cell focus-in" style="animation-delay:${i * 45}ms">
                <span class="spec-k">${c.k}</span>
                <span class="spec-v">${c.v}</span>
              </div>
            `
          )
          .join('');
      }
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (visorCard && visorGlare && !prefersReducedMotion) {
    visorCard.addEventListener('mousemove', (e) => {
      const rect = visorCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 9;

      visorCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      visorGlare.style.background = `radial-gradient(circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(255,255,255,0.24), transparent 46%)`;
    });

    visorCard.addEventListener('mouseleave', () => {
      visorCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ------------------------------------------------------------------------
     2b. Pointer-Tracking Specular Sheen Across Frosted Glass Cards
     ------------------------------------------------------------------------ */
  const specularPanels = document.querySelectorAll(
    '.proof-bar, .tour-card, .step-card, .case-card, .price-card, .demo-shell, .faq-item'
  );

  if (!prefersReducedMotion) {
    specularPanels.forEach((panel) => {
      const sheen = document.createElement('div');
      sheen.className = 'glass-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      panel.prepend(sheen);

      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        sheen.style.setProperty('--mx', `${x.toFixed(1)}px`);
        sheen.style.setProperty('--my', `${y.toFixed(1)}px`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     2c. Smooth Blur-to-Sharp Glassmorphism 2.0 Scroll Reveals
     ------------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.proof-bar, .section-header, .tour-card, .step-card, .case-card, .faq-item, .price-card, .demo-shell'
  );

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((el) => {
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((child) =>
            child.matches('.tour-card, .step-card, .case-card, .faq-item, .price-card')
          )
        : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) {
        el.style.setProperty('--reveal-delay', `${idx * 75}ms`);
      }
      el.classList.add('reveal-glass');
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     3. Case Study Frosted Modal
     ------------------------------------------------------------------------ */
  const CASE_STORIES = {
    polestar: {
      tag: 'Automotive Industrial Design',
      title: 'Polestar Interior Lab',
      metric: '-62% physical clay & CNC cockpit bucks',
      body: 'By streaming live Autodesk Alias surfaces into 6 Lumina XR visors simultaneously, interior designers in Gothenburg and ergonomics engineers in Coventry validated console reach, HMI glare, and A-pillar sightlines at 1:1 scale before milling a single foam buck.',
      quote: '“We cut three full weeks out of every cockpit freeze cycle—and caught a 6mm steering-column occlusion that flat screens completely hid.” — Head of Interior Spatial Review',
    },
    nordic: {
      tag: 'Civic & Commercial Architecture',
      title: 'Nordic Architects Group',
      metric: '4.1x faster client & municipal sign-off',
      body: 'Across 14 Scandinavian studios, project leads replaced static perspective boards with 1:1 Revit walkthroughs in Lumina Sync Rooms. Municipal committees walked full-height timber atriums in passthrough and signed off on facade daylighting in a single afternoon.',
      quote: '“Clients stop asking for three more render rounds the moment they step inside the 1:1 atrium at 46.5 PPD.” — Managing Partner, Nordic Architects Group',
    },
  };

  const caseModal = document.getElementById('caseModal');
  const modalClose = document.getElementById('modalClose');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalMetric = document.getElementById('modalMetric');
  const modalBody = document.getElementById('modalBody');
  const modalQuote = document.getElementById('modalQuote');
  const modalDemoBtn = document.getElementById('modalDemoBtn');

  function closeModal() {
    if (caseModal) caseModal.hidden = true;
  }

  document.querySelectorAll('.case-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const story = CASE_STORIES[btn.getAttribute('data-case')];
      if (!story || !caseModal) return;
      modalTag.textContent = story.tag;
      modalTitle.textContent = story.title;
      modalMetric.textContent = story.metric;
      modalBody.textContent = story.body;
      modalQuote.textContent = story.quote;
      caseModal.hidden = false;
      modalClose.focus();
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalDemoBtn) modalDemoBtn.addEventListener('click', closeModal);
  if (caseModal) {
    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !caseModal.hidden) closeModal();
    });
  }

  /* ------------------------------------------------------------------------
     4. Objections / FAQ Interactive Accordion
     ------------------------------------------------------------------------ */
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach((trigger) => {
    const item = trigger.closest('.faq-item');
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (trigger.getAttribute('aria-expanded') === 'true' && item) {
      item.classList.add('open');
    }

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      faqTriggers.forEach((other) => {
        const otherItem = other.closest('.faq-item');
        const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
        other.setAttribute('aria-expanded', 'false');
        if (otherItem) otherItem.classList.remove('open');
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        if (item) item.classList.add('open');
        if (panel) panel.hidden = false;
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Book a Demo — Interactive Frosted Calendar Date & Time Picker
     ------------------------------------------------------------------------ */
  const dateStrip = document.getElementById('dateStrip');
  const timeGrid = document.getElementById('timeGrid');
  const pickerTz = document.getElementById('pickerTz');
  const demoForm = document.getElementById('demoForm');
  const formError = document.getElementById('formError');
  const demoConfirmation = document.getElementById('demoConfirmation');
  const resetDemoBtn = document.getElementById('resetDemoBtn');

  const confEmail = document.getElementById('confEmail');
  const confName = document.getElementById('confName');
  const confSlot = document.getElementById('confSlot');
  const confCad = document.getElementById('confCad');

  const TIME_SLOTS = ['09:30', '11:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate next 5 business days
  const upcomingDays = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (upcomingDays.length < 5) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      upcomingDays.push(new Date(cursor.getTime()));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  let selectedDate = upcomingDays[0];
  let selectedTime = TIME_SLOTS[1];

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (pickerTz && tz) pickerTz.textContent = tz.replace(/_/g, ' ');
  } catch (_) {
    // Fallback keeps "Local Time"
  }

  function formatDateLabel(d) {
    return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
  }

  function renderDates() {
    if (!dateStrip) return;
    dateStrip.innerHTML = '';
    upcomingDays.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-btn' + (d === selectedDate ? ' selected' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(d === selectedDate));
      btn.innerHTML = `
        <span class="date-day">${DAY_NAMES[d.getDay()]}</span>
        <span class="date-num">${d.getDate()}</span>
        <span class="date-mon">${MONTH_NAMES[d.getMonth()]}</span>
      `;
      btn.addEventListener('click', () => {
        selectedDate = upcomingDays[idx];
        renderDates();
      });
      dateStrip.appendChild(btn);
    });
  }

  function renderTimes() {
    if (!timeGrid) return;
    timeGrid.innerHTML = '';
    TIME_SLOTS.forEach((slot) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-btn' + (slot === selectedTime ? ' selected' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(slot === selectedTime));
      btn.textContent = slot;
      btn.addEventListener('click', () => {
        selectedTime = slot;
        renderTimes();
      });
      timeGrid.appendChild(btn);
    });
  }

  renderDates();
  renderTimes();

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('fullName').value.trim();
      const emailVal = document.getElementById('workEmail').value.trim();
      const cadVal = document.getElementById('cadTool').value;

      if (!nameVal || !emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || !cadVal) {
        formError.textContent = 'Please enter your name, a valid work email, and select your primary CAD tool.';
        formError.hidden = false;
        return;
      }

      formError.hidden = true;
      confName.textContent = nameVal;
      confEmail.textContent = emailVal;
      confSlot.textContent = `${formatDateLabel(selectedDate)} at ${selectedTime}`;
      confCad.textContent = cadVal;

      demoForm.hidden = true;
      demoConfirmation.hidden = false;
    });
  }

  if (resetDemoBtn && demoForm && demoConfirmation) {
    resetDemoBtn.addEventListener('click', () => {
      demoForm.reset();
      demoConfirmation.hidden = true;
      demoForm.hidden = false;
    });
  }
})();
