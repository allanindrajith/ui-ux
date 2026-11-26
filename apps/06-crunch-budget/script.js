(() => {
  const state = {
    currentScreen: "01",
    balance: 4820.5,
    hustleIn: 1420.0,
    spentOut: 612.4,
    samPinged: false,
    samSettled: false,
    activeFilter: "ALL",
    searchQuery: "",
    entryType: "expense",
    entryCat: "GEAR",
    keypadBuffer: "42.50",
    categories: [
      { key: "FOOD", name: "FOOD & MATCHA", spent: 245, limit: 300, fillClass: "fill--coral" },
      { key: "GEAR", name: "CREATOR GEAR", spent: 180, limit: 400, fillClass: "fill--sky" },
      { key: "HUSTLE", name: "SIDE-HUSTLE OPS", spent: 112, limit: 250, fillClass: "fill--mint" },
    ],
    transactions: [
      { id: 1, title: "Gumroad UI Kit Drop", cat: "HUSTLE", date: "Today • 2:14 PM", amount: 420.0 },
      { id: 2, title: "Ramen Night Split", cat: "FOOD", date: "Yesterday • 9:05 PM", amount: -128.0 },
      { id: 3, title: "Teenage Eng. Cable", cat: "GEAR", date: "Mar 13 • 4:40 PM", amount: -49.0 },
      { id: 4, title: "Depop Vintage Tee", cat: "HUSTLE", date: "Mar 12 • 1:18 PM", amount: 85.0 },
      { id: 5, title: "Oat Matcha x2", cat: "FOOD", date: "Mar 11 • 10:02 AM", amount: -14.5 },
    ],
  };

  const screens = document.querySelectorAll(".screen");
  const railBtns = document.querySelectorAll(".rail-btn");
  const toastEl = document.getElementById("brutalToast");
  let toastTimer = null;

  function fmtMoney(num, signed = false) {
    const abs = Math.abs(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (!signed) return `$${abs}`;
    return `${num >= 0 ? "+" : "-"}$${abs}`;
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  }

  function goToScreen(id) {
    state.currentScreen = id;
    screens.forEach((s) => s.classList.toggle("is-active", s.dataset.screen === id));
    railBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.goto === id));
  }

  // Global navigation delegation
  document.addEventListener("click", (e) => {
    const navTarget = e.target.closest("[data-goto]");
    if (navTarget) {
      goToScreen(navTarget.dataset.goto);
    }
  });

  // =========================================================
  // SCREEN 02: LOGIN / SIGN-UP
  // =========================================================
  const authForm = document.getElementById("authForm");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-auth-mode]").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      authSubmitBtn.textContent =
        tab.dataset.authMode === "signup" ? "CREATE CRUNCH VAULT →" : "UNLOCK VAULT →";
    });
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("⚡ VAULT UNLOCKED • WELCOME BACK ZOE");
    goToScreen("03");
  });

  document.querySelectorAll("[data-social]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast(`⚡ SIGNED IN WITH ${btn.dataset.social.toUpperCase()}`);
      goToScreen("03");
    });
  });

  document.getElementById("recoverBtn").addEventListener("click", () => {
    showToast("🔑 MAGIC RECOVERY LINK SENT TO ZOE@CRUNCH.MONEY");
  });
  document.getElementById("recoveryBox").addEventListener("click", () => {
    showToast("🔑 RECOVERY CODE DISPATCHED");
  });

  // =========================================================
  // SCREEN 03: HOME / FEED RENDER
  // =========================================================
  function renderHome() {
    document.getElementById("homeBalance").textContent = fmtMoney(state.balance);
    document.getElementById("homeHustleStat").textContent = `HUSTLE +$${Math.round(state.hustleIn).toLocaleString()}`;
    document.getElementById("homeSpentStat").textContent = `SPENT -$${state.spentOut.toFixed(2)}`;

    const barsWrap = document.getElementById("homeCategoryBars");
    barsWrap.innerHTML = "";
    state.categories.forEach((cat) => {
      const pct = Math.min(100, Math.round((cat.spent / cat.limit) * 100));
      const row = document.createElement("div");
      row.className = "stack-gap-4";
      row.innerHTML = `
        <div class="row-between fs-12 fw-700">
          <span>${cat.name}</span>
          <span>$${cat.spent.toFixed(0)} / $${cat.limit}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${cat.fillClass}" style="width: ${pct}%"></div>
        </div>
      `;
      barsWrap.appendChild(row);
    });
  }

  // =========================================================
  // SCREEN 04: SEARCH / EXPLORE RENDER
  // =========================================================
  function renderLedger() {
    const q = state.searchQuery.trim().toLowerCase();
    const filtered = state.transactions.filter((tx) => {
      const catOk = state.activeFilter === "ALL" || tx.cat === state.activeFilter;
      const qOk = !q || tx.title.toLowerCase().includes(q) || tx.cat.toLowerCase().includes(q);
      return catOk && qOk;
    });

    const net = filtered.reduce((acc, t) => acc + t.amount, 0);
    document.getElementById("searchCountPill").textContent = `${filtered.length} ITEMS`;
    document.getElementById("filteredNet").textContent = fmtMoney(net, true);

    const list = document.getElementById("txFeedList");
    list.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "brutal-card card--sky stack-gap-6";
      empty.innerHTML = `
        <div class="syne-bold fs-15">NO MATCHES FOUND</div>
        <div class="fs-12">Try another keyword or clear your category filter.</div>
      `;
      list.appendChild(empty);
      return;
    }

    const catColor = { HUSTLE: "pill--mint", FOOD: "pill--coral", GEAR: "pill--sky", RIDE: "pill--lilac" };
    filtered.forEach((tx) => {
      const card = document.createElement("div");
      card.className = "brutal-card card--white row-between";
      card.innerHTML = `
        <div>
          <div class="fw-700 fs-14">${tx.title}</div>
          <div class="fs-11 muted">${tx.cat} • ${tx.date}</div>
        </div>
        <span class="sticker-pill ${catColor[tx.cat] || "pill--yellow"}">${fmtMoney(tx.amount, true)}</span>
      `;
      list.appendChild(card);
    });
  }

  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderLedger();
  });

  document.querySelectorAll("#filterPills .filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filterPills .filter-pill").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.activeFilter = btn.dataset.cat;
      renderLedger();
    });
  });

  // =========================================================
  // SCREEN 05: BILL SPLIT DETAIL — PING SAM
  // =========================================================
  const pingSamInlineBtn = document.getElementById("pingSamInlineBtn");
  const pingSamMainBtn = document.getElementById("pingSamMainBtn");

  function handlePingSam() {
    if (!state.samPinged) {
      state.samPinged = true;
      pingSamInlineBtn.textContent = "MARK PAID";
      pingSamInlineBtn.classList.remove("btn--yellow");
      pingSamInlineBtn.classList.add("btn--sky");
      document.getElementById("samSub").textContent = "$42.66 • Pinged just now ⚡";
      pingSamMainBtn.textContent = "PINGED! TAP TO MARK SETTLED ✓";
      document.getElementById("homeSplitStatus").textContent = "Sam pinged — awaiting $42.66";
      showToast("⚡ NUDGE SENT TO SAM RIVERA ($42.66)");
    } else if (!state.samSettled) {
      state.samSettled = true;
      state.balance += 42.66;
      renderHome();
      pingSamInlineBtn.textContent = "✓ PAID";
      pingSamInlineBtn.classList.remove("btn--sky");
      pingSamInlineBtn.classList.add("btn--mint");
      document.getElementById("samSub").textContent = "$42.66 • Settled via Venmo";
      document.getElementById("splitCountLabel").textContent = "3 OF 3 SETTLED";
      document.getElementById("splitAmtLabel").textContent = "$128.00 / $128.00";
      document.getElementById("splitProgressFill").style.width = "100%";
      pingSamMainBtn.textContent = "ALL SQUAD SETTLED ✓";
      pingSamMainBtn.classList.remove("btn--yellow");
      pingSamMainBtn.classList.add("btn--mint");
      document.getElementById("homeSplitStatus").textContent = "3/3 settled! Bag +$42.66";
      showToast("🎉 RAMEN NIGHT 100% SETTLED (+$42.66)");
    } else {
      showToast("✓ ALREADY 100% SETTLED");
    }
  }

  pingSamInlineBtn.addEventListener("click", handlePingSam);
  pingSamMainBtn.addEventListener("click", handlePingSam);

  // =========================================================
  // SCREEN 06: +ADD EXPENSE / SIDE-HUSTLE FORM
  // =========================================================
  const amountReadout = document.getElementById("amountReadout");
  const entryNoteInput = document.getElementById("entryNoteInput");

  function updateAmountDisplay() {
    const val = state.keypadBuffer || "0";
    amountReadout.textContent = `$${val}`;
  }

  document.querySelectorAll("#entryTypeToggle [data-entry-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#entryTypeToggle [data-entry-type]").forEach((b) => {
        b.classList.remove("is-active", "seg-tab--coral", "seg-tab--mint");
      });
      state.entryType = btn.dataset.entryType;
      btn.classList.add("is-active", state.entryType === "expense" ? "seg-tab--coral" : "seg-tab--mint");
      if (state.entryType === "hustle") {
        state.entryCat = "HUSTLE";
        syncCatStickers();
        if (entryNoteInput.value === "Vintage Camera Strap") {
          entryNoteInput.value = "Figma Template Drop";
        }
      }
    });
  });

  function syncCatStickers() {
    document.querySelectorAll("#categoryStickers .cat-sticker").forEach((st) => {
      st.classList.toggle("is-active", st.dataset.pickCat === state.entryCat);
    });
  }

  document.querySelectorAll("#categoryStickers .cat-sticker").forEach((st) => {
    st.addEventListener("click", () => {
      state.entryCat = st.dataset.pickCat;
      syncCatStickers();
    });
  });

  document.querySelectorAll("#keypad .key-btn").forEach((key) => {
    key.addEventListener("click", () => {
      const k = key.dataset.key;
      if (k === "back") {
        state.keypadBuffer = state.keypadBuffer.slice(0, -1) || "0";
      } else if (k === ".") {
        if (!state.keypadBuffer.includes(".")) state.keypadBuffer += ".";
      } else {
        if (state.keypadBuffer === "0") {
          state.keypadBuffer = k;
        } else {
          const parts = state.keypadBuffer.split(".");
          if (parts[1] && parts[1].length >= 2) return;
          if (state.keypadBuffer.length >= 7) return;
          state.keypadBuffer += k;
        }
      }
      updateAmountDisplay();
    });
  });

  document.getElementById("saveEntryBtn").addEventListener("click", () => {
    const numeric = parseFloat(state.keypadBuffer);
    if (!numeric || numeric <= 0) {
      showToast("⚠️ ENTER AN AMOUNT ABOVE $0");
      return;
    }

    const signedAmt = state.entryType === "expense" ? -numeric : numeric;
    const note = entryNoteInput.value.trim() || `${state.entryCat} Entry`;

    state.balance += signedAmt;
    if (signedAmt > 0) {
      state.hustleIn += numeric;
    } else {
      state.spentOut += numeric;
      const targetCat = state.categories.find((c) => c.key === state.entryCat);
      if (targetCat) targetCat.spent += numeric;
    }

    state.transactions.unshift({
      id: Date.now(),
      title: note,
      cat: state.entryCat,
      date: "Just now",
      amount: signedAmt,
    });

    renderHome();
    renderLedger();

    // Update Screen 08 Confirmation card & focus it
    document.getElementById("confirmTitle").textContent =
      signedAmt > 0 ? "HUSTLE BAG LOGGED!" : "EXPENSE CRUSHED!";
    document.getElementById("confirmCopy").textContent =
      `${fmtMoney(signedAmt, true)} logged to ${state.entryCat} (${note}). Liquid balance updated to ${fmtMoney(state.balance)}.`;

    setStateView("confirm");
    goToScreen("08");
    showToast(`✓ SAVED ${fmtMoney(signedAmt, true)} TO ${state.entryCat}`);
  });

  // =========================================================
  // SCREEN 07: PROFILE TOGGLES
  // =========================================================
  document.querySelectorAll(".toggle-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = !btn.classList.contains("is-on");
      btn.classList.toggle("is-on", next);
      btn.setAttribute("aria-pressed", String(next));
      btn.textContent = next ? "ON" : "OFF";
      showToast(`${btn.dataset.toggle.toUpperCase()} → ${next ? "ENABLED" : "DISABLED"}`);
    });
  });

  // =========================================================
  // SCREEN 08: STATE SWITCHER & RETRY
  // =========================================================
  function setStateView(view) {
    document.querySelectorAll("#stateSwitcher .filter-pill").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.stateView === view);
    });
    document.querySelectorAll("[data-state-card]").forEach((card) => {
      const match = view === "all" || card.dataset.stateCard === view;
      card.classList.toggle("is-hidden", !match);
    });
  }

  document.querySelectorAll("#stateSwitcher .filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => setStateView(btn.dataset.stateView));
  });

  document.getElementById("retrySyncBtn").addEventListener("click", () => {
    showToast("⚡ BANK RE-SYNCED • ALL 14 TRANSACTIONS UP TO DATE");
    setStateView("confirm");
  });

  // Initial render
  renderHome();
  renderLedger();
  updateAmountDisplay();
})();
