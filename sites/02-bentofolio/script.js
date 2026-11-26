(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Helper: Crisp Ease-Out Count-Up Animation
     ========================================================= */
  const animateNumber = (el, from, to, duration, formatter) => {
    if (!el) return;
    if (prefersReducedMotion || duration <= 0) {
      el.textContent = formatter(to);
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      el.textContent = formatter(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatter(to);
      }
    };
    requestAnimationFrame(step);
  };

  /* =========================================================
     1. Mobile Navigation Drawer
     ========================================================= */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileNavDrawer.hidden = isOpen;
    });

    mobileNavDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNavDrawer.hidden = true;
      });
    });
  }

  /* =========================================================
     2. Hero Interactive Handle Preview (Hero + Coral Tile + Tour)
     ========================================================= */
  const handleInput = document.getElementById('heroHandleInput');
  const handleFeedback = document.getElementById('handleFeedback');
  const handleForm = document.getElementById('handleClaimForm');
  const demoUrlInput = document.getElementById('demoUrl');
  const heroLiveHandle = document.getElementById('heroLiveHandle');
  const tourHandlePreview = document.getElementById('tourHandlePreview');

  const sanitizeHandle = (raw) =>
    raw
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .slice(0, 28);

  if (handleInput && handleFeedback) {
    handleInput.addEventListener('input', () => {
      const clean = sanitizeHandle(handleInput.value);
      if (handleInput.value !== clean) {
        handleInput.value = clean;
      }
      const displayHandle = clean || 'yourname';
      const liveHandle = clean || 'mayalin';
      handleFeedback.innerHTML = `<span class="check-badge">✓</span><span><strong>bentofolio.me/${displayHandle}</strong> is ready to claim on your demo</span>`;
      if (heroLiveHandle) {
        heroLiveHandle.textContent = `LIVE · bentofolio.me/${liveHandle}`;
      }
      if (tourHandlePreview) {
        tourHandlePreview.textContent = `bentofolio.me/${liveHandle}`;
      }
    });
  }

  if (handleForm) {
    handleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clean = sanitizeHandle(handleInput ? handleInput.value : '');
      if (clean && demoUrlInput && !demoUrlInput.value.trim()) {
        demoUrlInput.value = `bentofolio.me/${clean}`;
      }
      const demoSection = document.getElementById('book-demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
      }
      const nameInput = document.getElementById('demoName');
      if (nameInput) {
        setTimeout(() => nameInput.focus({ preventScroll: true }), 450);
      }
    });
  }

  /* =========================================================
     3. Hero Coral Metrics: Animated Count-Up + Rising Bar Chart
     ========================================================= */
  const metricsData = {
    '7d': {
      amountNum: 4890,
      delta: '+24.1%',
      convNum: 7.2,
      item: 'Motion Presets Pack',
      payout: '+$39.00 to Stripe',
      bars: [48, 62, 54, 88, 70, 95, 78],
      peakIndex: 5,
    },
    '30d': {
      amountNum: 18420,
      delta: '+38.4%',
      convNum: 6.8,
      item: 'Editorial UI Kit',
      payout: '+$68.00 to Stripe',
      bars: [42, 58, 49, 76, 68, 92, 84],
      peakIndex: 5,
    },
    '90d': {
      amountNum: 52940,
      delta: '+61.2%',
      convNum: 6.5,
      item: '1:1 Portfolio Audit',
      payout: '+$180.00 to Stripe',
      bars: [52, 64, 71, 66, 82, 88, 96],
      peakIndex: 6,
    },
  };

  const tfButtons = document.querySelectorAll('.tf-btn');
  const amountEl = document.getElementById('heroPayoutAmount');
  const deltaEl = document.getElementById('heroPayoutDelta');
  const convEl = document.getElementById('heroConvRate');
  const itemEl = document.getElementById('heroLatestItem');
  const payoutEl = document.getElementById('heroLatestPayout');
  const miniBars = document.querySelectorAll('#heroMiniBars .bar-col span');
  const heroRightTile = document.querySelector('.hero-right');

  let currentAmount = 0;
  let currentConv = 0;

  const formatDollars = (val) => `$${Math.round(val).toLocaleString('en-US')}`;
  const formatPercent = (val) => `${val.toFixed(1)}%`;

  const applyMetrics = (tf, staggerFromZero = false) => {
    const data = metricsData[tf];
    if (!data) return;

    const fromAmt = staggerFromZero ? 0 : currentAmount;
    const fromConv = staggerFromZero ? 0 : currentConv;
    currentAmount = data.amountNum;
    currentConv = data.convNum;

    animateNumber(amountEl, fromAmt, data.amountNum, 620, formatDollars);
    animateNumber(convEl, fromConv, data.convNum, 520, formatPercent);

    if (deltaEl) deltaEl.textContent = data.delta;
    if (itemEl) itemEl.textContent = data.item;
    if (payoutEl) payoutEl.textContent = data.payout;

    miniBars.forEach((bar, idx) => {
      if (staggerFromZero && !prefersReducedMotion) {
        bar.style.height = '6%';
        setTimeout(() => {
          bar.style.height = `${data.bars[idx]}%`;
          bar.classList.toggle('is-peak', idx === data.peakIndex);
        }, 70 + idx * 55);
      } else {
        bar.style.height = `${data.bars[idx]}%`;
        bar.classList.toggle('is-peak', idx === data.peakIndex);
      }
    });
  };

  tfButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tf = btn.dataset.tf;
      if (!metricsData[tf]) return;
      tfButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyMetrics(tf, false);
    });
  });

  // Trigger rising bar chart & count-up when hero storefront tile enters viewport
  if (heroRightTile && 'IntersectionObserver' in window) {
    let heroAnimated = false;
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !heroAnimated) {
            heroAnimated = true;
            applyMetrics('30d', true);
            heroObserver.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    heroObserver.observe(heroRightTile);
  } else {
    applyMetrics('30d', false);
  }

  /* =========================================================
     4. Product Tour: Smooth Sliding Tab Indicator + Snap Panels
     ========================================================= */
  const tourTabsWrap = document.getElementById('tourTabs');
  const tourIndicator = document.getElementById('tourTabIndicator');
  const tourTabs = document.querySelectorAll('.tour-tab');
  const tourPanels = document.querySelectorAll('.tour-panel');

  const positionTourIndicator = (activeTab) => {
    if (!tourIndicator || !activeTab) return;
    tourIndicator.style.height = `${activeTab.offsetHeight}px`;
    tourIndicator.style.transform = `translateY(${activeTab.offsetTop}px)`;
  };

  const getActiveTourTab = () => document.querySelector('.tour-tab.is-active');

  // Position on initial load & after web fonts settle
  const syncIndicator = () => {
    const active = getActiveTourTab();
    if (active) positionTourIndicator(active);
  };

  syncIndicator();
  window.addEventListener('resize', syncIndicator);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncIndicator);
  }

  tourTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetKey = tab.dataset.tour;
      tourTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      positionTourIndicator(tab);

      tourPanels.forEach((panel) => {
        const match = panel.id === `panel-${targetKey}`;
        panel.hidden = !match;
        panel.classList.remove('is-active');
        if (match) {
          // Force reflow so Bento snap-in & bar fill replay cleanly
          void panel.offsetWidth;
          panel.classList.add('is-active');
        }
      });
    });
  });

  if (tourTabsWrap && 'ResizeObserver' in window) {
    new ResizeObserver(syncIndicator).observe(tourTabsWrap);
  }

  /* =========================================================
     5. Case Studies: Scroll Count-Up Metrics + Story Modal
     ========================================================= */
  const countMetrics = document.querySelectorAll('.count-metric');
  if (countMetrics.length && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.target || '0');
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const decimals = parseInt(el.dataset.decimals || '0', 10);

          animateNumber(el, 0, target, 720, (val) => `${prefix}${val.toFixed(decimals)}${suffix}`);
          metricObserver.unobserve(el);
        });
      },
      { threshold: 0.45 }
    );
    countMetrics.forEach((el) => metricObserver.observe(el));
  }

  const stories = {
    marcus: {
      tag: 'CASE STUDY · MARCUS CHEN',
      title: 'How Marcus Chen grew digital revenue +142% in 60 days',
      metric: '+142% monthly revenue · $1,840/mo saved in platform fees',
      body: 'Marcus used to send Instagram and X followers to a Linktree, which linked to Gumroad, which redirected to Stripe. Mobile checkout conversion hovered at 2.1% and Gumroad took 10% of every font pack. After moving to BentoFolio Pro ($9/mo), his live Figma previews and Apple Pay checkout sit side-by-side on one screen—lifting conversion to 5.4% and letting him keep 100% of every sale.',
    },
    kinetic: {
      tag: 'CASE STUDY · STUDIO KINETIC',
      title: 'How Studio Kinetic 3.8x’d qualified client & asset checkouts',
      metric: '3.8x checkout conversion · 3 team hubs unified',
      body: 'Studio Kinetic ran a heavy Webflow portfolio for client inquiries and a separate storefront for their After Effects motion packs. Visitors rarely found both. By snapping auto-playing showreel tiles, a discovery call booking block, and instant template downloads into one BentoFolio Studio grid, every reel view now drives both client leads and passive template revenue.',
    },
  };

  const storyModal = document.getElementById('storyModal');
  const closeStoryModal = document.getElementById('closeStoryModal');
  const storyModalTag = document.getElementById('storyModalTag');
  const storyModalTitle = document.getElementById('storyModalTitle');
  const storyModalMetric = document.getElementById('storyModalMetric');
  const storyModalBody = document.getElementById('storyModalBody');
  const storyModalCta = document.getElementById('storyModalCta');

  const closeModal = () => {
    if (storyModal) storyModal.hidden = true;
  };

  document.querySelectorAll('.story-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const story = stories[btn.dataset.story];
      if (!story || !storyModal) return;
      storyModalTag.textContent = story.tag;
      storyModalTitle.textContent = story.title;
      storyModalMetric.textContent = story.metric;
      storyModalBody.textContent = story.body;
      storyModal.hidden = false;
      closeStoryModal.focus();
    });
  });

  if (closeStoryModal) closeStoryModal.addEventListener('click', closeModal);
  if (storyModalCta) storyModalCta.addEventListener('click', closeModal);
  if (storyModal) {
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && storyModal && !storyModal.hidden) {
      closeModal();
    }
  });

  /* =========================================================
     6. Magnetic Bento Tile Elevation on Hover (Fine Pointers)
     ========================================================= */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magneticTiles = document.querySelectorAll('.how-card, .case-card, .price-card, .pw-card, .inner-tile');
    magneticTiles.forEach((tile) => {
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        const moveX = (relX * 6).toFixed(2);
        const moveY = (relY * 4 - 4).toFixed(2);
        tile.style.setProperty('--mag-x', `${moveX}px`);
        tile.style.setProperty('--mag-y', `${moveY}px`);
      });

      tile.addEventListener('mouseleave', () => {
        tile.style.setProperty('--mag-x', '0px');
        tile.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* =========================================================
     7. Objections / FAQ Interactive Accordion
     ========================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const ot = other.querySelector('.faq-trigger');
        const oc = other.querySelector('.faq-content');
        if (ot) ot.setAttribute('aria-expanded', 'false');
        if (oc) oc.hidden = true;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });

  /* =========================================================
     8. Book a Demo: Calendar Picker + 3-Field Form + Confirmation
     ========================================================= */
  const datePillsContainer = document.getElementById('datePills');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const tzBadge = document.getElementById('tzBadge');
  const demoForm = document.getElementById('demoForm');
  const demoFormError = document.getElementById('demoFormError');
  const demoConfirmation = document.getElementById('demoConfirmation');
  const resetDemoBtn = document.getElementById('resetDemoBtn');

  const slotPresets = [
    ['9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:00 PM'],
    ['10:00 AM', '11:30 AM', '1:30 PM', '3:00 PM', '4:30 PM', '5:30 PM'],
    ['9:00 AM', '10:30 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM'],
  ];

  let selectedDateLabel = '';
  let selectedTimeLabel = '';

  const getNextBusinessDays = (count) => {
    const days = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);
    while (days.length < count) {
      const dayOfWeek = cursor.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  };

  if (tzBadge) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      tzBadge.textContent = tz ? tz.replace(/_/g, ' ') : 'Local Time';
    } catch {
      tzBadge.textContent = 'Local Time';
    }
  }

  const renderTimeSlots = (dayIdx) => {
    if (!timeSlotsContainer) return;
    const slots = slotPresets[dayIdx % slotPresets.length];
    selectedTimeLabel = slots[1];
    timeSlotsContainer.innerHTML = '';

    slots.forEach((time, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `time-slot${idx === 1 ? ' is-selected' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(idx === 1));
      btn.textContent = time;

      btn.addEventListener('click', () => {
        timeSlotsContainer.querySelectorAll('.time-slot').forEach((s) => {
          s.classList.remove('is-selected');
          s.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-checked', 'true');
        selectedTimeLabel = time;
      });

      timeSlotsContainer.appendChild(btn);
    });
  };

  if (datePillsContainer) {
    const businessDays = getNextBusinessDays(5);
    const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
    const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });

    businessDays.forEach((dateObj, idx) => {
      const dayStr = dayFmt.format(dateObj);
      const dateNum = dateObj.getDate();
      const fullLabel = `${dayStr}, ${monthFmt.format(dateObj)} ${dateNum}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `date-pill${idx === 0 ? ' is-selected' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(idx === 0));
      btn.innerHTML = `<span class="dp-day">${dayStr}</span><span class="dp-num">${dateNum}</span>`;

      if (idx === 0) {
        selectedDateLabel = fullLabel;
      }

      btn.addEventListener('click', () => {
        datePillsContainer.querySelectorAll('.date-pill').forEach((d) => {
          d.classList.remove('is-selected');
          d.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-checked', 'true');
        selectedDateLabel = fullLabel;
        renderTimeSlots(idx);
      });

      datePillsContainer.appendChild(btn);
    });

    renderTimeSlots(0);
  }

  if (demoForm && demoConfirmation) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('demoName').value.trim();
      const email = document.getElementById('demoEmail').value.trim();
      const url = document.getElementById('demoUrl').value.trim();

      if (!name || !email || !email.includes('@') || !url) {
        demoFormError.textContent = 'Please enter your name, a valid work email, and your current portfolio URL.';
        demoFormError.hidden = false;
        return;
      }

      demoFormError.hidden = true;
      document.getElementById('confName').textContent = name;
      document.getElementById('confEmail').textContent = email;
      document.getElementById('confSlot').textContent = `${selectedDateLabel} at ${selectedTimeLabel}`;
      document.getElementById('confUrl').textContent = url;

      demoForm.hidden = true;
      demoConfirmation.hidden = false;
    });

    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        demoConfirmation.hidden = true;
        demoForm.hidden = false;
      });
    }
  }
})();
