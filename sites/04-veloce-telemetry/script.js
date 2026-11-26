/* =========================================================
   VELOCE TELEMETRY — INTERACTIVE TELEMETRY & CONVERSION JS
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initLiveTelemetryDeck();
  initThermalHeatmap();
  initCaseStudies();
  initAccordion();
  initDemoBooking();
  initElevationBorderScan();
  initTechnicalReveals();
});

/* ---------------------------------------------------------
   Mobile Navigation
--------------------------------------------------------- */
function initMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = !nav.hidden;
    nav.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   01 Hero: Live-Updating Simulated Telemetry Deck
--------------------------------------------------------- */
function initLiveTelemetryDeck() {
  const speedEl = document.getElementById('simSpeed');
  const gearEl = document.getElementById('simGear');
  const tempEl = document.getElementById('simTemp');
  const tempDeltaEl = document.getElementById('simTempDelta');
  const regenEl = document.getElementById('simRegen');
  const modeEl = document.getElementById('simMode');
  const latencyEl = document.getElementById('simLatency');
  const sectorEl = document.getElementById('deckSector');
  const canFrameEl = document.getElementById('simCanFrame');
  const socEl = document.getElementById('simSoc');
  const toggleBtn = document.getElementById('telemetryToggle');

  const barS1 = document.getElementById('barS1');
  const barS2 = document.getElementById('barS2');
  const barS3 = document.getElementById('barS3');
  const valS1 = document.getElementById('valS1');
  const valS2 = document.getElementById('valS2');
  const valS3 = document.getElementById('valS3');
  const spectrumStrip = document.getElementById('spectrumStrip');

  if (!speedEl || !spectrumStrip) return;

  // Build 24 spectrum bars
  const spectrumBars = [];
  for (let i = 0; i < 24; i++) {
    const bar = document.createElement('div');
    bar.className = 'spectrum-bar';
    bar.style.height = `${25 + Math.random() * 65}%`;
    spectrumStrip.appendChild(bar);
    spectrumBars.push(bar);
  }

  let paused = false;
  let elapsed = 0;
  let lastFrame = performance.now();
  let lastSlowTick = 0;
  let lap = 14;
  let soc = 68.4;

  const canIds = ['0x18F', '0x204', '0x31A', '0x412', '0x50B'];
  let canIdx = 0;

  function randomHexByte() {
    return Math.floor(Math.random() * 256)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0');
  }

  function renderFrame(now) {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    if (!paused) {
      elapsed += dt;
      const phase = elapsed * 0.95;

      // Smooth 60fps continuous racing telemetry curves
      const speedRaw = 216 + Math.sin(phase) * 58 + Math.cos(phase * 2.15) * 19;
      const speed = Math.round(speedRaw);
      const isBraking = Math.cos(phase) < -0.22;

      const gear = speed > 258 ? 5 : speed > 212 ? 4 : speed > 168 ? 3 : 2;
      const packTemp = (43.5 + Math.sin(phase * 0.38) * 2.2 + Math.sin(phase * 3.7) * 0.12).toFixed(1);
      const maxDelta = (1.4 + Math.abs(Math.sin(phase * 0.52)) * 1.1).toFixed(1);

      const powerKw = isBraking
        ? Math.round(138 + Math.abs(Math.cos(phase)) * 96)
        : -Math.round(192 + Math.abs(Math.sin(phase)) * 158);

      soc = Math.max(12.0, soc - (isBraking ? -0.015 : 0.028) * dt);

      speedEl.textContent = String(speed);
      gearEl.textContent = isBraking
        ? `GEAR ${gear} · BRAKE HARVEST`
        : `GEAR ${gear} · FULL THROTTLE`;
      gearEl.className = `kpi-meta mono ${isBraking ? 'text-cyan' : 'text-volt'}`;

      tempEl.textContent = packTemp;
      tempDeltaEl.textContent = `MAX CELL +${maxDelta}°C`;

      regenEl.textContent = powerKw >= 0 ? `+${powerKw}` : `${powerKw}`;
      modeEl.textContent = powerKw >= 0 ? 'MGU-K HARVEST' : 'PEAK DISCHARGE';
      modeEl.className = `kpi-meta mono ${powerKw >= 0 ? 'text-cyan' : 'text-volt'}`;

      // Smooth oscillating neon sector power bars
      const s1 = Math.round(244 + Math.sin(phase * 1.15 + 0.4) * 86);
      const s2 = Math.round(218 + Math.cos(phase * 1.35) * 78);
      const s3 = Math.round(268 + Math.sin(phase * 0.92 + 1.8) * 82);

      barS1.style.width = `${Math.min(98, Math.max(22, (s1 / 360) * 100)).toFixed(1)}%`;
      barS2.style.width = `${Math.min(98, Math.max(22, (s2 / 360) * 100)).toFixed(1)}%`;
      barS3.style.width = `${Math.min(98, Math.max(22, (s3 / 360) * 100)).toFixed(1)}%`;

      valS1.textContent = `${s1} kW`;
      valS2.textContent = `${s2} kW`;
      valS3.textContent = `${s3} kW`;

      // Smooth 24-channel harmonic spectrum oscillation
      spectrumBars.forEach((bar, i) => {
        const wave = Math.sin(phase * 2.6 + i * 0.42) * 0.5 + 0.5;
        const micro = Math.cos(phase * 5.2 - i * 0.7) * 0.14;
        const pct = Math.min(100, Math.max(14, Math.round((0.18 + wave * 0.72 + micro) * 100)));
        bar.style.height = `${pct}%`;
        if (pct > 80) {
          bar.style.backgroundColor = 'rgba(212, 255, 0, 0.88)';
        } else if (pct > 52) {
          bar.style.backgroundColor = 'rgba(0, 229, 255, 0.65)';
        } else {
          bar.style.backgroundColor = 'rgba(168, 85, 247, 0.48)';
        }
      });

      // Discrete 140ms CAN frame & latency ticker
      if (now - lastSlowTick > 140) {
        lastSlowTick = now;
        canIdx += 1;
        const latency = (8.1 + Math.random() * 2.8).toFixed(1);
        const sectorIdx = (Math.floor(elapsed / 6) % 3) + 1;
        if (canIdx % 95 === 0) lap += 1;

        latencyEl.textContent = `${latency}ms`;
        sectorEl.textContent = `LAP ${lap} · S${sectorIdx}`;
        socEl.textContent = `${soc.toFixed(1)}%`;

        const id = canIds[canIdx % canIds.length];
        const bytes = Array.from({ length: 8 }, randomHexByte).join(' ');
        canFrameEl.textContent = `CAN0 ${id} [8] ${bytes}`;
      }
    }

    requestAnimationFrame(renderFrame);
  }

  toggleBtn.addEventListener('click', () => {
    paused = !paused;
    toggleBtn.textContent = paused ? 'RESUME' : 'PAUSE';
    toggleBtn.setAttribute('aria-pressed', String(paused));
  });

  requestAnimationFrame(renderFrame);
}

/* ---------------------------------------------------------
   03 Product Tour: Interactive 48-Cell Thermal Heatmap
--------------------------------------------------------- */
function initThermalHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  const readout = document.getElementById('heatmapReadout');
  if (!grid || !readout) return;

  const totalCells = 48; // 12 x 4 compact module view
  for (let i = 1; i <= totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'heat-cell';

    // Cluster hotspot around cells 18-30
    const dist = Math.abs(i - 26);
    const baseTemp = 48.2 - dist * 0.36 + (Math.random() - 0.5) * 1.8;
    const temp = Math.max(36.2, Math.min(49.8, baseTemp));

    let bg = '#134E63';
    if (temp >= 47.0) bg = '#D4FF00';
    else if (temp >= 44.5) bg = '#A855F7';
    else if (temp >= 41.5) bg = '#00B8D9';
    else if (temp >= 39.0) bg = '#0F7690';

    cell.style.backgroundColor = bg;
    cell.dataset.cell = `C${String(i).padStart(2, '0')}`;
    cell.dataset.temp = temp.toFixed(1);

    cell.addEventListener('mouseenter', () => {
      readout.textContent = `${cell.dataset.cell}: ${cell.dataset.temp}°C`;
    });

    grid.appendChild(cell);
  }
}

/* ---------------------------------------------------------
   05 Case Studies: Technical Breakdown Toggles
--------------------------------------------------------- */
function initCaseStudies() {
  document.querySelectorAll('[data-case-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = `case-${btn.dataset.caseToggle}`;
      const detail = document.getElementById(targetId);
      if (!detail) return;

      const isOpen = !detail.hidden;
      detail.hidden = isOpen;
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.innerHTML = isOpen
        ? 'Read technical breakdown <span aria-hidden="true">&rarr;</span>'
        : 'Hide technical breakdown <span aria-hidden="true">&uarr;</span>';
    });
  });
}

/* ---------------------------------------------------------
   06 Objections / FAQ: Dark Interactive Accordion
--------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll('#faqAccordion .accordion-item');
  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    const icon = item.querySelector('.accordion-icon');
    if (!trigger || !panel || !icon) return;

    trigger.addEventListener('click', () => {
      const currentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close others for crisp single-open focus
      items.forEach((other) => {
        const t = other.querySelector('.accordion-trigger');
        const p = other.querySelector('.accordion-panel');
        const ic = other.querySelector('.accordion-icon');
        if (t && p && ic) {
          t.setAttribute('aria-expanded', 'false');
          p.hidden = true;
          ic.textContent = '+';
        }
      });

      if (!currentlyExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        icon.textContent = '−';
      }
    });
  });
}

/* ---------------------------------------------------------
   08 Book a Demo: UTC Calendar Picker + Confirmation
--------------------------------------------------------- */
function initDemoBooking() {
  const dateGrid = document.getElementById('utcDateGrid');
  const timeGrid = document.getElementById('utcTimeGrid');
  const form = document.getElementById('demoForm');
  const errorEl = document.getElementById('formError');
  const confirmedEl = document.getElementById('demoConfirmed');
  const resetBtn = document.getElementById('resetDemoBtn');

  if (!dateGrid || !timeGrid || !form) return;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate next 5 business days in UTC
  const upcomingDates = [];
  const cursor = new Date();
  cursor.setUTCHours(12, 0, 0, 0);
  while (upcomingDates.length < 5) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      upcomingDates.push({
        dow: days[dow],
        day: cursor.getUTCDate(),
        month: months[cursor.getUTCMonth()],
        label: `${days[dow]}, ${months[cursor.getUTCMonth()]} ${cursor.getUTCDate()}`
      });
    }
  }

  const utcSlots = ['09:00 UTC', '11:30 UTC', '14:00 UTC', '16:30 UTC', '18:00 UTC', '20:30 UTC'];

  let selectedDate = upcomingDates[0].label;
  let selectedTime = utcSlots[2]; // Default 14:00 UTC

  // Render Date buttons
  upcomingDates.forEach((d, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `date-btn${idx === 0 ? ' selected' : ''}`;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(idx === 0));
    btn.innerHTML = `<span class="date-dow">${d.dow}</span><span class="date-num">${d.month} ${d.day}</span>`;

    btn.addEventListener('click', () => {
      selectedDate = d.label;
      dateGrid.querySelectorAll('.date-btn').forEach((b) => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
    });

    dateGrid.appendChild(btn);
  });

  // Render Time buttons
  utcSlots.forEach((slot, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `time-btn${idx === 2 ? ' selected' : ''}`;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(idx === 2));
    btn.textContent = slot;

    btn.addEventListener('click', () => {
      selectedTime = slot;
      timeGrid.querySelectorAll('.time-btn').forEach((b) => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
    });

    timeGrid.appendChild(btn);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('engineerName').value.trim();
    const email = document.getElementById('workEmail').value.trim();
    const vehicles = document.getElementById('vehicleCount').value;

    if (!name || !email || !email.includes('@') || !vehicles) {
      errorEl.textContent = 'Enter your name, valid team email, and vehicle count to lock your UTC slot.';
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    document.getElementById('confName').textContent = name;
    document.getElementById('confEmail').textContent = email;
    document.getElementById('confVehicles').textContent = vehicles;
    document.getElementById('confSlot').textContent = `${selectedDate} · ${selectedTime}`;

    form.hidden = true;
    confirmedEl.hidden = false;
  });

  resetBtn.addEventListener('click', () => {
    confirmedEl.hidden = true;
    form.hidden = false;
  });
}

/* ---------------------------------------------------------
   Dark Mode Elevation: Cursor-Tracked Specular Border Scan
--------------------------------------------------------- */
function initElevationBorderScan() {
  const cards = document.querySelectorAll('.tour-card, .step-card, .case-card, .pricing-card');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x.toFixed(1)}%`);
      card.style.setProperty('--my', `${y.toFixed(1)}%`);
    });
  });
}

/* ---------------------------------------------------------
   Crisp Technical Slide-In Reveals (Clip-Path Lock-In)
--------------------------------------------------------- */
function initTechnicalReveals() {
  const targets = document.querySelectorAll(
    '.proof-bar, .tour-card, .step-card, .case-card, .accordion-item, .pricing-card, .demo-shell'
  );
  if (!targets.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  targets.forEach((el, idx) => {
    el.classList.add('tech-reveal');
    const siblingIndex = Array.from(el.parentElement ? el.parentElement.children : []).indexOf(el);
    const delay = Math.max(0, siblingIndex) * 70;
    el.style.setProperty('--reveal-delay', `${Math.min(delay, 280)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
