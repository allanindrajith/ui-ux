(() => {
  "use strict";

  const BEANS = [
    {
      id: "guji",
      name: "Ethiopia Guji",
      title: "Guji Uraga Washed",
      region: "ETHIOPIA · GUJI ZONE",
      process: "Washed",
      tags: ["Washed", "Floral"],
      badge: "NEW LOT",
      elevation: "2,150 MASL",
      roastDate: "Oct 24",
      score: "CUP SCORE 91.5",
      notes: ["Jasmine Blossom", "White Peach", "Wild Honey"],
      price: 22,
      tone: "orb-amber",
      story:
        "Grown under highland canopy in Uraga at 2,150 MASL, washed in mountain spring water and dried 16 days on raised African beds for crystalline jasmine aromatics.",
    },
    {
      id: "huila",
      name: "Colombia Huila",
      title: "Huila Pink Bourbon",
      region: "COLOMBIA · SAN AGUSTÍN",
      process: "Natural",
      tags: ["Natural", "Espresso"],
      badge: "LIMITED",
      elevation: "1,850 MASL",
      roastDate: "Oct 22",
      score: "CUP SCORE 90.8",
      notes: ["Wild Berry", "Dark Cocoa", "Ripe Fig"],
      price: 24,
      tone: "orb-berry",
      story:
        "Whole-cherry slow dried for 22 days in volcanic Huila highlands, yielding syrupy cacao richness balanced by bright wild berry acidity.",
    },
    {
      id: "nyeri",
      name: "Kenya Nyeri",
      title: "Nyeri Othaya AA",
      region: "KENYA · MOUNT KENYA",
      process: "Washed",
      tags: ["Washed", "Floral"],
      badge: "FILTER",
      elevation: "1,920 MASL",
      roastDate: "Oct 25",
      score: "CUP SCORE 92.0",
      notes: ["Blood Orange", "Bergamot", "Cane Sugar"],
      price: 25,
      tone: "orb-citrus",
      story:
        "Double-fermented SL28 & SL34 lots from red volcanic soils of Nyeri, delivering sparkling citrus clarity and a velvety caramel finish.",
    },
    {
      id: "antigua",
      name: "Guatemala Antigua",
      title: "Antigua Volcán Espresso",
      region: "GUATEMALA · SACATEPÉQUEZ",
      process: "Natural",
      tags: ["Natural", "Espresso"],
      badge: "ESPRESSO",
      elevation: "1,650 MASL",
      roastDate: "Oct 23",
      score: "CUP SCORE 89.6",
      notes: ["Toasted Hazelnut", "Brown Butter", "Cherry"],
      price: 21,
      tone: "orb-espresso",
      story:
        "Developed specifically for velvety crema extraction with lingering brown-butter sweetness and dark cherry depth.",
    },
  ];

  const DOCK_SCREENS = new Set(["home", "explore", "profile"]);
  const TOTAL_BREW_SECONDS = 165; // 02:45
  const RING_CIRCUMFERENCE = 2 * Math.PI * 98;

  const state = {
    screen: "splash",
    selectedBeanId: "guji",
    filter: "All",
    search: "",
    unit: "g",
    grind: "Whole Bean",
    cadence: "Every 2 Weeks",
    discount: 0.12,
    favedBeans: new Set(["guji"]),
    timerSeconds: 102, // starts at 01:42 to match design
    timerRunning: false,
    timerId: null,
    isSignUp: false,
    grindCycleIndex: 1,
  };

  const GRIND_PRESETS = ["Whole Bean", "V60 Medium-Fine", "Espresso Fine", "Aeropress Medium"];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function formatWeight(grams) {
    if (state.unit === "oz") {
      return `${(grams * 0.035274).toFixed(1)}oz`;
    }
    return `${grams}g`;
  }

  function getSelectedBean() {
    return BEANS.find((b) => b.id === state.selectedBeanId) || BEANS[0];
  }

  function goToScreen(target) {
    state.screen = target;
    $$(".screen").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.screen === target);
    });
    $$(".rail-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.goto === target);
    });
    const dock = $("#bottomDock");
    if (dock) {
      dock.classList.toggle("is-hidden", !DOCK_SCREENS.has(target));
    }
    $$(".dock-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.dock === target);
    });
  }

  // ---- POUR-OVER BLOOM TIMER (Screen 03) ----
  function renderTimer() {
    const sec = state.timerSeconds;
    const progress = Math.min(sec / TOTAL_BREW_SECONDS, 1);
    const offset = RING_CIRCUMFERENCE * (1 - progress);
    const ring = $("#dialProgress");
    if (ring) ring.style.strokeDashoffset = String(offset.toFixed(1));

    const display = $("#timerDisplay");
    if (display) display.textContent = formatTime(sec);

    let activeStep = 0;
    let phaseLabel = `BLOOM · ${formatWeight(45)}`;
    if (sec >= 105) {
      activeStep = 2;
      phaseLabel = `DRAWDOWN · ${formatWeight(250)}`;
    } else if (sec >= 45) {
      activeStep = 1;
      phaseLabel = `SPIRAL POUR · ${formatWeight(180)}`;
    }
    if (sec >= TOTAL_BREW_SECONDS) {
      phaseLabel = `BREW COMPLETE · ${formatWeight(250)}`;
    }

    const phaseEl = $("#timerPhase");
    if (phaseEl) phaseEl.textContent = phaseLabel;

    $$("#pourStepList .step-item").forEach((item, idx) => {
      const badge = item.querySelector(".step-badge");
      const weightEl = item.querySelector(".step-weight");
      if (weightEl) {
        weightEl.textContent = formatWeight(Number(weightEl.dataset.grams));
      }
      item.classList.remove("is-done", "is-active");
      if (idx < activeStep || sec >= TOTAL_BREW_SECONDS) {
        item.classList.add("is-done");
        if (badge) badge.textContent = "✓";
      } else if (idx === activeStep) {
        item.classList.add("is-active");
        if (badge) badge.textContent = `0${idx + 1}`;
      } else if (badge) {
        badge.textContent = `0${idx + 1}`;
      }
    });

    const ratioPill = $("#brewRatioPill");
    if (ratioPill) {
      ratioPill.textContent = `${formatWeight(15)} : ${formatWeight(250)}`;
    }

    const toggleBtn = $("#timerToggleBtn");
    if (toggleBtn) {
      toggleBtn.textContent = state.timerRunning
        ? "Pause Brew"
        : sec >= TOTAL_BREW_SECONDS
          ? "Brew Again"
          : sec === 0
            ? "Start Bloom"
            : "Resume Brew";
    }
  }

  function stopTimer() {
    state.timerRunning = false;
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    renderTimer();
  }

  function toggleTimer() {
    if (state.timerRunning) {
      stopTimer();
      return;
    }
    if (state.timerSeconds >= TOTAL_BREW_SECONDS) {
      state.timerSeconds = 0;
    }
    state.timerRunning = true;
    state.timerId = setInterval(() => {
      state.timerSeconds += 1;
      if (state.timerSeconds >= TOTAL_BREW_SECONDS) {
        stopTimer();
      } else {
        renderTimer();
      }
    }, 1000);
    renderTimer();
  }

  // ---- EXPLORE BEANS (Screen 04) ----
  function renderBeans() {
    const list = $("#beanList");
    if (!list) return;
    const q = state.search.trim().toLowerCase();
    const matches = BEANS.filter((b) => {
      const filterOk = state.filter === "All" || b.tags.includes(state.filter);
      const queryOk =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.process.toLowerCase().includes(q) ||
        b.notes.some((n) => n.toLowerCase().includes(q));
      return filterOk && queryOk;
    });

    if (matches.length === 0) {
      list.innerHTML = `
        <div class="tactile-card state-card">
          <span class="state-tag tag-muted">NO MATCHING LOTS</span>
          <h3 class="serif-title state-title">No beans found</h3>
          <p>Try clearing your filter or searching for floral, washed, or espresso notes.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = matches
      .map(
        (b) => `
      <button class="tactile-card bean-card" data-open-bean="${b.id}" type="button">
        <div class="coffee-orb bean-orb ${b.tone}" aria-hidden="true"></div>
        <div class="bean-meta">
          <div class="bean-top">
            <span class="bean-tag">${b.badge}</span>
            <span class="bean-price">$${b.price}</span>
          </div>
          <h3>${b.name}</h3>
          <p class="bean-sub">${b.process} · ${b.elevation}</p>
          <p class="bean-notes">${b.notes.join(" · ")}</p>
        </div>
      </button>
    `
      )
      .join("");
  }

  // ---- DETAIL VIEW (Screen 05) ----
  function renderDetail() {
    const b = getSelectedBean();
    const orb = $("#detailOrb");
    if (orb) orb.className = `coffee-orb orb-md ${b.tone} is-breathing`;
    $("#detailScore").textContent = b.score;
    $("#detailRegion").textContent = b.region;
    $("#detailTitle").textContent = b.title;
    $("#detailElevation").textContent = b.elevation;
    $("#detailRoast").textContent = b.roastDate;
    $("#detailProcess").textContent = b.process;
    $("#detailStory").textContent = b.story;
    $("#detailPrice").textContent = `$${b.price.toFixed(2)}`;
    $("#detailNotes").innerHTML = b.notes.map((n) => `<span class="note-pill">${n}</span>`).join("");
    $("#favToggleBtn").classList.toggle("is-faved", state.favedBeans.has(b.id));
  }

  // ---- CHECKOUT (Screen 06) ----
  function renderCheckout() {
    const b = getSelectedBean();
    const orb = $("#checkoutOrb");
    if (orb) orb.className = `coffee-orb orb-mini ${b.tone}`;
    $("#checkoutBeanName").textContent = `${b.name} · 250g`;
    $("#checkoutBeanMeta").textContent = `${b.process} · Roasted ${b.roastDate}`;
    $("#checkoutBasePrice").textContent = `$${b.price.toFixed(2)}`;
    const finalPrice = b.price * (1 - state.discount);
    $("#checkoutTotalPrice").textContent = `$${finalPrice.toFixed(2)}`;
    const pct = Math.round(state.discount * 100);
    $("#checkoutSavingsLabel").textContent =
      pct > 0 ? `Total (${pct}% Member Savings)` : "Total (One-Time Order)";
  }

  // ---- WIRE EVENTS ----
  document.addEventListener("click", (e) => {
    const gotoEl = e.target.closest("[data-goto]");
    if (gotoEl) {
      goToScreen(gotoEl.dataset.goto);
      return;
    }

    const openBean = e.target.closest("[data-open-bean]");
    if (openBean) {
      state.selectedBeanId = openBean.dataset.openBean;
      renderDetail();
      renderCheckout();
      goToScreen("detail");
      return;
    }

    const stepBtn = e.target.closest("#pourStepList .step-item");
    if (stepBtn) {
      const stepIdx = Number(stepBtn.dataset.step);
      state.timerSeconds = stepIdx === 0 ? 15 : stepIdx === 1 ? 65 : 120;
      renderTimer();
      return;
    }

    const recipeBtn = e.target.closest("[data-load-recipe]");
    if (recipeBtn) {
      const id = recipeBtn.dataset.loadRecipe;
      state.selectedBeanId = id;
      $("#brewBeanTitle").textContent = id === "huila" ? "Colombia Huila" : "Ethiopia Guji";
      state.timerSeconds = 0;
      stopTimer();
      goToScreen("home");
    }
  });

  $("#timerToggleBtn").addEventListener("click", toggleTimer);
  $("#timerResetBtn").addEventListener("click", () => {
    state.timerSeconds = 0;
    stopTimer();
  });

  $("#beanSearchInput").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderBeans();
  });

  $("#filterChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.filter = chip.dataset.filter;
    $$("#filterChips .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    renderBeans();
  });

  $("#favToggleBtn").addEventListener("click", () => {
    const id = state.selectedBeanId;
    if (state.favedBeans.has(id)) state.favedBeans.delete(id);
    else state.favedBeans.add(id);
    renderDetail();
  });

  $("#addToBoxBtn").addEventListener("click", () => {
    renderCheckout();
    goToScreen("checkout");
  });

  $("#grindOptions").addEventListener("click", (e) => {
    const card = e.target.closest(".opt-card");
    if (!card) return;
    state.grind = card.dataset.grind;
    $$("#grindOptions .opt-card").forEach((c) => c.classList.toggle("is-selected", c === card));
    $$("#checkoutStepPills .step-pill").forEach((p) => p.classList.toggle("is-active", p.dataset.cstep === "1"));
  });

  $("#cadenceOptions").addEventListener("click", (e) => {
    const card = e.target.closest(".opt-card");
    if (!card) return;
    state.cadence = card.dataset.cadence;
    state.discount = Number(card.dataset.discount);
    $$("#cadenceOptions .opt-card").forEach((c) => c.classList.toggle("is-selected", c === card));
    $$("#checkoutStepPills .step-pill").forEach((p) => p.classList.toggle("is-active", p.dataset.cstep === "2"));
    renderCheckout();
  });

  $("#confirmOrderBtn").addEventListener("click", () => {
    const b = getSelectedBean();
    $("#confirmOrderCopy").textContent = `${b.name} (${state.grind} · ${state.cadence}) ships tomorrow from our SF roastery. Tracking sent to allan@crema.coffee.`;
    setStateView("confirm");
    goToScreen("states");
  });

  // Auth form
  $("#authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    goToScreen("home");
  });

  $("#resetPassBtn").addEventListener("click", () => {
    $("#authFeedback").textContent = "Password reset link sent to allan@crema.coffee";
  });

  $("#authModeToggle").addEventListener("click", () => {
    state.isSignUp = !state.isSignUp;
    $("#authHeading").innerHTML = state.isSignUp ? "Join the<br />Morning Ritual." : "Welcome back,<br />Brewer.";
    $("#authSubmitBtn").textContent = state.isSignUp ? "Create Account" : "Sign In";
    $("#authModeToggle").innerHTML = state.isSignUp
      ? "Already a member? <span>Sign in</span>"
      : "New to Crema? <span>Create account</span>";
  });

  // Profile toggles
  $$(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.unit = btn.dataset.unit;
      $$(".seg-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderTimer();
    });
  });

  $("#chimeToggle").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const next = !btn.classList.contains("is-on");
    btn.classList.toggle("is-on", next);
    btn.setAttribute("aria-checked", String(next));
  });

  $("#cycleGrindBtn").addEventListener("click", () => {
    state.grindCycleIndex = (state.grindCycleIndex + 1) % GRIND_PRESETS.length;
    $("#profileGrindLabel").textContent = GRIND_PRESETS[state.grindCycleIndex];
  });

  // States screen switcher & reconnect interaction
  function setStateView(view) {
    $$("#stateFilterTabs .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.stateView === view));
    $$("[data-state-card]").forEach((card) => {
      card.style.display = view === "all" || card.dataset.stateCard === view ? "block" : "none";
    });
  }

  $("#stateFilterTabs").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    setStateView(chip.dataset.stateView);
  });

  $("#reconnectScaleBtn").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    btn.textContent = "Connecting…";
    setTimeout(() => {
      btn.textContent = "Scale Connected ✓";
      $("#scaleErrorCopy").textContent = "Acaia Pearl paired over Bluetooth (0.0g tared). Ready for your next pour.";
    }, 650);
  });

  // Initial render
  renderBeans();
  renderDetail();
  renderCheckout();
  renderTimer();
  goToScreen("splash");
})();
