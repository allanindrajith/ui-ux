/* ==========================================================================
   KiboCode — Interactive Playground, Tour, FAQ, Case Modal & Demo Booking
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Toggle
     ------------------------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
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

  /* ------------------------------------------------------------------------
     2. Hero Interactive Clay Block-to-Python Playground
     ------------------------------------------------------------------------ */
  const btnBlocksView = document.getElementById('btnBlocksView');
  const btnPythonView = document.getElementById('btnPythonView');
  const btnRunCode = document.getElementById('btnRunCode');
  const btnResetStage = document.getElementById('btnResetStage');
  const pgEditor = document.getElementById('pgEditor');
  const blocksView = document.getElementById('blocksView');
  const pythonView = document.getElementById('pythonView');
  const repeatParam = document.getElementById('repeatParam');
  const actionParam = document.getElementById('actionParam');
  const pyRepeatVal = document.getElementById('pyRepeatVal');
  const pyActionVal = document.getElementById('pyActionVal');
  const kiboSprite = document.getElementById('kiboSprite');
  const kiboSpeech = document.getElementById('kiboSpeech');
  const stageTrack = document.getElementById('stageTrack');
  const pgStage = document.querySelector('.pg-stage');
  const stageScore = document.getElementById('stageScore');
  const consoleText = document.getElementById('consoleText');
  const stars = Array.from(document.querySelectorAll('.star-token'));

  const claySparkColors = ['#FF7857', '#FCE8A6', '#8B64D6', '#38B979', '#5EB8F0'];

  function spawnClayBurst(tileIndex, count = 8) {
    if (!stageTrack) return;
    const tile = stageTrack.querySelector(`[data-tile="${tileIndex}"]`);
    if (!tile) return;
    const x = tile.offsetLeft + tile.offsetWidth / 2;
    const y = tile.offsetTop + tile.offsetHeight / 2;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span');
      spark.className = 'clay-spark';
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.35 - 0.17);
      const dist = 24 + Math.random() * 26;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.background = claySparkColors[i % claySparkColors.length];
      spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * dist - 10}px`);
      stageTrack.appendChild(spark);
      setTimeout(() => spark.remove(), 660);
    }
  }

  const playgroundState = {
    mode: 'blocks',
    repeat: 4,
    action: 'jump', // 'jump' | 'dash'
    running: false,
    timers: [],
  };

  function clearRunTimers() {
    playgroundState.timers.forEach((id) => clearTimeout(id));
    playgroundState.timers = [];
    playgroundState.running = false;
    document.querySelectorAll('.is-running').forEach((el) => el.classList.remove('is-running'));
    if (btnRunCode) {
      btnRunCode.disabled = false;
      btnRunCode.innerHTML = '<span aria-hidden="true">▶</span> Run Code';
    }
  }

  function syncStarVisibility() {
    stars.forEach((star, idx) => {
      star.classList.remove('is-collected');
      star.classList.toggle('is-hidden', idx >= playgroundState.repeat);
    });
    stageScore.textContent = `★ 0 / ${playgroundState.repeat}`;
  }

  function resetStage(message = 'Ready! Press Run Code to watch Kibo play.') {
    clearRunTimers();
    kiboSprite.style.setProperty('--col', 0);
    kiboSprite.classList.remove('is-jumping', 'is-dashing', 'is-celebrating');
    pgStage?.classList.remove('is-victory');
    kiboSpeech.hidden = true;
    syncStarVisibility();
    consoleText.textContent = message;
  }

  function setMode(nextMode) {
    if (playgroundState.mode === nextMode) return;
    playgroundState.mode = nextMode;

    const isPython = nextMode === 'python';
    pgEditor.classList.toggle('is-python', isPython);
    pgEditor.dataset.mode = nextMode;
    blocksView.setAttribute('aria-hidden', String(isPython));
    pythonView.setAttribute('aria-hidden', String(!isPython));
    btnBlocksView.classList.toggle('is-active', !isPython);
    btnBlocksView.setAttribute('aria-selected', String(!isPython));
    btnPythonView.classList.toggle('is-active', isPython);
    btnPythonView.setAttribute('aria-selected', String(isPython));

    if (!playgroundState.running) {
      consoleText.textContent = isPython
        ? 'Flipped to Python 3! Press Run Code to execute.'
        : 'Back in Blocks mode! Click any pill to remix.';
    }
  }

  function highlightStep(stepIndex) {
    document.querySelectorAll('.is-running').forEach((el) => el.classList.remove('is-running'));
    document.querySelectorAll(`[data-step="${stepIndex}"]`).forEach((el) => {
      el.classList.add('is-running');
    });
  }

  function runPlayground() {
    resetStage('Running program...');
    playgroundState.running = true;
    btnRunCode.disabled = true;
    btnRunCode.textContent = 'Running...';

    const total = playgroundState.repeat;
    const isJump = playgroundState.action === 'jump';
    let delay = 180;

    playgroundState.timers.push(setTimeout(() => highlightStep(0), delay));
    delay += 260;

    for (let i = 1; i <= total; i++) {
      const stepNum = i;

      // Loop header
      playgroundState.timers.push(
        setTimeout(() => {
          highlightStep(1);
          consoleText.textContent = `Loop ${stepNum} of ${total}: moving forward...`;
        }, delay)
      );
      delay += 220;

      // Move forward
      playgroundState.timers.push(
        setTimeout(() => {
          highlightStep(2);
          kiboSprite.style.setProperty('--col', stepNum);
        }, delay)
      );
      delay += 340;

      // Action + collect star
      playgroundState.timers.push(
        setTimeout(() => {
          highlightStep(3);
          const animClass = isJump ? 'is-jumping' : 'is-dashing';
          kiboSprite.classList.remove('is-jumping', 'is-dashing');
          void kiboSprite.offsetWidth;
          kiboSprite.classList.add(animClass);

          const starEl = stars[stepNum - 1];
          if (starEl) starEl.classList.add('is-collected');
          spawnClayBurst(stepNum, 7);
          stageScore.textContent = `★ ${stepNum} / ${total}`;
          consoleText.textContent = isJump
            ? `kibo.jump_and_spin() → collected star #${stepNum}!`
            : `kibo.dash_hop() → collected star #${stepNum}!`;
        }, delay)
      );
      delay += 460;
    }

    // Say "Level up!" + Victory Celebration
    playgroundState.timers.push(
      setTimeout(() => {
        highlightStep(4);
        kiboSpeech.hidden = false;
        kiboSprite.classList.remove('is-jumping', 'is-dashing');
        void kiboSprite.offsetWidth;
        kiboSprite.classList.add('is-celebrating');
        pgStage?.classList.add('is-victory');
        spawnClayBurst(total, 14);
        consoleText.textContent = `Output: "Level up!" · Collected ${total}/${total} stars.`;
      }, delay)
    );
    delay += 760;

    playgroundState.timers.push(
      setTimeout(() => {
        clearRunTimers();
      }, delay)
    );
  }

  btnBlocksView?.addEventListener('click', () => setMode('blocks'));
  btnPythonView?.addEventListener('click', () => setMode('python'));
  btnRunCode?.addEventListener('click', runPlayground);
  btnResetStage?.addEventListener('click', () => resetStage());

  repeatParam?.addEventListener('click', () => {
    const cycle = [2, 3, 4];
    const next = cycle[(cycle.indexOf(playgroundState.repeat) + 1) % cycle.length];
    playgroundState.repeat = next;
    repeatParam.textContent = String(next);
    pyRepeatVal.textContent = String(next);
    resetStage(`Updated loop to repeat ${next} times — check Python view!`);
  });

  actionParam?.addEventListener('click', () => {
    const isJump = playgroundState.action === 'jump';
    playgroundState.action = isJump ? 'dash' : 'jump';
    actionParam.textContent = isJump ? 'dash hop' : 'jump & spin';
    pyActionVal.textContent = isJump ? 'dash_hop' : 'jump_and_spin';
    resetStage(`Switched move to ${actionParam.textContent} — Python synced!`);
  });

  syncStarVisibility();

  /* ------------------------------------------------------------------------
     3. Product Tour Tabs
     ------------------------------------------------------------------------ */
  const tourTabs = Array.from(document.querySelectorAll('.tour-tab'));
  const tourPanels = Array.from(document.querySelectorAll('.tour-panel'));

  tourTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.tour;
      tourTabs.forEach((t) => {
        const active = t.dataset.tour === idx;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      tourPanels.forEach((panel) => {
        const active = panel.dataset.tourPanel === idx;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
        if (active) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     4. Case Study Story Modal
     ------------------------------------------------------------------------ */
  const storyData = {
    oakridge: {
      badge: 'K–5 Elementary Rollout',
      title: 'Oakridge Elementary · Portland, OR',
      metric: '92% of 4th-graders writing independent Python loops by Week 6',
      body:
        'Oakridge Elementary rolled KiboCode out across 12 classrooms (320 students) on existing Chromebooks. By letting students toggle between clay blocks and Python 3 on the same canvas, teachers eliminated the painful "grade-4 cliff" where kids usually quit text coding.',
      quote:
        '"For the first time, my 9-year-olds ask to flip into Python on their own—and not a single student got stuck crying over a missing semicolon." — Elena Morales, STEM Lead',
    },
    nordic: {
      badge: 'After-School STEM Studio',
      title: 'Nordic Learning Lab · Stockholm, SE',
      metric: '3.4x more completed playable mini-games per semester',
      body:
        'Nordic Learning Lab runs weekly 60-minute clubs for ages 7–12. Before KiboCode, mentors spent half the session fixing syntax typos. Now students debug visually in Blocks mode, inspect the live Python diff, and ship a shareable game every month.',
      quote:
        '"Parents used to ask what their kids actually learned in coding club. Now they get a weekly pulse email and play their child’s Python game on the train home." — Henrik Lind, Program Director',
    },
  };

  const storyModal = document.getElementById('storyModal');
  const modalClose = document.getElementById('modalClose');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalMetric = document.getElementById('modalMetric');
  const modalBody = document.getElementById('modalBody');
  const modalQuote = document.getElementById('modalQuote');
  const modalCta = document.getElementById('modalCta');

  function closeModal() {
    storyModal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.story-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const data = storyData[btn.dataset.story];
      if (!data) return;
      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalMetric.textContent = data.metric;
      modalBody.textContent = data.body;
      modalQuote.textContent = data.quote;
      storyModal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalCta?.addEventListener('click', closeModal);
  storyModal?.addEventListener('click', (e) => {
    if (e.target === storyModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !storyModal.hidden) closeModal();
  });

  /* ------------------------------------------------------------------------
     5. Objections / FAQ Accordion
     ------------------------------------------------------------------------ */
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    trigger?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------------
     6. Pricing Tier Pre-Selection -> Demo Form
     ------------------------------------------------------------------------ */
  const studentSelect = document.getElementById('studentCount');

  document.querySelectorAll('.pricing-cta').forEach((link) => {
    link.addEventListener('click', () => {
      const preset = link.dataset.students;
      if (preset && studentSelect) {
        studentSelect.value = preset;
      }
    });
  });

  /* ------------------------------------------------------------------------
     7. Book a Demo — Interactive Calendar Date & Time Slot Picker + Submit
     ------------------------------------------------------------------------ */
  const dateGrid = document.getElementById('dateGrid');
  const timeGrid = document.getElementById('timeGrid');
  const pickerMonthLabel = document.getElementById('pickerMonthLabel');
  const demoForm = document.getElementById('demoForm');
  const formError = document.getElementById('formError');
  const bookingConfirm = document.getElementById('bookingConfirm');
  const confirmSummary = document.getElementById('confirmSummary');
  const confirmDetails = document.getElementById('confirmDetails');
  const btnResetBooking = document.getElementById('btnResetBooking');

  let selectedDateLabel = '';
  let selectedTimeLabel = '11:00 AM';

  // Generate next 6 weekdays cleanly from today
  function buildWeekdayDates() {
    if (!dateGrid) return;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);

    const results = [];
    while (results.length < 6) {
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) {
        results.push({
          day: days[dow],
          num: cursor.getDate(),
          month: months[cursor.getMonth()],
          full: `${days[dow]}, ${months[cursor.getMonth()]} ${cursor.getDate()}`,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    if (pickerMonthLabel && results.length) {
      const firstMonth = results[0].month;
      const lastMonth = results[results.length - 1].month;
      pickerMonthLabel.textContent = firstMonth === lastMonth ? `${firstMonth} Weekdays` : `${firstMonth}–${lastMonth}`;
    }

    dateGrid.innerHTML = '';
    results.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `date-btn${idx === 0 ? ' is-selected' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(idx === 0));
      btn.dataset.date = d.full;
      btn.innerHTML = `<span class="d-day">${d.day}</span><span class="d-num">${d.num}</span>`;
      if (idx === 0) selectedDateLabel = d.full;

      btn.addEventListener('click', () => {
        dateGrid.querySelectorAll('.date-btn').forEach((b) => {
          b.classList.remove('is-selected');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-checked', 'true');
        selectedDateLabel = d.full;
      });

      dateGrid.appendChild(btn);
    });
  }

  buildWeekdayDates();

  timeGrid?.querySelectorAll('.slot-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      timeGrid.querySelectorAll('.slot-btn').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedTimeLabel = btn.dataset.time || btn.textContent.trim();
    });
  });

  demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const workEmail = document.getElementById('workEmail').value.trim();
    const studentCountText = studentSelect.options[studentSelect.selectedIndex].text;

    if (!fullName) {
      formError.textContent = 'Please enter your full name.';
      formError.hidden = false;
      return;
    }

    if (!workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
      formError.textContent = 'Please enter a valid work or school email address.';
      formError.hidden = false;
      return;
    }

    formError.hidden = true;
    confirmSummary.textContent = `We sent a calendar invite to ${workEmail} for your 20-minute KiboCode walkthrough.`;
    confirmDetails.innerHTML = `
      <div><strong>Guest:</strong> ${escapeHtml(fullName)}</div>
      <div><strong>Cohort:</strong> ${escapeHtml(studentCountText)}</div>
      <div><strong>Date &amp; Time:</strong> ${escapeHtml(selectedDateLabel)} at ${escapeHtml(selectedTimeLabel)}</div>
    `;

    demoForm.hidden = true;
    bookingConfirm.hidden = false;
  });

  btnResetBooking?.addEventListener('click', () => {
    bookingConfirm.hidden = true;
    demoForm.hidden = false;
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------------------
     8. Staggered Bouncy Clay Scroll-Reveal Across All 8 Blocks
     ------------------------------------------------------------------------ */
  const revealSelectors = [
    '.hero-copy',
    '.playground-shell',
    '.proof-row',
    '#tour .section-head',
    '.tour-tabs',
    '.tour-stage',
    '#how-it-works .section-head',
    '.step-card',
    '#stories .section-head',
    '.case-card',
    '#faq .section-head',
    '.faq-item',
    '#pricing .section-head',
    '.price-card',
    '.demo-info',
    '.booking-card',
  ];

  const revealTargets = Array.from(document.querySelectorAll(revealSelectors.join(',')));

  // Assign staggered clay delays within sibling groups
  document.querySelectorAll('.steps-flow, .cases-grid, .faq-list, .pricing-grid, .hero-grid, .demo-grid').forEach((group) => {
    const items = Array.from(group.children).filter((el) => revealTargets.includes(el));
    items.forEach((el, idx) => {
      el.style.setProperty('--reveal-delay', `${idx * 90}ms`);
    });
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((el) => el.classList.add('clay-reveal'));

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

    revealTargets.forEach((el) => observer.observe(el));
  }
})();
