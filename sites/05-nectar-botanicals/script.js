/* ==========================================================================
   NECTAR BOTANICALS — INTERACTIVE STUDIO LIGHTING, ACCORDION & ATELIER BOOKING
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Toggle
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Pointer-Reactive 3D Studio Lighting on Hero Amber Vessel Stage
     ------------------------------------------------------------------------ */
  const stage = document.getElementById("studioStage");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (stage && !prefersReducedMotion) {
    let targetX = 0.38;
    let targetY = 0.28;
    let currentX = 0.38;
    let currentY = 0.28;
    let rafId = null;

    const animateLight = () => {
      currentX += (targetX - currentX) * 0.11;
      currentY += (targetY - currentY) * 0.11;

      const rotY = (currentX - 0.5) * 10;
      const rotX = (0.5 - currentY) * 8;

      stage.style.setProperty("--mx", currentX.toFixed(4));
      stage.style.setProperty("--my", currentY.toFixed(4));
      stage.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
      stage.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        rafId = requestAnimationFrame(animateLight);
      } else {
        rafId = null;
      }
    };

    const scheduleFrame = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(animateLight);
      }
    };

    stage.addEventListener("pointermove", (e) => {
      const rect = stage.getBoundingClientRect();
      targetX = Math.max(0.08, Math.min(0.92, (e.clientX - rect.left) / rect.width));
      targetY = Math.max(0.08, Math.min(0.92, (e.clientY - rect.top) / rect.height));
      scheduleFrame();
    });

    stage.addEventListener("pointerleave", () => {
      targetX = 0.38;
      targetY = 0.28;
      scheduleFrame();
    });
  }

  /* ------------------------------------------------------------------------
     2b. Slow Editorial Silk Reveal Curves & Luxury Card Specular Tracking
     ------------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.documentElement.classList.add("js-silk-ready");

    const revealTargets = document.querySelectorAll(
      ".section-header, .tour-card, .step-card, .case-card, .accordion-item, .price-card, .tasting-shell, .proof-logo"
    );

    revealTargets.forEach((el) => {
      el.setAttribute("data-silk", "");
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((child) =>
          child.matches(".tour-card, .step-card, .case-card, .accordion-item, .price-card, .proof-logo")
        );
        const idx = siblings.indexOf(el);
        if (idx > 0) {
          el.style.setProperty("--silk-delay", `${Math.min(idx * 95, 380)}ms`);
        }
      }
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealTargets.forEach((el) => observer.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add("is-revealed"));
    }

    // Subtle pointer-reactive amber sheen on dark walnut cards
    document.querySelectorAll(".case-card, .price-card-featured").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--card-mx", `${x.toFixed(1)}%`);
        card.style.setProperty("--card-my", `${y.toFixed(1)}%`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. FAQ Warm Editorial Accordion
     ------------------------------------------------------------------------ */
  const accordion = document.getElementById("faqAccordion");
  if (accordion) {
    const items = accordion.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          const otherBtn = other.querySelector(".accordion-trigger");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Partner Story Modal (Case Studies)
     ------------------------------------------------------------------------ */
  const partnerStories = {
    "six-senses": {
      kicker: "Partner Story · Crans-Montana, Switzerland",
      title: "Six Senses Alpine Spa",
      metric: "+38% Post-Treatment Retail Attach Rate",
      paragraphs: [
        "Six Senses Alpine Spa sought to bridge their signature raw-honey thermal wrap with a home ritual guests genuinely wanted on their nightstand. Generic white-label spa jars were converting fewer than 11% of treatment guests.",
        "By placing numbered Harvest 09 amber vessels directly on warm walnut trays inside all 14 treatment suites—paired with a 1-card Engadin altitude provenance note—retail attach rose by 38% within 90 days.",
        "Every quarter, empty backbar and suite vessels return to our Upper Engadin studio in cedar crates, reducing single-use packaging waste by 142 kg annually."
      ]
    },
    "atelier-nordic": {
      kicker: "Partner Story · Copenhagen, Denmark",
      title: "Atelier Nordic Hotel",
      metric: "94% Closed-Loop Vessel Refill & Return",
      paragraphs: [
        "Atelier Nordic Hotel eliminated plastic amenity miniatures across all 42 suites, but needed a sculptural skincare system that matched their limestone and smoked-oak interiors.",
        "We deployed weighted Travertine Beeswax vessels and UV-shielded Amber Propolis Oil stations with subtle suite-numbered base etchings and a quarterly swap cadence.",
        "Over four consecutive quarters, 94% of glass vessels cycled cleanly through ultrasonic sterilization and refill, cutting per-suite amenity spend by 19% while elevating guest satisfaction scores."
      ]
    }
  };

  const storyModal = document.getElementById("storyModal");
  const storyModalKicker = document.getElementById("storyModalKicker");
  const storyModalTitle = document.getElementById("storyModalTitle");
  const storyModalMetric = document.getElementById("storyModalMetric");
  const storyModalContent = document.getElementById("storyModalContent");

  const closeModal = () => {
    if (!storyModal) return;
    storyModal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-story]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-story");
      const story = partnerStories[key];
      if (!story || !storyModal) return;

      storyModalKicker.textContent = story.kicker;
      storyModalTitle.textContent = story.title;
      storyModalMetric.textContent = story.metric;
      storyModalContent.innerHTML = story.paragraphs.map((p) => `<p>${p}</p>`).join("");

      storyModal.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  if (storyModal) {
    storyModal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !storyModal.hidden) {
        closeModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Pricing Tier Pre-fill into Tasting Form
     ------------------------------------------------------------------------ */
  const propertyInput = document.getElementById("guestProperty");
  document.querySelectorAll("[data-select-interest]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-select-interest");
      if (propertyInput && value) {
        propertyInput.value = value;
      }
    });
  });

  /* ------------------------------------------------------------------------
     6. Interactive Atelier Calendar & 3-Field Booking Confirmation
     ------------------------------------------------------------------------ */
  const calendarDaysEl = document.getElementById("calendarDays");
  const calendarTimesEl = document.getElementById("calendarTimes");
  const calendarMonthLabel = document.getElementById("calendarMonthLabel");
  const selectedSlotText = document.getElementById("selectedSlotText");

  const tastingForm = document.getElementById("tastingForm");
  const tastingConfirmation = document.getElementById("tastingConfirmation");
  const confirmSummary = document.getElementById("confirmSummary");
  const confirmDetails = document.getElementById("confirmDetails");
  const formError = document.getElementById("formError");
  const rescheduleBtn = document.getElementById("rescheduleBtn");

  // Generate next 5 upcoming weekdays dynamically from today
  const getUpcomingWeekdays = (count) => {
    const days = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);
    while (days.length < count) {
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) {
        days.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  };

  const timeSlots = ["10:00 CET", "11:30 CET", "14:00 CET", "16:00 CET", "17:30 CET"];
  const upcomingDays = getUpcomingWeekdays(5);

  let selectedDayIndex = 1;
  let selectedTime = timeSlots[1];

  const formatDayShort = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short" });

  const formatDayFull = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const updateSlotBanner = () => {
    if (!selectedSlotText) return;
    const chosenDate = upcomingDays[selectedDayIndex];
    selectedSlotText.textContent = `Selected: ${formatDayFull(chosenDate)} at ${selectedTime}`;
  };

  if (calendarMonthLabel && upcomingDays.length > 0) {
    const monthYear = upcomingDays[0].toLocaleDateString("en-US", { month: "long", year: "numeric" });
    calendarMonthLabel.textContent = `${monthYear} · CET`;
  }

  const renderCalendar = () => {
    if (!calendarDaysEl || !calendarTimesEl) return;

    calendarDaysEl.innerHTML = "";
    upcomingDays.forEach((date, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cal-day-btn${idx === selectedDayIndex ? " is-selected" : ""}`;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(idx === selectedDayIndex));
      btn.innerHTML = `
        <span class="cal-day-name">${formatDayShort(date)}</span>
        <span class="cal-day-num">${date.getDate()}</span>
      `;
      btn.addEventListener("click", () => {
        selectedDayIndex = idx;
        renderCalendar();
        updateSlotBanner();
      });
      calendarDaysEl.appendChild(btn);
    });

    calendarTimesEl.innerHTML = "";
    timeSlots.forEach((slot) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cal-time-btn${slot === selectedTime ? " is-selected" : ""}`;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(slot === selectedTime));
      btn.textContent = slot;
      btn.addEventListener("click", () => {
        selectedTime = slot;
        renderCalendar();
        updateSlotBanner();
      });
      calendarTimesEl.appendChild(btn);
    });
  };

  renderCalendar();
  updateSlotBanner();

  if (tastingForm && tastingConfirmation) {
    tastingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formError) formError.hidden = true;

      const name = document.getElementById("guestName").value.trim();
      const email = document.getElementById("guestEmail").value.trim();
      const property = document.getElementById("guestProperty").value.trim();

      if (!name || !email || !property) {
        if (formError) {
          formError.textContent = "Please complete your name, email, and property or interest.";
          formError.hidden = false;
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (formError) {
          formError.textContent = "Please enter a valid work or studio email address.";
          formError.hidden = false;
        }
        return;
      }

      const chosenDate = formatDayFull(upcomingDays[selectedDayIndex]);

      confirmSummary.textContent = `We have sent a calendar invitation and Harvest 09 tasting vial dispatch form to ${email}.`;
      confirmDetails.innerHTML = `
        <div><span>Guest</span><strong>${escapeHtml(name)}</strong></div>
        <div><span>Session</span><strong>${escapeHtml(chosenDate)} · ${escapeHtml(selectedTime)}</strong></div>
        <div><span>Allocation Focus</span><strong>${escapeHtml(property)}</strong></div>
        <div><span>Tasting Kit</span><strong>3 × 15ml Harvest 09 Glass Vials</strong></div>
      `;

      tastingForm.hidden = true;
      tastingConfirmation.hidden = false;
    });

    if (rescheduleBtn) {
      rescheduleBtn.addEventListener("click", () => {
        tastingConfirmation.hidden = true;
        tastingForm.hidden = false;
      });
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
