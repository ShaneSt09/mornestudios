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

topButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
