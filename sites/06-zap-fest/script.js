(() => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Mobile Navbar Toggle
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Hero Ticket Pass — Interactive Live Schedule Preview
     -------------------------------------------------------------------------- */
  const scheduleData = {
    fri: [
      { time: '10:00', event: 'Badge Drop & Espresso Rave', stage: 'STAGE A', tone: 'yellow' },
      { time: '13:30', event: 'Brutal Grid Teardown Live', stage: 'STAGE A', tone: 'yellow' },
      { time: '16:00', event: 'GLSL Toy Sprint (90 Min)', stage: 'STAGE B', tone: 'mint' },
      { time: '19:00', event: 'Fluoro-Pink Riso Test Press', stage: 'STAGE C', tone: 'sky' }
    ],
    sat: [
      { time: '10:30', event: 'Variable Font Live Duel', stage: 'STAGE A', tone: 'yellow' },
      { time: '13:00', event: 'Browser Synth & SVG Jam', stage: 'STAGE B', tone: 'mint' },
      { time: '15:30', event: '2-Drum Soy-Ink Poster Run', stage: 'STAGE C', tone: 'sky' },
      { time: '20:00', event: 'Späti Type Critique Night', stage: 'STAGE A', tone: 'yellow' }
    ],
    sun: [
      { time: '11:00', event: '24-Page Zine Staple Bindery', stage: 'STAGE C', tone: 'sky' },
      { time: '14:00', event: 'Final 90-Min Code Jam Demo', stage: 'STAGE B', tone: 'mint' },
      { time: '17:00', event: 'Main Wall Showcase & Awards', stage: 'STAGE A', tone: 'yellow' },
      { time: '20:30', event: 'Funkhaus Closing Warehouse Set', stage: 'ALL', tone: 'mint' }
    ]
  };

  const dayTabs = document.querySelectorAll('.day-tab');
  const scheduleList = document.getElementById('scheduleList');

  function renderSchedule(dayKey) {
    if (!scheduleList || !scheduleData[dayKey]) return;
    scheduleList.innerHTML = scheduleData[dayKey]
      .map(
        (item, idx) => `
        <li class="schedule-item is-snap" style="animation-delay:${idx * 35}ms">
          <span class="schedule-time">${item.time}</span>
          <span class="schedule-event">${item.event}</span>
          <span class="stage-chip stage-chip--${item.tone}">${item.stage}</span>
        </li>`
      )
      .join('');
  }

  dayTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      dayTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderSchedule(tab.dataset.day);
    });
  });

  /* --------------------------------------------------------------------------
     3. Block 05 Case Study Recap Modal
     -------------------------------------------------------------------------- */
  const recaps = {
    pitch: {
      tag: '2025 STUDIO RECAP · PITCH',
      title: 'How Pitch broke out of safe SaaS templates in 72 hours',
      body: 'Eight designers from Pitch claimed a Studio Squad bench at ZAP! 2025. Over three days they prototyped four kinetic variable-type treatments at Stage A, stress-tested them in Stage B browser demos, and brought back a riso-printed brand zine that cut Q4 campaign concepting time by 3x.',
      stats: [
        { val: '3x', label: 'Faster campaign output' },
        { val: '4', label: 'Kinetic type systems' },
        { val: '8', label: 'Designers attended' }
      ]
    },
    collective: {
      tag: '2025 HIRING RECAP · BERLIN INDIE COLLECTIVE',
      title: '11 creative coders & type designers hired straight from Stage B',
      body: 'Five Berlin partner studios ditched cold portfolio screening and joined the 90-Min Code Jam benches alongside attendees. Seeing live problem-solving and taste under a 90-minute clock led directly to 11 signed contracts within 30 days of closing night.',
      stats: [
        { val: '11', label: 'Hires in 30 days' },
        { val: '5', label: 'Partner studios' },
        { val: '90m', label: 'Live audition sprint' }
      ]
    }
  };

  const recapModal = document.getElementById('recapModal');
  const recapModalTag = document.getElementById('recapModalTag');
  const recapModalTitle = document.getElementById('recapModalTitle');
  const recapModalBody = document.getElementById('recapModalBody');
  const recapModalStats = document.getElementById('recapModalStats');
  const recapModalClose = document.getElementById('recapModalClose');
  const recapModalCta = document.getElementById('recapModalCta');

  function closeRecapModal() {
    if (recapModal) recapModal.hidden = true;
  }

  document.querySelectorAll('.recap-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const data = recaps[btn.dataset.recap];
      if (!data || !recapModal) return;
      recapModalTag.textContent = data.tag;
      recapModalTitle.textContent = data.title;
      recapModalBody.textContent = data.body;
      recapModalStats.innerHTML = data.stats
        .map((s) => `<div class="modal-stat"><strong>${s.val}</strong><span>${s.label}</span></div>`)
        .join('');
      recapModal.hidden = false;
      recapModalClose.focus();
    });
  });

  if (recapModalClose) recapModalClose.addEventListener('click', closeRecapModal);
  if (recapModalCta) recapModalCta.addEventListener('click', closeRecapModal);
  if (recapModal) {
    recapModal.addEventListener('click', (e) => {
      if (e.target === recapModal) closeRecapModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recapModal && !recapModal.hidden) {
      closeRecapModal();
    }
  });

  /* --------------------------------------------------------------------------
     4. Block 06 Objections / FAQ Accordion
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const icon = item.querySelector('.faq-icon');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isCurrentlyOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-trigger');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Pricing CTA Pre-Selects Squad Size
     -------------------------------------------------------------------------- */
  const squadSelect = document.getElementById('squadSize');

  document.querySelectorAll('[data-select-squad]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (squadSelect && btn.dataset.selectSquad) {
        squadSelect.value = btn.dataset.selectSquad;
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Block 08 Berlin CET Calendar Picker + 3-Field Form Confirmation
     -------------------------------------------------------------------------- */
  let selectedDate = 'Tue, Oct 6';
  let selectedTime = '11:30 CET';

  const dateButtons = document.querySelectorAll('.date-btn');
  const timeButtons = document.querySelectorAll('.time-btn');

  dateButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      dateButtons.forEach((b) => {
        b.classList.remove('is-selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');
      selectedDate = btn.dataset.date;
    });
  });

  timeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      timeButtons.forEach((b) => {
        b.classList.remove('is-selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');
      selectedTime = btn.dataset.time;
    });
  });

  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirm = document.getElementById('bookingConfirm');
  const formError = document.getElementById('formError');
  const confirmName = document.getElementById('confirmName');
  const confirmEmail = document.getElementById('confirmEmail');
  const confirmSlot = document.getElementById('confirmSlot');
  const confirmSquad = document.getElementById('confirmSquad');
  const resetBooking = document.getElementById('resetBooking');

  if (bookingForm && bookingConfirm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('yourName');
      const emailInput = document.getElementById('workEmail');
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const squadLabel = squadSelect.options[squadSelect.selectedIndex].text;

      if (!nameVal) {
        formError.textContent = 'Drop your name so we know who to greet on the call.';
        formError.hidden = false;
        nameInput.focus();
        return;
      }

      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        formError.textContent = 'Enter a valid work email so we can send the Berlin CET invite.';
        formError.hidden = false;
        emailInput.focus();
        return;
      }

      formError.hidden = true;
      confirmName.textContent = nameVal;
      confirmEmail.textContent = emailVal;
      confirmSlot.textContent = `${selectedDate} · ${selectedTime}`;
      confirmSquad.textContent = squadLabel;

      bookingForm.hidden = true;
      bookingConfirm.hidden = false;
    });
  }

  if (resetBooking && bookingForm && bookingConfirm) {
    resetBooking.addEventListener('click', () => {
      bookingForm.reset();
      bookingConfirm.hidden = true;
      bookingForm.hidden = false;
    });
  }

  /* --------------------------------------------------------------------------
     7. Snappy Zero-Ease Stamp/Snap Scroll Reveals (Neo-Brutalism)
     -------------------------------------------------------------------------- */
  const stampTargets = document.querySelectorAll('[data-stamp]');
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (stampTargets.length && !prefersReduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-stamp-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.stampDelay || 0);
          window.setTimeout(() => {
            el.classList.add('is-stamped');
          }, delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -32px 0px' }
    );

    stampTargets.forEach((el) => observer.observe(el));
  }
})();
