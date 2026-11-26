(() => {
  'use strict';

  // ==========================================
  // STATE
  // ==========================================
  const state = {
    activeScreen: 0,
    locked: true,
    climateOn: true,
    cabinTemp: 21.5,
    trunkOpen: false,
    sentryOn: true,
    chargePortOpen: false,
    batteryPct: 84,
    rangeKm: 448,
    selectedFilter: 'all',
    searchQuery: '',
    sessionRunning: true,
    liveKw: 242,
    liveSoc: 64,
    liveKwh: 28.4,
    liveTemp: 38.4,
    liveEta: 14,
    reserveStall: '04',
    reserveTargetPct: 80,
    reservePay: 'apple',
  };

  const STATIONS = [
    { id: 'ionity-vilnius', name: 'IONITY Vilnius North', network: 'ionity', kw: 350, free: 4, total: 6, dist: '1.2 km', price: '€0.49/kWh', isFree: false, featured: true },
    { id: 'ignitis-panorama', name: 'Ignitis ON Panorama', network: 'ignitis', kw: 250, free: 2, total: 4, dist: '2.8 km', price: '€0.44/kWh', isFree: false, featured: false },
    { id: 'volthub-tech', name: 'VoltHub Tech Park', network: 'volthub', kw: 150, free: 6, total: 6, dist: '4.1 km', price: 'FREE PASS', isFree: true, featured: false },
    { id: 'ionity-kaunas', name: 'IONITY Kaunas West', network: 'ionity', kw: 350, free: 0, total: 6, dist: '8.4 km', price: '€0.49/kWh', isFree: false, featured: false },
  ];

  // ==========================================
  // HELPERS
  // ==========================================
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('app-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2300);
  }

  function goToScreen(index) {
    const idx = Number(index);
    if (Number.isNaN(idx) || idx < 0 || idx > 7) return;
    state.activeScreen = idx;

    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.toggle('is-active', Number(s.dataset.screen) === idx);
    });
    document.querySelectorAll('.rail-btn').forEach((btn) => {
      btn.classList.toggle('is-active', Number(btn.dataset.goto) === idx);
    });

    const islandLabel = document.getElementById('island-label');
    const islandDot = document.getElementById('island-dot');
    if (islandLabel && islandDot) {
      if (idx === 4 && state.sessionRunning) {
        islandLabel.textContent = `${Math.round(state.liveKw)} kW LIVE`;
        islandDot.style.background = '#d4ff00';
      } else {
        islandLabel.textContent = state.locked ? 'GT LOCKED' : 'GT UNLOCKED';
        islandDot.style.background = '#00e5ff';
      }
    }
  }

  // ==========================================
  // BOTTOM NAV RENDERER
  // ==========================================
  const NAV_ITEMS = [
    { label: 'Vehicle', icon: '◈', target: 2 },
    { label: 'Chargers', icon: '⚡', target: 3 },
    { label: 'Session', icon: '◎', target: 4 },
    { label: 'Profile', icon: '◉', target: 6 },
  ];

  function renderBottomNavs() {
    document.querySelectorAll('.bottom-nav').forEach((nav) => {
      const screenId = Number(nav.dataset.nav);
      const activeTarget = screenId === 5 ? 3 : screenId === 7 ? 6 : screenId;
      nav.innerHTML = NAV_ITEMS.map((item) => `
        <button class="nav-item ${item.target === activeTarget ? 'is-active' : ''}" data-goto="${item.target}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </button>
      `).join('');
    });
  }

  // ==========================================
  // SCREEN 02: AUTH INTERACTIONS
  // ==========================================
  function initAuth() {
    const modeBtns = document.querySelectorAll('[data-auth-mode]');
    const submitBtn = document.getElementById('auth-submit-btn');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (submitBtn) {
          submitBtn.textContent = btn.dataset.authMode === 'signup' ? 'Create Driver ID' : 'Unlock Console';
        }
      });
    });

    const togglePass = document.getElementById('toggle-pass');
    const passInput = document.getElementById('auth-pass');
    if (togglePass && passInput) {
      togglePass.addEventListener('click', () => {
        const hidden = passInput.type === 'password';
        passInput.type = hidden ? 'text' : 'password';
        togglePass.textContent = hidden ? 'HIDE' : 'SHOW';
      });
    }

    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('BLE 5.3 KEY VERIFIED · WELCOME ALLAN');
        goToScreen(2);
      });
    }

    document.getElementById('passkey-btn')?.addEventListener('click', () => {
      showToast('FACE ID PASSKEY AUTHENTICATED');
      goToScreen(2);
    });
    document.getElementById('apple-btn')?.addEventListener('click', () => {
      showToast('APPLE ID CONNECTED · GT KEY ACTIVE');
      goToScreen(2);
    });
    document.getElementById('vin-recovery-btn')?.addEventListener('click', () => {
      showToast('VIN RECOVERY LINK SENT TO ALLAN@VOLTDRIVE.IO');
    });
  }

  // ==========================================
  // SCREEN 03: HOME VEHICLE HUB INTERACTIONS
  // ==========================================
  function updateClimateUI() {
    const readout = document.getElementById('temp-readout');
    const cabinTele = document.getElementById('home-cabin-temp');
    const ctrlSub = document.getElementById('ctrl-climate-sub');
    const statusText = document.getElementById('climate-status-text');
    const ctrlCard = document.getElementById('ctrl-climate');
    const badge = ctrlCard?.querySelector('.ctrl-badge');

    if (readout) readout.textContent = `${state.cabinTemp.toFixed(1)}°`;
    if (cabinTele) cabinTele.textContent = `${state.cabinTemp.toFixed(1)}°C`;
    if (ctrlSub) ctrlSub.textContent = state.climateOn ? `${state.cabinTemp.toFixed(1)}°C · Active` : 'Standby · Off';
    if (statusText) statusText.textContent = state.climateOn ? 'Pre-conditioning active' : 'Climate paused';
    if (ctrlCard) ctrlCard.classList.toggle('is-active-cyan', state.climateOn);
    if (badge) badge.textContent = state.climateOn ? 'ON' : 'OFF';
  }

  function initHome() {
    const lockPill = document.getElementById('lock-pill');
    const doorState = document.getElementById('home-door-state');
    lockPill?.addEventListener('click', () => {
      state.locked = !state.locked;
      lockPill.textContent = state.locked ? '● LOCKED' : '○ UNLOCKED';
      if (doorState) doorState.textContent = state.locked ? 'LOCKED' : 'OPEN';
      showToast(state.locked ? 'DOORS LOCKED · MIRRORS FOLDED' : 'DOORS UNLOCKED · READY TO DRIVE');
      goToScreen(state.activeScreen);
    });

    document.getElementById('temp-down')?.addEventListener('click', () => {
      state.cabinTemp = Math.max(16, +(state.cabinTemp - 0.5).toFixed(1));
      state.climateOn = true;
      updateClimateUI();
    });

    document.getElementById('temp-up')?.addEventListener('click', () => {
      state.cabinTemp = Math.min(28, +(state.cabinTemp + 0.5).toFixed(1));
      state.climateOn = true;
      updateClimateUI();
    });

    document.getElementById('ctrl-climate')?.addEventListener('click', () => {
      state.climateOn = !state.climateOn;
      updateClimateUI();
      showToast(state.climateOn ? `CLIMATE ON · TARGET ${state.cabinTemp.toFixed(1)}°C` : 'CABIN CLIMATE OFF');
    });

    document.getElementById('ctrl-trunk')?.addEventListener('click', (e) => {
      state.trunkOpen = !state.trunkOpen;
      const card = e.currentTarget;
      card.classList.toggle('is-active-volt', state.trunkOpen);
      card.querySelector('.ctrl-badge').textContent = state.trunkOpen ? 'OPEN' : 'CLOSED';
      document.getElementById('ctrl-trunk-sub').textContent = state.trunkOpen ? 'Rear liftgate open' : 'All latches secure';
      showToast(state.trunkOpen ? 'REAR TRUNK UNLATCHED' : 'TRUNK CLOSED & LOCKED');
    });

    document.getElementById('ctrl-sentry')?.addEventListener('click', (e) => {
      state.sentryOn = !state.sentryOn;
      const card = e.currentTarget;
      card.classList.toggle('is-active-volt', state.sentryOn);
      card.querySelector('.ctrl-badge').textContent = state.sentryOn ? 'ARMED' : 'OFF';
      document.getElementById('ctrl-sentry-sub').textContent = state.sentryOn ? '4 cameras armed' : 'Monitoring paused';
      showToast(state.sentryOn ? 'SENTRY MODE ARMED · 4 CAMS LIVE' : 'SENTRY MODE DISABLED');
    });

    document.getElementById('ctrl-port')?.addEventListener('click', (e) => {
      state.chargePortOpen = !state.chargePortOpen;
      const card = e.currentTarget;
      card.classList.toggle('is-active-cyan', state.chargePortOpen);
      card.querySelector('.ctrl-badge').textContent = state.chargePortOpen ? 'OPEN' : 'LOCKED';
      document.getElementById('ctrl-port-sub').textContent = state.chargePortOpen ? 'CCS2 Flap Open' : 'CCS2 · Tap to open';
      showToast(state.chargePortOpen ? 'CHARGE PORT FLAP OPENED' : 'CHARGE PORT LOCKED');
    });
  }

  // ==========================================
  // SCREEN 04: EXPLORE CHARGERS
  // ==========================================
  function renderStations() {
    const list = document.getElementById('station-list');
    const countPill = document.getElementById('station-count-pill');
    if (!list) return;

    const q = state.searchQuery.trim().toLowerCase();
    const filtered = STATIONS.filter((st) => {
      if (state.selectedFilter === '350' && st.kw < 350) return false;
      if (state.selectedFilter === 'available' && st.free === 0) return false;
      if (state.selectedFilter === 'ionity' && st.network !== 'ionity') return false;
      if (state.selectedFilter === 'free' && !st.isFree) return false;
      if (q && !`${st.name} ${st.kw}kw ${st.network} ${st.price}`.toLowerCase().includes(q)) return false;
      return true;
    });

    if (countPill) countPill.textContent = `${filtered.length} NEARBY`;

    if (filtered.length === 0) {
      list.innerHTML = `<div class="card station-item"><div class="station-name">No matching chargers</div><div class="station-meta">Try clearing a filter or searching another kW tier.</div></div>`;
      return;
    }

    list.innerHTML = filtered.map((st) => `
      <article class="card station-item ${st.featured ? 'rim-volt' : ''}" data-goto="5">
        <div class="station-top">
          <div class="station-name">${st.name}</div>
          <span class="pill ${st.kw >= 350 ? 'pill-volt-soft' : 'pill-cyan'} mono">${st.kw} kW</span>
        </div>
        <div class="station-meta">${st.dist} · ${st.free}/${st.total} Free · ${st.price}</div>
        <div class="station-cta mono">${st.free > 0 ? 'RESERVE STALL & PRE-CONDITION →' : 'JOIN QUEUE →'}</div>
      </article>
    `).join('');
  }

  function initExplore() {
    const searchInput = document.getElementById('charger-search');
    searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderStations();
    });

    document.querySelectorAll('#charger-filters .filter-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#charger-filters .filter-pill').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.selectedFilter = btn.dataset.filter;
        renderStations();
      });
    });

    renderStations();
  }

  // ==========================================
  // SCREEN 05: LIVE CHARGING SESSION
  // ==========================================
  function initLiveSession() {
    const pauseBtn = document.getElementById('session-pause-btn');
    const stopBtn = document.getElementById('stop-session-btn');

    pauseBtn?.addEventListener('click', () => {
      state.sessionRunning = !state.sessionRunning;
      pauseBtn.textContent = state.sessionRunning ? 'PAUSE' : 'RESUME';
      showToast(state.sessionRunning ? 'SUPERCHARGING RESUMED · 242 kW' : 'SESSION PAUSED BY DRIVER');
      if (!state.sessionRunning) {
        document.getElementById('live-kw').textContent = '0';
      }
    });

    stopBtn?.addEventListener('click', () => {
      state.sessionRunning = false;
      if (pauseBtn) pauseBtn.textContent = 'RESUME';
      document.getElementById('live-kw').textContent = '0';
      showToast('CHARGING STOPPED · RECEIPT SAVED TO AUTO-PAY');
    });

    setInterval(() => {
      if (!state.sessionRunning) return;
      const jitter = (Math.random() - 0.5) * 4.2;
      state.liveKw = Math.max(228, Math.min(248, 242 + jitter));
      state.liveKwh = +(state.liveKwh + 0.06).toFixed(1);
      state.liveSoc = Math.min(80, +(state.liveSoc + 0.05).toFixed(1));
      state.liveTemp = +(38.2 + Math.sin(Date.now() / 3000) * 0.4).toFixed(1);

      const kwEl = document.getElementById('live-kw');
      const kwhEl = document.getElementById('live-kwh');
      const socEl = document.getElementById('live-soc');
      const socBar = document.getElementById('live-soc-bar');
      const tempEl = document.getElementById('live-temp');
      const costEl = document.getElementById('live-cost');
      const dotEl = document.getElementById('curve-dot');

      if (kwEl) kwEl.textContent = Math.round(state.liveKw);
      if (kwhEl) kwhEl.textContent = `+${state.liveKwh.toFixed(1)} kWh`;
      if (socEl) socEl.textContent = `${Math.floor(state.liveSoc)}% → 80%`;
      if (socBar) socBar.style.width = `${state.liveSoc}%`;
      if (tempEl) tempEl.textContent = `${state.liveTemp.toFixed(1)}°C`;
      if (costEl) costEl.textContent = `€${(state.liveKwh * 0.49).toFixed(2)}`;
      if (dotEl) {
        const cx = 140 + ((state.liveSoc - 60) / 20) * 75;
        dotEl.setAttribute('cx', String(Math.min(220, cx)));
      }
      if (state.activeScreen === 4) {
        const islandLabel = document.getElementById('island-label');
        if (islandLabel) islandLabel.textContent = `${Math.round(state.liveKw)} kW LIVE`;
      }
    }, 1400);
  }

  // ==========================================
  // SCREEN 06: MULTI-STEP STALL RESERVE
  // ==========================================
  function updateReserveSummary() {
    const kwh = Math.round((state.reserveTargetPct - 24) * 0.85);
    const total = (kwh * 0.49).toFixed(2);
    const readout = document.getElementById('target-kwh-readout');
    const energy = document.getElementById('est-energy');
    const estTotal = document.getElementById('est-total');
    const confirmBtn = document.getElementById('confirm-reserve-btn');

    if (readout) readout.textContent = `${state.reserveTargetPct}% · ${kwh} kWh`;
    if (energy) energy.textContent = `${kwh.toFixed(1)} kWh`;
    if (estTotal) estTotal.textContent = `€${total}`;
    if (confirmBtn) confirmBtn.textContent = `Confirm Stall ${state.reserveStall}`;
  }

  function initReserveForm() {
    const step1 = document.getElementById('reserve-step-1');
    const step2 = document.getElementById('reserve-step-2');
    const seg2 = document.getElementById('step-seg-2');
    const ind = document.getElementById('step-indicator');

    document.querySelectorAll('#stall-chips .stall-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#stall-chips .stall-chip').forEach((c) => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        state.reserveStall = chip.dataset.stall;
        updateReserveSummary();
      });
    });

    document.getElementById('kwh-slider')?.addEventListener('input', (e) => {
      state.reserveTargetPct = Number(e.target.value);
      updateReserveSummary();
    });

    document.querySelectorAll('#pay-methods .pay-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('#pay-methods .pay-option').forEach((o) => o.classList.remove('is-selected'));
        opt.classList.add('is-selected');
        state.reservePay = opt.dataset.pay;
      });
    });

    document.getElementById('to-step-2')?.addEventListener('click', () => {
      step1?.classList.remove('is-active');
      step2?.classList.add('is-active');
      seg2?.classList.add('is-done');
      if (ind) ind.textContent = '2 / 2';
    });

    document.getElementById('back-to-step-1')?.addEventListener('click', () => {
      step2?.classList.remove('is-active');
      step1?.classList.add('is-active');
      seg2?.classList.remove('is-done');
      if (ind) ind.textContent = '1 / 2';
    });

    document.getElementById('confirm-reserve-btn')?.addEventListener('click', () => {
      const title = document.getElementById('confirm-state-title');
      const desc = document.getElementById('confirm-state-desc');
      if (title) title.textContent = `Stall ${state.reserveStall} Reserved!`;
      if (desc) {
        desc.textContent = `IONITY Vilnius North · 350 kW bay held for 15:00 min. Target ${state.reserveTargetPct}% via Auto-Pay.`;
      }
      showToast(`STALL ${state.reserveStall} RESERVED · PRE-CONDITIONING ON`);
      // Switch Screen 08 to highlight Confirm state
      setStateFilter('confirm');
      goToScreen(7);
    });

    updateReserveSummary();
  }

  // ==========================================
  // SCREEN 07: PROFILE / SETTINGS
  // ==========================================
  function initProfile() {
    const slider = document.getElementById('profile-limit-slider');
    const val = document.getElementById('profile-limit-val');
    slider?.addEventListener('input', (e) => {
      const pct = e.target.value;
      if (val) val.textContent = `${pct}%`;
      const targetBar = document.querySelector('#device-screen .bat-target');
      if (targetBar) targetBar.style.left = `${pct}%`;
    });

    document.querySelectorAll('.pref-toggle').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        const name = e.target.dataset.pref;
        showToast(`${name.toUpperCase()} ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
      });
    });
  }

  // ==========================================
  // SCREEN 08: STATES SWITCHER
  // ==========================================
  function setStateFilter(tab) {
    document.querySelectorAll('#state-switcher .seg-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.stateTab === tab);
    });
    document.querySelectorAll('#state-stack .state-card').forEach((card) => {
      card.classList.toggle('is-hidden', tab !== 'all' && card.dataset.state !== tab);
    });
  }

  function initStates() {
    document.querySelectorAll('#state-switcher .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => setStateFilter(btn.dataset.stateTab));
    });

    document.getElementById('wake-vehicle-btn')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.textContent = 'Pinging LTE-M...';
      setTimeout(() => {
        btn.textContent = 'Vehicle Awake ✓';
        showToast('VOLTDRIVE GT AWAKE · 5G TELEMETRY RESTORED');
        setTimeout(() => {
          btn.textContent = 'Send Wake Pulse';
        }, 2000);
      }, 900);
    });
  }

  // ==========================================
  // GLOBAL NAVIGATION DELEGATION
  // ==========================================
  function initGlobalNav() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-goto]');
      if (!target) return;
      goToScreen(target.dataset.goto);
    });
  }

  // Boot
  renderBottomNavs();
  initGlobalNav();
  initAuth();
  initHome();
  initExplore();
  initLiveSession();
  initReserveForm();
  initProfile();
  initStates();
  goToScreen(0);
})();
