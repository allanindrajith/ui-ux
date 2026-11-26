(() => {
  const SCREENS_WITH_NAV = new Set(["home", "explore", "profile"]);

  const state = {
    currentScreen: "splash",
    timerSeconds: 38 * 60 + 42,
    timerTotal: 45 * 60,
    timerRunning: true,
    timerInterval: null,
    headTracking: true,
    activeScene: "Kyoto Rain",
    activePlan: "annual",
    customMinutes: 45,
    stems: [
      { id: "rain", name: "Temple Rain", value: 78, color: "#06B6D4" },
      { id: "gamma", name: "40Hz Gamma", value: 52, color: "#6366F1" },
      { id: "wind", name: "Cedar Wind", value: 40, color: "#8B5CF6" },
      { id: "tape", name: "Warm Tape", value: 34, color: "#EC4899" },
    ],
    scenes: [
      { title: "Kyoto Rain", sub: "40Hz Gamma · Rain", tags: ["Deep Work", "Rain", "Binaural"], color: "#06B6D4" },
      { title: "Nordic Cabin", sub: "Deep Work · Fireplace", tags: ["Deep Work"], color: "#EC4899" },
      { title: "Orbital Hum", sub: "14Hz Beta · Space", tags: ["Deep Work", "Binaural"], color: "#6366F1" },
      { title: "Midnight Tide", sub: "4Hz Theta · Sleep", tags: ["Sleep", "Binaural"], color: "#8B5CF6" },
      { title: "Glass Atrium", sub: "Soft Rain · 8Hz Alpha", tags: ["Rain", "Sleep"], color: "#38BDF8" },
      { title: "Monsoon Study", sub: "Heavy Rain · Brown", tags: ["Deep Work", "Rain"], color: "#2DD4BF" },
    ],
    exploreFilter: "All",
    exploreQuery: "",
  };

  const screens = document.querySelectorAll(".screen");
  const railBtns = document.querySelectorAll(".rail-btn");
  const bottomNav = document.getElementById("bottomNav");
  const navItems = bottomNav.querySelectorAll(".nav-item");
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  }

  function navigate(target) {
    state.currentScreen = target;
    screens.forEach((s) => s.classList.toggle("is-active", s.dataset.screen === target));
    railBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.goto === target));
    navItems.forEach((n) => n.classList.toggle("is-active", n.dataset.goto === target));
    bottomNav.classList.toggle("is-hidden", !SCREENS_WITH_NAV.has(target));
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-goto]");
    if (trigger) {
      navigate(trigger.dataset.goto);
    }
  });

  // 02 Auth Interactions
  const authTabs = document.querySelectorAll("[data-auth-tab]");
  const authHeading = document.getElementById("authHeading");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const authFeedback = document.getElementById("authFeedback");

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const isSignIn = tab.dataset.authTab === "signin";
      authHeading.textContent = isSignIn ? "Welcome back" : "Create your Drift ID";
      authSubmitBtn.textContent = isSignIn ? "Sign In to Drift" : "Create Free Account";
    });
  });

  document.getElementById("recoveryBtn").addEventListener("click", () => {
    authFeedback.textContent = "Recovery link sent to allan@drift.audio";
    showToast("Password reset link dispatched");
  });

  document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Signed in · Spatial mixes synced");
    navigate("home");
  });

  // 03 Home Pomodoro Timer
  const timerDisplay = document.getElementById("timerDisplay");
  const timerStatus = document.getElementById("timerStatus");
  const timerRing = document.getElementById("timerRing");
  const timerToggle = document.getElementById("timerToggle");
  const timerReset = document.getElementById("timerReset");
  const activeSceneLabel = document.getElementById("activeSceneLabel");
  const RING_CIRCUMFERENCE = 2 * Math.PI * 80;

  function renderTimer() {
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const progress = state.timerSeconds / state.timerTotal;
    timerRing.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
    timerToggle.textContent = state.timerRunning ? "❚❚" : "▶";
    timerStatus.textContent = state.timerRunning ? "DEEP FOCUS" : "PAUSED";
  }

  function startTimerLoop() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      if (!state.timerRunning) return;
      if (state.timerSeconds > 0) {
        state.timerSeconds -= 1;
        renderTimer();
      } else {
        state.timerRunning = false;
        renderTimer();
        showToast("Focus cycle complete!");
      }
    }, 1000);
  }

  timerToggle.addEventListener("click", () => {
    state.timerRunning = !state.timerRunning;
    renderTimer();
    showToast(state.timerRunning ? "Focus timer resumed" : "Focus timer paused");
  });

  timerReset.addEventListener("click", () => {
    state.timerSeconds = state.timerTotal;
    state.timerRunning = true;
    renderTimer();
    showToast("Timer reset to full cycle");
  });

  document.querySelectorAll("[data-select-scene]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.dataset.selectScene;
      state.activeScene = label.split(" · ")[0];
      activeSceneLabel.textContent = label.toUpperCase();
      document.getElementById("mixerSceneTitle").textContent = state.activeScene;
      showToast(`Switched to ${state.activeScene}`);
    });
  });

  // 04 Explore Search & Filter
  const sceneGrid = document.getElementById("sceneGrid");
  const exploreSearch = document.getElementById("exploreSearch");
  const filterChips = document.querySelectorAll("#filterChips .chip");

  function renderExplore() {
    const q = state.exploreQuery.trim().toLowerCase();
    const filtered = state.scenes.filter((s) => {
      const matchTag = state.exploreFilter === "All" || s.tags.includes(state.exploreFilter);
      const matchQuery = !q || s.title.toLowerCase().includes(q) || s.sub.toLowerCase().includes(q);
      return matchTag && matchQuery;
    });

    if (!filtered.length) {
      sceneGrid.innerHTML = `<div class="glass-card" style="grid-column:1/-1;padding:18px;text-align:center;color:#94A3B8;font-size:13px;">No soundscapes match "${state.exploreQuery}"</div>`;
      return;
    }

    sceneGrid.innerHTML = filtered
      .map(
        (s) => `
      <button class="glass-card scene-card" data-open-scene="${s.title}">
        <div class="scene-thumb" style="background:${s.color}28;color:${s.color}"></div>
        <h4>${s.title}</h4>
        <p>${s.sub}</p>
      </button>`
      )
      .join("");
  }

  sceneGrid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-open-scene]");
    if (!card) return;
    state.activeScene = card.dataset.openScene;
    activeSceneLabel.textContent = `${state.activeScene.toUpperCase()} · 40HZ GAMMA`;
    document.getElementById("mixerSceneTitle").textContent = state.activeScene;
    navigate("detail");
    showToast(`Loaded ${state.activeScene} stems`);
  });

  exploreSearch.addEventListener("input", (e) => {
    state.exploreQuery = e.target.value;
    renderExplore();
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.exploreFilter = chip.dataset.filter;
      renderExplore();
    });
  });

  // 05 Spatial Mixer Sliders + Sync with Home Mini Stems
  const mixerSliders = document.getElementById("mixerSliders");
  const homeMiniStems = document.getElementById("homeMiniStems");
  const mixTotalLabel = document.getElementById("mixTotalLabel");
  const headTrackBadge = document.getElementById("headTrackBadge");

  function renderStems() {
    homeMiniStems.innerHTML = state.stems
      .slice(0, 3)
      .map(
        (s) => `
      <div class="mini-stem-row">
        <div class="mini-stem-meta"><span>${s.name}</span><span>${s.value}%</span></div>
        <div class="mini-bar"><div class="mini-bar-fill" style="width:${s.value}%;background:${s.color}"></div></div>
      </div>`
      )
      .join("");

    mixerSliders.innerHTML = state.stems
      .map(
        (s) => `
      <div class="slider-row">
        <div class="slider-head"><strong>${s.name}</strong><span id="val-${s.id}">${s.value}%</span></div>
        <input class="stem-range" type="range" min="0" max="100" value="${s.value}" data-stem-id="${s.id}" />
      </div>`
      )
      .join("");

    const activeCount = state.stems.filter((s) => s.value > 0).length;
    mixTotalLabel.textContent = `${activeCount} active stem${activeCount === 1 ? "" : "s"}`;
  }

  mixerSliders.addEventListener("input", (e) => {
    const input = e.target.closest(".stem-range");
    if (!input) return;
    const stem = state.stems.find((s) => s.id === input.dataset.stemId);
    if (!stem) return;
    stem.value = Number(input.value);
    const valEl = document.getElementById(`val-${stem.id}`);
    if (valEl) valEl.textContent = `${stem.value}%`;
    const activeCount = state.stems.filter((s) => s.value > 0).length;
    mixTotalLabel.textContent = `${activeCount} active stem${activeCount === 1 ? "" : "s"}`;
    // Update home mini bars live
    homeMiniStems.innerHTML = state.stems
      .slice(0, 3)
      .map(
        (s) => `
      <div class="mini-stem-row">
        <div class="mini-stem-meta"><span>${s.name}</span><span>${s.value}%</span></div>
        <div class="mini-bar"><div class="mini-bar-fill" style="width:${s.value}%;background:${s.color}"></div></div>
      </div>`
      )
      .join("");
  });

  headTrackBadge.addEventListener("click", () => {
    state.headTracking = !state.headTracking;
    headTrackBadge.textContent = state.headTracking ? "3D Track ON" : "Stereo Mode";
    showToast(state.headTracking ? "3D Head-Tracking enabled" : "Switched to Stereo Mode");
  });

  document.getElementById("saveMixBtn").addEventListener("click", () => {
    showToast(`Saved "${state.activeScene}" to Profile`);
  });

  // 06 Checkout & Custom Session
  const checkoutModeBtns = document.querySelectorAll("[data-checkout-mode]");
  const proPanel = document.getElementById("proPanel");
  const sessionPanel = document.getElementById("sessionPanel");
  const checkoutStepBadge = document.getElementById("checkoutStepBadge");
  const planCards = document.querySelectorAll("[data-plan]");
  const proPrice = document.getElementById("proPrice");
  const proSub = document.getElementById("proSub");
  const unlockProBtn = document.getElementById("unlockProBtn");

  checkoutModeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      checkoutModeBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const isPro = btn.dataset.checkoutMode === "pro";
      proPanel.classList.toggle("is-hidden", !isPro);
      sessionPanel.classList.toggle("is-hidden", isPro);
      checkoutStepBadge.textContent = isPro ? "Step 1 of 2" : "Custom Ritual";
    });
  });

  planCards.forEach((card) => {
    card.addEventListener("click", () => {
      planCards.forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      state.activePlan = card.dataset.plan;
      const annual = state.activePlan === "annual";
      proPrice.textContent = annual ? "$7.99" : "$11.99";
      proSub.textContent = annual ? "Billed annually ($95.88) · Save 33%" : "Billed monthly · Cancel anytime";
      unlockProBtn.textContent = annual ? "Unlock Spatial Pro — $7.99/mo" : "Unlock Spatial Pro — $11.99/mo";
    });
  });

  unlockProBtn.addEventListener("click", () => {
    showToast("Drift Spatial Pro unlocked!");
    navigate("states");
    filterStates("confirm");
  });

  const durationBtns = document.querySelectorAll("#durationPills .chip");
  durationBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      durationBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.customMinutes = Number(btn.dataset.mins);
    });
  });

  document.getElementById("launchSessionBtn").addEventListener("click", () => {
    const goal = document.getElementById("sessionGoalInput").value.trim() || "Custom Focus";
    const freq = document.getElementById("freqSelect").value;
    state.timerTotal = state.customMinutes * 60;
    state.timerSeconds = state.timerTotal;
    state.timerRunning = true;
    activeSceneLabel.textContent = `${goal.toUpperCase()} · ${freq.toUpperCase()}`;
    renderTimer();
    navigate("home");
    showToast(`Started ${state.customMinutes}m ${freq} session`);
  });

  // 07 Profile Settings Toggles
  document.querySelectorAll(".switch").forEach((sw) => {
    sw.addEventListener("click", () => {
      const on = sw.classList.toggle("is-on");
      sw.setAttribute("aria-pressed", String(on));
      const label = sw.dataset.toggle === "spatial" ? "3D Head-Tracking" : sw.dataset.toggle === "dnd" ? "Do Not Disturb Sync" : "40Hz Auto-Fade";
      showToast(`${label} ${on ? "enabled" : "disabled"}`);
    });
  });

  // 08 States Switcher
  const stateFilterBtns = document.querySelectorAll("#stateFilter .chip");
  const stateCards = document.querySelectorAll("[data-state-card]");

  function filterStates(tab) {
    stateFilterBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.stateTab === tab));
    stateCards.forEach((c) => {
      c.classList.toggle("is-hidden", tab !== "all" && c.dataset.stateCard !== tab);
    });
  }

  stateFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => filterStates(btn.dataset.stateTab));
  });

  document.getElementById("reconnectBtn").addEventListener("click", () => {
    state.headTracking = true;
    headTrackBadge.textContent = "3D Track ON";
    showToast("AirPods spatial sensors reconnected");
  });

  // Initial Render
  renderTimer();
  renderExplore();
  renderStems();
  startTimerLoop();
})();
