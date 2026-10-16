document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

// Header border once the page scrolls
const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile navigation
const closeNav = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof Node && !navToggle?.contains(target) && !nav?.contains(target)) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

// Reveal sections as they scroll into view
const revealTargets = document.querySelectorAll(
  ".section-head, .restore-grid > *, .case-shots, .case-detail, .concept, .service, .package, .steps li, .faq-list, .contact-grid > *, .cs-body, .cs-gallery figure",
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealTargets.forEach((item) => {
    const siblings = Array.from(item.parentElement?.children ?? []);
    const index = siblings.indexOf(item);

    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(Math.max(index, 0) * 80, 320)}ms`;
    revealObserver.observe(item);
  });
}

// Before / after comparison slider
document.querySelectorAll("[data-compare]").forEach((compare) => {
  const range = compare.querySelector(".compare-range");
  const buttons = compare.querySelectorAll("[data-show]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  let animation = 0;

  if (!range) {
    return;
  }

  const update = () => {
    compare.style.setProperty("--pos", `${range.value}%`);
    const showingBefore = Number(range.value) > 50;
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String((button.dataset.show === "100") === showingBefore));
    });
  };

  // Animate the divider to a position; resolves when done
  const animateTo = (target, duration = 900) =>
    new Promise((resolve) => {
      cancelAnimationFrame(animation);
      if (reduceMotion) {
        range.value = String(target);
        update();
        resolve();
        return;
      }
      const from = Number(range.value);
      const start = performance.now();
      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        range.value = String(from + (target - from) * ease(progress));
        update();
        if (progress < 1) {
          animation = requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };
      animation = requestAnimationFrame(frame);
    });

  range.addEventListener("input", () => {
    cancelAnimationFrame(animation);
    update();
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => animateTo(Number(button.dataset.show)));
  });

  // Drag anywhere on the image (mouse, pen or touch)
  const stage = compare.querySelector(".compare-stage");

  const setFromPointer = (event) => {
    const rect = stage.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) / rect.width) * 100;
    range.value = String(Math.min(100, Math.max(0, percent)));
    update();
  };

  stage?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    cancelAnimationFrame(animation);
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
    setFromPointer(event);
  });

  stage?.addEventListener("pointermove", (event) => {
    if (stage.hasPointerCapture(event.pointerId)) {
      setFromPointer(event);
    }
  });

  const endDrag = (event) => {
    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }
    stage.classList.remove("is-dragging");
  };

  stage?.addEventListener("pointerup", endDrag);
  stage?.addEventListener("pointercancel", endDrag);

  update();

  // First time it scrolls into view: show the old site, then wipe to the new one
  if (reduceMotion || !("IntersectionObserver" in window)) {
    return;
  }

  let touched = false;
  const stopIntro = () => (touched = true);
  stage?.addEventListener("pointerdown", stopIntro, { once: true });
  range.addEventListener("keydown", stopIntro, { once: true });
  buttons.forEach((button) => button.addEventListener("click", stopIntro, { once: true }));

  const introObserver = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting) return;
      introObserver.disconnect();
      await new Promise((r) => setTimeout(r, 300));
      if (touched) return;
      await animateTo(100, 700);
      await new Promise((r) => setTimeout(r, 900));
      if (touched) return;
      animateTo(0, 1600);
    },
    { threshold: 0.5 },
  );
  introObserver.observe(compare);
});

// Package buttons preselect the project type in the form
const projectType = document.querySelector("[data-project-type]");

document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    if (projectType) {
      projectType.value = link.dataset.package;
    }
  });
});

// Copy phone number
const phoneButton = document.querySelector("[data-copy-phone]");

phoneButton?.addEventListener("click", async () => {
  const phoneNumber = "+17672655905";
  const status = phoneButton.querySelector("[data-copy-status]");

  try {
    await navigator.clipboard.writeText(phoneNumber);
    if (status) {
      status.textContent = "Copied";
    }
  } catch {
    window.prompt("Copy phone number", phoneNumber);
  }
});

// Mobile call-to-action: show after the hero, hide near the contact form
const mobileCta = document.querySelector(".mobile-cta");
const hero = document.querySelector(".hero");
const contact = document.querySelector("#contact");

if (mobileCta && hero && contact && "IntersectionObserver" in window) {
  let heroVisible = true;
  let contactVisible = false;

  const sync = () => {
    mobileCta.classList.toggle("is-visible", !heroVisible && !contactVisible);
  };

  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    sync();
  }).observe(hero);

  new IntersectionObserver(([entry]) => {
    contactVisible = entry.isIntersecting;
    sync();
  }).observe(contact);
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
