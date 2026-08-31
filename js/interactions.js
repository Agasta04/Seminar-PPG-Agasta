/**
 * E-PORTOFOLIO INTERACTIVE & ANIMATION ENGINE
 * Agasta Pratama Nugraha (PPG Informatika UNY)
 */

document.addEventListener("DOMContentLoaded", () => {
  initSplashLoader();
  initScrollReveal();
  initStatCounters();
  initTiltCards();
  initBackToTop();
  initCursorAura();
  initDoodleHoverSparkles();
});

/* --------------------------------------------------------------------------
   1. INTRO / SPLASH PRELOADER ENGINE
   -------------------------------------------------------------------------- */
function initSplashLoader() {
  const splash = document.getElementById("introSplash");
  if (!splash) return;

  const progressBar = document.getElementById("splashProgressBar");
  const statusText = document.getElementById("splashStatusText");
  const enterBtn = document.getElementById("splashEnterBtn");

  const steps = [
    { progress: 25, text: "Memuat Modul & Visi Pembelajaran..." },
    { progress: 55, text: "Sinkronisasi Data LK 2 & Artefak SMAN 4..." },
    { progress: 85, text: "Menyiapkan Pengalaman Interaktif..." },
    { progress: 100, text: "Portofolio Siap Dieksplorasi!" }
  ];

  let currentStep = 0;

  function advanceLoading() {
    if (currentStep < steps.length) {
      const { progress, text } = steps[currentStep];
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (statusText) statusText.textContent = text;
      currentStep++;

      if (currentStep < steps.length) {
        setTimeout(advanceLoading, 300);
      } else {
        setTimeout(() => {
          dismissSplash();
        }, 500);
      }
    }
  }

  function dismissSplash() {
    if (splash) {
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.style.display = "none";
        // Trigger initial reveals on the main page
        triggerVisibleReveals();
      }, 800);
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      dismissSplash();
    });
  }

  // Start sequence
  setTimeout(advanceLoading, 150);
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

function triggerVisibleReveals() {
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("is-revealed");
    }
  });
}

/* --------------------------------------------------------------------------
   3. ANIMATED NUMBER COUNTER
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll("[data-counter-target]");
  if (!statNumbers.length) return;

  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-counter-target"));
          const prefix = el.getAttribute("data-counter-prefix") || "";
          const suffix = el.getAttribute("data-counter-suffix") || "";
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateNumber(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * target);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              el.textContent = `${prefix}${target}${suffix}`;
            }
          }

          requestAnimationFrame(updateNumber);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => countObserver.observe(el));
}

/* --------------------------------------------------------------------------
   4. 3D INTERACTIVE TILT FOR CARDS
   -------------------------------------------------------------------------- */
function initTiltCards() {
  // Select cards intended for 3D tilt
  const cards = document.querySelectorAll(
    ".bento-work-card, .course-card-editorial, .polaroid-card, .g1-neon-card-poster, .action-card, .service-item, .v2-pillar-card, .sticky-note-yellow"
  );

  cards.forEach((card) => {
    card.classList.add("tilt-card");

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limit max rotation to ±8 deg
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* --------------------------------------------------------------------------
   5. BACK TO TOP BUTTON WITH SCROLL PROGRESS RING
   -------------------------------------------------------------------------- */
function initBackToTop() {
  // Check if back-to-top button exists; if not, create one automatically
  let btn = document.getElementById("backToTopBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "backToTopBtn";
    btn.className = "back-to-top-btn";
    btn.setAttribute("aria-label", "Kembali ke Atas");
    btn.innerHTML = `
      <svg class="progress-ring" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="25.5"></circle>
      </svg>
      <i class="fa-solid fa-arrow-up"></i>
    `;
    document.body.appendChild(btn);
  }

  const circle = btn.querySelector("circle");
  const circumference = 2 * Math.PI * 25.5; // ~160.22

  if (circle) {
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
  }

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    if (scrollTop > 350) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }

    if (circle) {
      const offset = circumference - scrollPercent * circumference;
      circle.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* --------------------------------------------------------------------------
   6. CURSOR AURA GLOW (SILKY SMOOTH LIGHT FOLLOWER)
   -------------------------------------------------------------------------- */
function initCursorAura() {
  // Only on larger non-touch devices
  if (window.innerWidth < 992 || "ontouchstart" in window) return;

  let aura = document.getElementById("cursorAuraGlow");
  if (!aura) {
    aura = document.createElement("div");
    aura.id = "cursorAuraGlow";
    aura.className = "cursor-aura-glow";
    document.body.appendChild(aura);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  function loop() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    if (aura) {
      aura.style.left = `${currentX}px`;
      aura.style.top = `${currentY}px`;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------------------
   7. DOODLE HOVER SPARKLES
   -------------------------------------------------------------------------- */
function initDoodleHoverSparkles() {
  const doodleIcons = document.querySelectorAll(
    ".g1-stamp-center-smiley, .poster-crown-icon, .heart-doodle, .v2-crown-doodle, .footer-stars-doodle"
  );

  doodleIcons.forEach((icon) => {
    icon.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    icon.addEventListener("mouseenter", () => {
      icon.style.transform = "scale(1.25) rotate(12deg)";
    });
    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "";
    });
  });
}

/* --------------------------------------------------------------------------
   8. EXPANDABLE IMAGE GALLERY & ACCORDION CARDS
   -------------------------------------------------------------------------- */
function activateExpandCard(card) {
  if (!card) return;
  const parent = card.parentElement;
  if (!parent) return;
  const siblings = parent.querySelectorAll(".expand-gallery-card");
  siblings.forEach((sib) => sib.classList.remove("active"));
  card.classList.add("active");
}

function activateAccordionPill(pill) {
  if (!pill) return;
  const container = pill.closest(".expandable-action-accordion");
  if (!container) return;
  const pills = container.querySelectorAll(".action-expand-pill");
  pills.forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");
}

