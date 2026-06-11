const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  observer.observe(item);
});

const topButton = document.querySelector("[data-scroll-top]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

const closeNav = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navLinks?.classList.remove("is-open");
};

topButton?.addEventListener("click", () => {
  closeNav();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (
    target instanceof Node &&
    !navToggle?.contains(target) &&
    !navLinks?.contains(target)
  ) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

const phoneButton = document.querySelector("[data-copy-phone]");

phoneButton?.addEventListener("click", async () => {
  const phoneNumber = "+17672655905";

  try {
    await navigator.clipboard.writeText(phoneNumber);
    phoneButton.querySelector("span").textContent = "Copied";
  } catch {
    window.prompt("Copy phone number", phoneNumber);
  }
});
