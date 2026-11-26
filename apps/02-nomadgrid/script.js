(() => {
  'use strict';

  const screens = Array.from(document.querySelectorAll('.app-screen'));
  const railBtns = Array.from(document.querySelectorAll('.rail-btn'));
  const bottomNav = document.getElementById('bottomNav');
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const navIndicator = document.getElementById('navIndicator');
  const toastEl = document.getElementById('toast');

  const NAV_SCREENS = ['03', '04', '05', '07'];
  const NAV_ORDER = ['03', '04', '05', '06', '07'];

  let toastTimer = null;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function goToScreen(id) {
    screens.forEach((s) => {
      const match = s.dataset.screenId === id;
      s.classList.toggle('active', match);
      if (match) {
        const scroll = s.querySelector('.screen-scroll');
        if (scroll) scroll.scrollTop = 0;
      }
    });

    railBtns.forEach((b) => b.classList.toggle('active', b.dataset.screen === id));

    const showNav = NAV_SCREENS.includes(id);
    bottomNav.classList.toggle('hidden', !showNav);

    const navIdx = NAV_ORDER.indexOf(id);
    if (navIdx >= 0) {
      navBtns.forEach((b, idx) => b.classList.toggle('active', idx === navIdx));
      navIndicator.style.transform = `translateX(${navIdx * 100}%)`;
    }
  }

  // Rail navigation
  railBtns.forEach((btn) => {
    btn.addEventListener('click', () => goToScreen(btn.dataset.screen));
  });

  // Bottom tab bar navigation
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => goToScreen(btn.dataset.nav));
  });

  // Generic [data-go] navigation triggers
  document.querySelectorAll('[data-go]').forEach((el) => {
    el.addEventListener('click', () => goToScreen(el.dataset.go));
  });

  // ==========================================
  // SCREEN 01: ONBOARDING STEPPER
  // ==========================================
  const onboardSlides = [
    {
      step: 'STEP 1/3',
      route: 'LHR → HND',
      copy: 'Every flight, transit card, hotel & FX rate snapped into one grid.',
      headline: 'Travel in modular clarity.',
      sub: 'Build your itinerary from live bento blocks—boarding passes, gate shifts, local transit cards, and offline FX rates.',
    },
    {
      step: 'STEP 2/3',
      route: 'SUICA + NFC',
      copy: 'Zero-signal boarding passes and IC transit balance ready at the gate.',
      headline: 'Offline by default.',
      sub: 'Subway tunnels and airplane mode never lock you out of your QR boarding pass or hotel NFC key.',
    },
    {
      step: 'STEP 3/3',
      route: 'GATE B14',
      copy: 'Instant haptic alerts for gate changes, delays, and boarding calls.',
      headline: 'Always two steps ahead.',
      sub: 'Enable flight alerts so NomadGrid updates your bento tiles before airport boards even refresh.',
    },
  ];

  const stepDots = Array.from(document.querySelectorAll('.step-dot'));
  function setOnboardSlide(idx) {
    const s = onboardSlides[idx];
    document.getElementById('onboardStepBadge').textContent = s.step;
    document.getElementById('onboardHeroTitle').textContent = s.route;
    document.getElementById('onboardHeroCopy').textContent = s.copy;
    document.getElementById('onboardHeadline').textContent = s.headline;
    document.getElementById('onboardSub').textContent = s.sub;
    stepDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  stepDots.forEach((dot) => {
    dot.addEventListener('click', () => setOnboardSlide(Number(dot.dataset.step)));
  });

  document.getElementById('btnAllowAlerts').addEventListener('click', () => {
    showToast('Flight alerts enabled · Welcome to Tokyo Grid');
    goToScreen('03');
  });

  // ==========================================
  // SCREEN 02: LOGIN / SIGN-UP
  // ==========================================
  const authSegBtns = Array.from(document.querySelectorAll('#authSeg .seg-btn'));
  authSegBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      authSegBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const isSignup = btn.dataset.authMode === 'signup';
      document.getElementById('authHeading').innerHTML = isSignup
        ? 'Create your<br />NomadGrid ID.'
        : 'Welcome back,<br />Nomad.';
      document.getElementById('authSubmitBtn').textContent = isSignup
        ? 'Create Passport & Start →'
        : 'Unlock Tokyo Grid →';
    });
  });

  const authPass = document.getElementById('authPass');
  const togglePassBtn = document.getElementById('togglePassBtn');
  togglePassBtn.addEventListener('click', () => {
    const hidden = authPass.type === 'password';
    authPass.type = hidden ? 'text' : 'password';
    togglePassBtn.textContent = hidden ? 'HIDE' : 'SHOW';
  });

  document.getElementById('btnRecover').addEventListener('click', () => {
    showToast('Recovery link sent to allan@nomadgrid.travel');
  });

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Signed in · Syncing Tokyo Grid');
    goToScreen('03');
  });

  document.querySelectorAll('[data-social]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast(`Signed in with ${btn.dataset.social}`);
      goToScreen('03');
    });
  });

  // ==========================================
  // SCREEN 03: HOME INTERACTIVE BENTO TILES
  // ==========================================
  const FX_RATE = 164.2;
  const fxInput = document.getElementById('fxEurInput');
  const fxOut = document.getElementById('fxJpyOut');
  const fxAmounts = [10, 50, 100, 250, 500];
  let fxIdx = 2;

  function updateFx() {
    const val = Math.max(0, Number(fxInput.value) || 0);
    fxOut.textContent = `¥${Math.round(val * FX_RATE).toLocaleString()}`;
  }
  fxInput.addEventListener('input', updateFx);
  document.getElementById('fxCycleBtn').addEventListener('click', () => {
    fxIdx = (fxIdx + 1) % fxAmounts.length;
    fxInput.value = String(fxAmounts[fxIdx]);
    updateFx();
  });

  // Weather toggle C/F
  let isCelsius = true;
  document.getElementById('weatherTile').addEventListener('click', () => {
    isCelsius = !isCelsius;
    document.getElementById('wxTemp').textContent = isCelsius ? '19°C' : '66°F';
    document.getElementById('wxHl').textContent = isCelsius ? 'H: 22° · L: 14°' : 'H: 72° · L: 57°';
  });

  // Trunk Hotel NFC unlock
  let nfcUnlocked = false;
  document.getElementById('hotelTile').addEventListener('click', () => {
    nfcUnlocked = !nfcUnlocked;
    document.getElementById('hotelNfc').textContent = nfcUnlocked
      ? 'Room 402 Unlocked ✓'
      : 'Key Ready · NFC';
    showToast(nfcUnlocked ? 'NFC Key active · Hold phone to Room 402' : 'NFC Key locked');
  });

  // Suica instant top-up
  let suicaBalance = 4850;
  document.getElementById('suicaTile').addEventListener('click', () => {
    suicaBalance += 1000;
    document.getElementById('suicaBal').textContent = `¥${suicaBalance.toLocaleString()}`;
    showToast(`Suica topped up +¥1,000 · Balance ¥${suicaBalance.toLocaleString()}`);
  });

  // ==========================================
  // SCREEN 04: LIVE SEARCH & FILTER EXPLORE
  // ==========================================
  const exploreItems = [
    {
      title: 'JAL Sakura Sky View',
      cat: 'lounge',
      badge: 'LOUNGE · HND T3',
      rating: '4.9 ★',
      desc: 'Quiet work booths, runway view, shower suites & fresh curry bar near Gate 114.',
      foot: 'Included with OneWorld Sapphire · 3 min walk',
      tone: 'tile-ice',
      wide: true,
    },
    {
      title: 'Koffee Mameya',
      cat: 'coffee',
      badge: 'COFFEE',
      desc: 'Omotesando · 12 min walk from Trunk Hotel',
      foot: 'OPEN · 10:00–18:00',
      tone: 'tile-slate',
      wide: false,
    },
    {
      title: 'Shibuya Sky',
      cat: 'view',
      badge: 'VIEWPOINT',
      desc: 'Sunset slot 17:20 · QR pass cached offline',
      foot: '¥2,200 · Booked',
      tone: 'tile-violet',
      wide: false,
    },
    {
      title: 'Tokyo Monorail',
      cat: 'transit',
      badge: 'TRANSIT',
      desc: 'Haneda T3 Express · Every 8 mins',
      foot: '¥520 · Suica Tap',
      tone: 'tile-lime',
      wide: false,
    },
    {
      title: 'Blue Bottle Aoyama',
      cat: 'coffee',
      badge: 'COFFEE',
      desc: 'Fast Wi-Fi · Power seats on balcony',
      foot: 'OPEN · 08:00–19:00',
      tone: 'tile-slate',
      wide: false,
    },
  ];

  let activeCat = 'all';
  const exploreGrid = document.getElementById('exploreGrid');
  const exploreSearch = document.getElementById('exploreSearch');

  function renderExplore() {
    const q = exploreSearch.value.trim().toLowerCase();
    const filtered = exploreItems.filter((item) => {
      const catOk = activeCat === 'all' || item.cat === activeCat;
      const textOk =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q);
      return catOk && textOk;
    });

    if (!filtered.length) {
      exploreGrid.innerHTML = `
        <div class="tile tile-slate explore-card-wide">
          <div class="tile-h3">No matching spots</div>
          <p class="tile-p">Try searching "lounge", "coffee", or "Shibuya".</p>
        </div>
      `;
      return;
    }

    exploreGrid.innerHTML = filtered
      .map((item) => {
        const darkText = item.tone !== 'tile-slate';
        const pillCls = darkText ? 'pill-ink' : 'pill-tangerine';
        const titleCls = darkText ? 'tile-h3-dark' : 'tile-h3';
        const copyCls = darkText ? 'tile-p-dark' : 'tile-p';
        return `
          <button class="tile ${item.tone} ${item.wide ? 'explore-card-wide' : ''}" type="button" data-spot="${item.title}">
            <div class="row-between">
              <span class="pill ${pillCls}">${item.badge}</span>
              ${item.rating ? `<span class="pill pill-ink">${item.rating}</span>` : ''}
            </div>
            <div class="${titleCls}">${item.title}</div>
            <p class="${copyCls}">${item.desc}</p>
            <div style="margin-top:8px;font-size:10.5px;font-weight:800;color:${darkText ? '#111216' : '#C8F550'}">${item.foot}</div>
          </button>
        `;
      })
      .join('');

    exploreGrid.querySelectorAll('[data-spot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast(`Pinned "${btn.dataset.spot}" to Tokyo Grid`);
      });
    });
  }

  document.querySelectorAll('#exploreFilters .filter-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#exploreFilters .filter-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderExplore();
    });
  });

  exploreSearch.addEventListener('input', renderExplore);
  document.querySelectorAll('[data-hub]').forEach((btn) => {
    btn.addEventListener('click', () => showToast(`Loaded ${btn.dataset.hub} offline bento pack`));
  });
  renderExplore();

  // ==========================================
  // SCREEN 05: INTERACTIVE BOARDING PASS FLIP
  // ==========================================
  const passFlipWrap = document.getElementById('passFlipWrap');
  const flipPassBtn = document.getElementById('flipPassBtn');
  function togglePassFlip() {
    const flipped = passFlipWrap.classList.toggle('flipped');
    flipPassBtn.textContent = flipped ? 'Barcode ↻' : 'Details ↻';
  }
  flipPassBtn.addEventListener('click', togglePassFlip);
  document.getElementById('flipBackBtn').addEventListener('click', togglePassFlip);
  document.getElementById('walletBtn').addEventListener('click', () => {
    showToast('JL044 Boarding Pass synced to Apple Wallet');
  });

  // ==========================================
  // SCREEN 06: MULTI-STEP CHECKOUT -> CONFIRMATION
  // ==========================================
  let selectedClass = 'Standard';
  let selectedPrice = 520;
  let selectedSeat = '14A';

  const checkoutSteps = Array.from(document.querySelectorAll('.checkout-step'));
  const checkoutStepPill = document.getElementById('checkoutStepPill');
  const checkoutProgress = document.getElementById('checkoutProgress');

  function setCheckoutStep(stepNum) {
    checkoutSteps.forEach((el) => el.classList.toggle('active', Number(el.dataset.step) === stepNum));
    checkoutStepPill.textContent = `STEP ${stepNum} OF 3`;
    checkoutProgress.style.width = `${(stepNum / 3) * 100}%`;
    if (stepNum === 3) {
      document.getElementById('sumClass').textContent = selectedClass;
      document.getElementById('sumSeat').textContent = selectedSeat;
      document.getElementById('sumPrice').textContent = `¥${selectedPrice.toLocaleString()}`;
    }
  }

  document.querySelectorAll('.class-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.class-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      selectedClass = card.dataset.class;
      selectedPrice = Number(card.dataset.price);
    });
  });

  // Seat grid
  const seatGrid = document.getElementById('seatGrid');
  const seats = [
    { id: '12A', taken: true }, { id: '12B', taken: false }, { id: '12C', taken: false }, { id: '12D', taken: true },
    { id: '13A', taken: false }, { id: '13B', taken: true }, { id: '13C', taken: false }, { id: '13D', taken: false },
    { id: '14A', taken: false }, { id: '14B', taken: false }, { id: '14C', taken: true }, { id: '14D', taken: false },
  ];

  function renderSeats() {
    seatGrid.innerHTML = seats
      .map((s) => {
        const cls = s.taken ? 'taken' : s.id === selectedSeat ? 'selected' : '';
        return `<button type="button" class="seat-btn ${cls}" data-seat="${s.id}" ${s.taken ? 'disabled' : ''}>${s.id}</button>`;
      })
      .join('');

    seatGrid.querySelectorAll('.seat-btn:not(.taken)').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedSeat = btn.dataset.seat;
        document.getElementById('pickedSeatPill').textContent = `SEAT ${selectedSeat}`;
        renderSeats();
      });
    });
  }
  renderSeats();

  document.getElementById('toStep2Btn').addEventListener('click', () => setCheckoutStep(2));
  document.getElementById('backStep1Btn').addEventListener('click', () => setCheckoutStep(1));
  document.getElementById('toStep3Btn').addEventListener('click', () => setCheckoutStep(3));
  document.getElementById('backStep2Btn').addEventListener('click', () => setCheckoutStep(2));

  document.getElementById('confirmPayBtn').addEventListener('click', () => {
    suicaBalance = Math.max(0, suicaBalance - selectedPrice);
    document.getElementById('suicaBal').textContent = `¥${suicaBalance.toLocaleString()}`;
    document.getElementById('homeSeatBadge').textContent = `SEAT ${selectedSeat}`;
    document.getElementById('passSeatVal').textContent = selectedSeat;
    document.getElementById('confirmStateTitle').textContent = `Seat ${selectedSeat} Confirmed!`;
    document.getElementById('confirmStateCopy').textContent = `${selectedClass} Express (¥${selectedPrice.toLocaleString()}) & JL044 pass synced offline.`;
    setStateFilter('confirm');
    showToast(`Paid ¥${selectedPrice.toLocaleString()} · Seat ${selectedSeat} confirmed`);
    setCheckoutStep(1);
    goToScreen('08');
  });

  // ==========================================
  // SCREEN 07: PROFILE / SETTINGS
  // ==========================================
  const currencies = ['EUR (€)', 'USD ($)', 'GBP (£)', 'SGD (S$)'];
  let curIdx = 0;
  document.getElementById('currencyToggle').addEventListener('click', () => {
    curIdx = (curIdx + 1) % currencies.length;
    document.getElementById('homeCurrencyVal').textContent = currencies[curIdx];
    showToast(`Home currency set to ${currencies[curIdx]}`);
  });

  document.getElementById('offlineCacheToggle').addEventListener('change', (e) => {
    document.getElementById('cacheSizeVal').textContent = e.target.checked ? '42 MB' : '0 MB';
    showToast(e.target.checked ? 'Offline trip cache enabled' : 'Offline trip cache cleared');
  });

  ['gateAlertsToggle', 'mapsToggle', 'bioToggle'].forEach((id) => {
    document.getElementById(id).addEventListener('change', (e) => {
      showToast(`${e.target.checked ? 'Enabled' : 'Disabled'} preference`);
    });
  });

  document.querySelectorAll('[data-trip]').forEach((btn) => {
    btn.addEventListener('click', () => showToast(`Previewing ${btn.dataset.trip} trip pack`));
  });

  // ==========================================
  // SCREEN 08: EMPTY / ERROR / CONFIRMATION SWITCHER
  // ==========================================
  const stateBtns = Array.from(document.querySelectorAll('#stateSwitcher .seg-btn'));
  const stateCards = Array.from(document.querySelectorAll('.state-card'));

  function setStateFilter(filter) {
    stateBtns.forEach((b) => b.classList.toggle('active', b.dataset.stateFilter === filter));
    stateCards.forEach((c) => {
      const show = filter === 'all' || c.dataset.state === filter;
      c.classList.toggle('hidden', !show);
    });
  }

  stateBtns.forEach((btn) => {
    btn.addEventListener('click', () => setStateFilter(btn.dataset.stateFilter));
  });

  document.getElementById('retrySyncBtn').addEventListener('click', () => {
    showToast('Reconnected · Flight JL044 synced');
    setStateFilter('confirm');
  });

  // Start on Screen 03 (Home / Tokyo Bento Grid)
  goToScreen('03');
})();
