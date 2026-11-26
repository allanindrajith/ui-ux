// PawPal — Interactive 8-Screen Claymorphism Mobile Prototype

const ONBOARDING_SLIDES = [
  {
    title: "Happy Paws,<br/>Effortless Care",
    desc: "Track Milo's daily walks, meals, vet visits & favorite dog parks in one cozy companion app.",
    cta: "Next Perk →",
  },
  {
    title: "Never Miss a<br/>Kibble or Chew",
    desc: "Gentle clay reminders keep breakfast, monthly heartworm chews, and water bowls right on time.",
    cta: "One More →",
  },
  {
    title: "Ready for<br/>Sunlit Strolls?",
    desc: "Enable GPS & notifications so PawPal can log Milo's routes and alert you about nearby parks.",
    cta: "Allow Location & Continue",
  },
];

const PLACES = [
  {
    id: "vondelpark",
    name: "Vondelpark Dog Run",
    cat: "park",
    catLabel: "Park · Off-leash meadow",
    sub: "Vondelpark West · 8 min walk",
    dist: "0.6 km",
    rate: "4.9",
    reviews: 328,
    bg: "bg-mint",
    icon: "🌳",
    tag: "Open Now",
    metrics: [
      { k: "DISTANCE", v: "0.6 km", bg: "bg-white" },
      { k: "OFF-LEASH", v: "Allowed", bg: "bg-sky" },
      { k: "WATER", v: "3 Bowls", bg: "bg-yellow" },
    ],
    amenities: [
      { label: "Fenced Meadow", bg: "bg-mint" },
      { label: "Small Dog Zone", bg: "bg-lavender" },
      { label: "Shaded Trees", bg: "bg-sky" },
      { label: "Waste Stations", bg: "bg-yellow" },
    ],
    desc: "Spacious grassy off-leash area loved by local corgis and retrievers. Fresh drinking stations near the south gate and soft wood-chip trails.",
    note: "Milo visited 4 times this month · Favorite!",
  },
  {
    id: "paws-vet",
    name: "Paws & Care Vet Clinic",
    cat: "vet",
    catLabel: "Vet · Fear-free certified",
    sub: "Overtoom 142 · Open until 20:00",
    dist: "1.1 km",
    rate: "4.8",
    reviews: 214,
    bg: "bg-sky",
    icon: "🩺",
    tag: "Bookable",
    metrics: [
      { k: "DISTANCE", v: "1.1 km", bg: "bg-white" },
      { k: "NEXT SLOT", v: "Fri 11:00", bg: "bg-mint" },
      { k: "CHECKUP", v: "€55", bg: "bg-yellow" },
    ],
    amenities: [
      { label: "Fear-Free Certified", bg: "bg-sky" },
      { label: "Dental Suite", bg: "bg-mint" },
      { label: "Microchip Reader", bg: "bg-lavender" },
      { label: "Treats Bar", bg: "bg-yellow" },
    ],
    desc: "Warm neighborhood clinic with separate quiet waiting nooks, peanut-butter distraction mats, and instant digital vaccine passports.",
    note: "Dr. Vos is Milo's primary veterinarian.",
  },
  {
    id: "biscuit-sitters",
    name: "Biscuit & Bark Sitters",
    cat: "sitter",
    catLabel: "Sitter · €24 / 45m walk",
    sub: "Oud-West · Insured & Verified",
    dist: "1.4 km",
    rate: "4.9",
    reviews: 96,
    bg: "bg-peach",
    icon: "🦴",
    tag: "Verified",
    metrics: [
      { k: "DISTANCE", v: "1.4 km", bg: "bg-white" },
      { k: "RATE", v: "€24/walk", bg: "bg-peach" },
      { k: "RESPONSE", v: "< 10m", bg: "bg-mint" },
    ],
    amenities: [
      { label: "Live Photo Updates", bg: "bg-peach" },
      { label: "GPS Walk Map", bg: "bg-mint" },
      { label: "First-Aid Trained", bg: "bg-sky" },
      { label: "Small Breeds", bg: "bg-yellow" },
    ],
    desc: "Trusted solo and duo neighborhood walks with live clay route cards, water breaks, and post-walk belly rub reports.",
    note: "Booked twice in April · 5-star review.",
  },
  {
    id: "koffie-kwispel",
    name: "Koffie & Kwispel Café",
    cat: "cafe",
    catLabel: "Café · Free puppuccinos",
    sub: "Jan Pieter Heijestraat · Sunny patio",
    dist: "0.9 km",
    rate: "4.7",
    reviews: 173,
    bg: "bg-yellow",
    icon: "☕",
    tag: "Patio",
    metrics: [
      { k: "DISTANCE", v: "0.9 km", bg: "bg-white" },
      { k: "TREATS", v: "Free", bg: "bg-yellow" },
      { k: "SEATING", v: "Heated", bg: "bg-peach" },
    ],
    amenities: [
      { label: "Puppuccino Menu", bg: "bg-yellow" },
      { label: "Fresh Water Bowls", bg: "bg-sky" },
      { label: "Leash Hooks", bg: "bg-mint" },
      { label: "Oat Flat White", bg: "bg-lavender" },
    ],
    desc: "Cozy specialty coffee spot where dogs are greeted first with a whipped-oat puppuccino and homemade pumpkin biscuits.",
    note: "Great post-Vondelpark pit stop!",
  },
];

const SERVICES = [
  { id: "wellness", name: "Annual Wellness Check", dur: "30 min · Full nose-to-tail exam", price: 55 },
  { id: "vaccine", name: "Vaccination Booster", dur: "20 min · DHPPi + Rabies", price: 42 },
  { id: "dental", name: "Dental & Paw Care", dur: "40 min · Polish & nail trim", price: 68 },
];

const DATES = [
  { id: "Thu, May 15", day: "Thu", num: "15" },
  { id: "Fri, May 16", day: "Fri", num: "16" },
  { id: "Sat, May 17", day: "Sat", num: "17" },
  { id: "Mon, May 19", day: "Mon", num: "19" },
];

const TIMES = ["09:30", "11:00", "14:15", "16:00"];

const state = {
  screen: "onboarding",
  obStep: 0,
  authMode: "signin",
  walkKm: 2.4,
  hydration: 4,
  weightKg: 11.4,
  tasks: [
    { id: 1, title: "Morning Kibble · 180g", time: "08:00 AM", bg: "bg-mint", done: true },
    { id: 2, title: "Heartworm Chew · Monthly", time: "12:30 PM", bg: "bg-peach", done: false },
    { id: 3, title: "Vondelpark Evening Stroll", time: "06:00 PM", bg: "bg-sky", done: false },
    { id: 4, title: "Coat Brush & Paw Balm", time: "08:30 PM", bg: "bg-lavender", done: false },
  ],
  exploreCat: "all",
  exploreQuery: "",
  selectedPlaceId: "vondelpark",
  favs: new Set(["vondelpark"]),
  bookingStep: 1,
  serviceId: "wellness",
  selectedDate: "Fri, May 16",
  selectedTime: "11:00",
  reminders: [
    { id: "meals", label: "Meal & Kibble Alerts", on: true },
    { id: "walk", label: "Daily Walk Nudge (18:00)", on: true },
    { id: "vet", label: "Vet & Vaccine Reminders", on: true },
    { id: "rain", label: "Park Rain Warnings", on: false },
  ],
};

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("clayToast");
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

// Navigation across all 8 screens
function goToScreen(name) {
  state.screen = name;
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.toggle("is-active", s.dataset.screen === name);
  });
  document.querySelectorAll(".rail-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.goto === name);
  });

  const nav = document.getElementById("bottomNav");
  const showNav = ["home", "explore", "profile"].includes(name);
  nav.classList.toggle("is-hidden", !showNav);
  nav.querySelectorAll(".bnav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.goto === name);
  });

  if (name === "detail") renderDetail();
  if (name === "booking") renderBooking();
}

document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-goto]");
  if (target) {
    goToScreen(target.dataset.goto);
  }
  const openPlace = e.target.closest("[data-open-place]");
  if (openPlace) {
    state.selectedPlaceId = openPlace.dataset.openPlace;
    goToScreen("detail");
  }
});

// 01 Onboarding
function renderOnboarding() {
  const slide = ONBOARDING_SLIDES[state.obStep];
  document.getElementById("obTitle").innerHTML = slide.title;
  document.getElementById("obDesc").textContent = slide.desc;
  document.getElementById("obNextBtn").textContent = slide.cta;
  document.querySelectorAll("#obDots .dot").forEach((d, idx) => {
    d.classList.toggle("is-active", idx === state.obStep);
  });
  const mascot = document.getElementById("onboardingMascot");
  mascot.classList.add("bounce");
  setTimeout(() => mascot.classList.remove("bounce"), 340);
}

document.getElementById("obNextBtn").addEventListener("click", () => {
  if (state.obStep < ONBOARDING_SLIDES.length - 1) {
    state.obStep += 1;
    renderOnboarding();
  } else {
    showToast("GPS & Care Alerts enabled!");
    goToScreen("login");
  }
});

document.querySelectorAll("#obDots .dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    state.obStep = Number(dot.dataset.step);
    renderOnboarding();
  });
});

// 02 Login / Sign-Up
document.querySelectorAll("[data-auth-mode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.authMode = btn.dataset.authMode;
    document.querySelectorAll("[data-auth-mode]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.authMode === state.authMode);
    });
    const isSignup = state.authMode === "signup";
    document.getElementById("petNameField").classList.toggle("is-hidden", !isSignup);
    document.getElementById("authHeading").textContent = isSignup ? "Join PawPal!" : "Welcome Back!";
    document.getElementById("authSubmitBtn").textContent = isSignup ? "Create PawPal Account" : "Sign In to PawPal";
    document.getElementById("loginError").textContent = "";
  });
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  const pass = document.getElementById("passInput").value;
  const err = document.getElementById("loginError");
  if (!email.includes("@")) {
    err.textContent = "Please enter a valid email address.";
    return;
  }
  if (pass.length < 6) {
    err.textContent = "Password must be at least 6 characters.";
    return;
  }
  err.textContent = "";
  showToast("Welcome back, Allan & Milo!");
  goToScreen("home");
});

document.getElementById("forgotBtn").addEventListener("click", () => {
  showToast("Reset link sent to allan@pawpal.pet");
});

document.querySelectorAll("[data-social]").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast(`Signed in with ${btn.dataset.social}`);
    goToScreen("home");
  });
});

// 03 Home / Feed
function renderHome() {
  const pct = Math.min(100, Math.round((state.walkKm / 3.0) * 100));
  document.getElementById("walkKm").textContent = state.walkKm.toFixed(1);
  document.getElementById("walkPct").textContent = `${pct}% Goal`;
  document.getElementById("walkBar").style.width = `${pct}%`;
  const steps = Math.round(state.walkKm * 2008);
  const mins = Math.round(state.walkKm * 15.8);
  document.getElementById("walkMeta").textContent = `${mins} min · ${steps.toLocaleString()} steps`;
  document.getElementById("hydrationVal").textContent = `${state.hydration} / 5 bowls`;

  const doneCount = state.tasks.filter((t) => t.done).length;
  document.getElementById("taskCounter").textContent = `${doneCount} of ${state.tasks.length} done`;

  const list = document.getElementById("taskList");
  list.innerHTML = state.tasks
    .map(
      (t) => `
      <button class="task-item ${t.done ? "is-done" : ""}" data-task-id="${t.id}" type="button">
        <span class="task-check ${t.done ? "" : t.bg} clay-xs">${t.done ? "✓" : ""}</span>
        <div class="task-meta">
          <strong>${t.title}</strong>
          <span>${t.time}</span>
        </div>
        <span class="pill ${t.done ? "bg-mint" : t.bg} clay-xs">${t.done ? "Done" : "Log"}</span>
      </button>
    `
    )
    .join("");
}

document.getElementById("taskList").addEventListener("click", (e) => {
  const item = e.target.closest("[data-task-id]");
  if (!item) return;
  const id = Number(item.dataset.taskId);
  const task = state.tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    renderHome();
    showToast(task.done ? `Completed: ${task.title}` : `Unchecked: ${task.title}`);
  }
});

document.getElementById("addWalkBtn").addEventListener("click", () => {
  state.walkKm = Math.min(3.6, +(state.walkKm + 0.3).toFixed(1));
  renderHome();
  showToast(state.walkKm >= 3.0 ? "Daily walk goal reached! 🎉" : "+0.3 km logged for Milo");
});

document.getElementById("hydrationCard").addEventListener("click", () => {
  state.hydration = state.hydration >= 5 ? 1 : state.hydration + 1;
  renderHome();
  showToast(`Water logged: ${state.hydration} / 5 bowls`);
});

document.getElementById("notifBellBtn").addEventListener("click", () => {
  showToast("Heartworm chew reminder at 12:30 PM");
});

// 04 Search / Explore
function renderExplore() {
  const q = state.exploreQuery.toLowerCase();
  const matches = PLACES.filter((p) => {
    const catOk = state.exploreCat === "all" || p.cat === state.exploreCat;
    const textOk =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.catLabel.toLowerCase().includes(q) ||
      p.sub.toLowerCase().includes(q);
    return catOk && textOk;
  });

  document.getElementById("resultCount").textContent =
    matches.length === 1 ? "1 Spot Found Near You" : `${matches.length} Top-Rated Spots Near You`;

  const list = document.getElementById("placeList");
  if (!matches.length) {
    list.innerHTML = `<div class="clay-card clay-sm"><strong style="font-size:14px">No spots match "${state.exploreQuery}"</strong><span style="font-size:12px;color:var(--muted)">Try searching "park", "vet", or "café".</span></div>`;
    return;
  }

  list.innerHTML = matches
    .map(
      (p) => `
      <button class="place-card" data-place-id="${p.id}" type="button">
        <div class="place-tile ${p.bg} clay-xs">${p.icon}</div>
        <div class="place-info">
          <strong>${p.name}</strong>
          <span>${p.catLabel}</span>
          <small>★ ${p.rate} · ${p.dist}</small>
        </div>
        <span class="pill ${p.bg} clay-xs">${p.tag}</span>
      </button>
    `
    )
    .join("");
}

document.getElementById("exploreSearch").addEventListener("input", (e) => {
  state.exploreQuery = e.target.value;
  renderExplore();
});

document.getElementById("categoryChips").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-cat]");
  if (!chip) return;
  state.exploreCat = chip.dataset.cat;
  document.querySelectorAll("#categoryChips .chip").forEach((c) => {
    c.classList.toggle("is-active", c.dataset.cat === state.exploreCat);
  });
  renderExplore();
});

document.getElementById("placeList").addEventListener("click", (e) => {
  const card = e.target.closest("[data-place-id]");
  if (!card) return;
  state.selectedPlaceId = card.dataset.placeId;
  goToScreen("detail");
});

// 05 Detail View
function renderDetail() {
  const p = PLACES.find((x) => x.id === state.selectedPlaceId) || PLACES[0];
  const hero = document.getElementById("detailHero");
  hero.className = `clay-card clay-md detail-hero ${p.bg}`;
  document.getElementById("detailStatus").textContent = p.tag.toUpperCase();
  document.getElementById("detailRating").textContent = `★ ${p.rate} (${p.reviews})`;
  document.getElementById("detailIcon").textContent = p.icon;
  document.getElementById("detailName").textContent = p.name;
  document.getElementById("detailSub").textContent = p.sub;
  document.getElementById("detailDesc").textContent = p.desc;
  document.getElementById("detailNote").textContent = p.note;

  const isFav = state.favs.has(p.id);
  const favBtn = document.getElementById("favPlaceBtn");
  favBtn.textContent = isFav ? "♥" : "♡";
  favBtn.style.color = isFav ? "var(--coral-dark)" : "var(--ink)";

  document.getElementById("detailMetrics").innerHTML = p.metrics
    .map(
      (m) => `
      <div class="clay-card ${m.bg} clay-sm mini-metric">
        <span>${m.k}</span>
        <strong>${m.v}</strong>
      </div>
    `
    )
    .join("");

  document.getElementById("detailAmenities").innerHTML = p.amenities
    .map((a) => `<span class="pill ${a.bg} clay-xs">${a.label}</span>`)
    .join("");
}

document.getElementById("favPlaceBtn").addEventListener("click", () => {
  const id = state.selectedPlaceId;
  if (state.favs.has(id)) {
    state.favs.delete(id);
    showToast("Removed from saved places");
  } else {
    state.favs.add(id);
    showToast("Saved to Milo's favorites ♥");
  }
  renderDetail();
});

document.getElementById("startWalkFromDetail").addEventListener("click", () => {
  state.walkKm = Math.min(3.6, +(state.walkKm + 0.3).toFixed(1));
  renderHome();
  showToast("Walk started! Tracking GPS route 🐾");
  goToScreen("home");
});

// 06 Multi-step Vet Booking Form
function renderBooking() {
  const step1 = document.getElementById("bookingStep1");
  const step2 = document.getElementById("bookingStep2");
  step1.classList.toggle("is-hidden", state.bookingStep !== 1);
  step2.classList.toggle("is-hidden", state.bookingStep !== 2);
  document.getElementById("bookingStepPill").textContent = `Step ${state.bookingStep} / 2`;

  document.getElementById("serviceList").innerHTML = SERVICES.map(
    (sv) => `
    <button class="service-card ${sv.id === state.serviceId ? "is-selected" : ""}" data-service-id="${sv.id}" type="button">
      <div>
        <strong>${sv.name}</strong>
        <span>${sv.dur}</span>
      </div>
      <span class="pill bg-white clay-xs">€${sv.price}</span>
    </button>
  `
  ).join("");

  document.getElementById("dateGrid").innerHTML = DATES.map(
    (d) => `
    <button class="date-pill ${d.id === state.selectedDate ? "is-selected" : ""}" data-date-id="${d.id}" type="button">
      <span>${d.day}</span>
      <strong>${d.num}</strong>
    </button>
  `
  ).join("");

  document.getElementById("timeRow").innerHTML = TIMES.map(
    (t) => `
    <button class="time-pill ${t === state.selectedTime ? "is-selected" : ""}" data-time-val="${t}" type="button">${t}</button>
  `
  ).join("");

  const activeService = SERVICES.find((s) => s.id === state.serviceId) || SERVICES[0];
  document.getElementById("summaryService").textContent = activeService.name;
  document.getElementById("summaryPrice").textContent = `€${activeService.price}.00`;
  document.getElementById("summaryWhen").textContent = `${state.selectedDate} · ${state.selectedTime} · Pay at clinic`;
}

document.getElementById("serviceList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-service-id]");
  if (!btn) return;
  state.serviceId = btn.dataset.serviceId;
  renderBooking();
});

document.getElementById("toStep2Btn").addEventListener("click", () => {
  state.bookingStep = 2;
  renderBooking();
});

document.getElementById("bookingBackBtn").addEventListener("click", () => {
  if (state.bookingStep === 2) {
    state.bookingStep = 1;
    renderBooking();
  } else {
    goToScreen("home");
  }
});

document.getElementById("dateGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-date-id]");
  if (!btn) return;
  state.selectedDate = btn.dataset.dateId;
  renderBooking();
});

document.getElementById("timeRow").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-time-val]");
  if (!btn) return;
  state.selectedTime = btn.dataset.timeVal;
  renderBooking();
});

document.getElementById("confirmBookingBtn").addEventListener("click", () => {
  const sv = SERVICES.find((s) => s.id === state.serviceId) || SERVICES[0];
  document.getElementById("confirmCopy").textContent =
    `Milo's ${sv.name} at Paws & Care is confirmed for ${state.selectedDate} at ${state.selectedTime}.`;
  state.bookingStep = 1;
  filterStates("confirm");
  goToScreen("states");
  showToast("Appointment confirmed! 🎉");
});

// 07 Profile & Settings Toggles
function renderProfile() {
  document.getElementById("profileWeight").textContent = `${state.weightKg.toFixed(1)} kg`;
  document.getElementById("toggleList").innerHTML = state.reminders
    .map(
      (r) => `
      <div class="toggle-row">
        <span>${r.label}</span>
        <button class="clay-switch ${r.on ? "is-on" : ""}" data-toggle-id="${r.id}" role="switch" aria-checked="${r.on}" type="button">
          <span class="switch-knob"></span>
        </button>
      </div>
    `
    )
    .join("");
}

document.getElementById("toggleList").addEventListener("click", (e) => {
  const sw = e.target.closest("[data-toggle-id]");
  if (!sw) return;
  const r = state.reminders.find((x) => x.id === sw.dataset.toggleId);
  if (r) {
    r.on = !r.on;
    renderProfile();
    showToast(`${r.label}: ${r.on ? "ON" : "OFF"}`);
  }
});

document.getElementById("logWeightBtn").addEventListener("click", () => {
  state.weightKg = +(state.weightKg + 0.1).toFixed(1);
  if (state.weightKg > 11.8) state.weightKg = 11.2;
  document.getElementById("mayBar").style.height = `${34 + Math.round((state.weightKg - 11.0) * 18)}px`;
  renderProfile();
  showToast(`Logged Milo's weight: ${state.weightKg.toFixed(1)} kg`);
});

// 08 States Switcher
function filterStates(filter) {
  document.querySelectorAll("[data-state-filter]").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.stateFilter === filter);
  });
  document.querySelectorAll("[data-state-card]").forEach((card) => {
    const show = filter === "all" || card.dataset.stateCard === filter;
    card.classList.toggle("is-hidden", !show);
  });
}

document.querySelectorAll("[data-state-filter]").forEach((btn) => {
  btn.addEventListener("click", () => filterStates(btn.dataset.stateFilter));
});

document.getElementById("retryGpsBtn").addEventListener("click", () => {
  showToast("GPS signal locked near Vondelpark ✓");
});

// Initialize
renderOnboarding();
renderHome();
renderExplore();
renderDetail();
renderBooking();
renderProfile();
