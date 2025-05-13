let listBg = document.querySelectorAll(".banner .bg"); // Changed selector to target only banner backgrounds
let banner = document.querySelector(".banner");
let tabs = document.querySelectorAll(".tab");
let container = document.querySelector(".container");
let body = document.querySelector("body");

// Function to handle banner parallax
function handleBannerParallax() {
  listBg.forEach((bgLayer) => {
    let speed = parseFloat(bgLayer.dataset.speed) || 0;
    let movement = currentScrollY * speed; // Changed from scrollY to currentScrollY
    bgLayer.style.transform = `translateY(${movement}px)`;
  });
}

// --- Smooth Scrolling Implementation ---
let currentScrollY = window.scrollY;
let targetScrollY = window.scrollY;
const scrollLerpFactor = 0.075; // Lower = smoother, but less responsive. Default: 0.1
const scrollSensitivity = 0.5; // Adjust how much one wheel tick scrolls. Default: 0.5

window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault();
    targetScrollY += event.deltaY * scrollSensitivity;

    // Clamp targetScrollY to prevent overscrolling
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));
  },
  { passive: false }
);

// Listener for scrollbar interactions or other non-wheel scroll events
window.addEventListener("scroll", () => {
  // If the scroll was likely caused by user dragging scrollbar or other means
  // (i.e., window.scrollY is significantly different from our lerped currentScrollY)
  if (Math.abs(window.scrollY - currentScrollY) > 1) {
    targetScrollY = window.scrollY;
    currentScrollY = window.scrollY; // Snap to the new position
  }
});

function smoothScrollLoop() {
  let diff = targetScrollY - currentScrollY;

  // If the difference is small enough, snap to target and reduce processing
  if (Math.abs(diff) < 0.5) {
    currentScrollY = targetScrollY;
  } else {
    currentScrollY += diff * scrollLerpFactor;
  }

  window.scrollTo(0, currentScrollY);
  handleBannerParallax(); // Update banner parallax

  requestAnimationFrame(smoothScrollLoop);
}
// --- End of Smooth Scrolling Implementation ---

// Start the smooth scroll loop
smoothScrollLoop();

const elementsToAnimateOnScroll = document.querySelectorAll(
  ".tab.tab3 .dual-image-container, " +
    ".tab.tab7 .image-text-container, " +
    ".tab.tab9, " + // Added .tab.tab9
    ".tab.tab10 .image-text-container, " +
    ".tab.tab12, " +
    ".tab.tab13, " +
    ".tab.tab15, " +
    ".tab.tab16, " +
    ".tab.tab18 .content-s1, " +
    ".tab.tab18 .content-s2, " +
    ".tab.tab18 .content-s3"
);

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.2,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
};

const animationObserver = new IntersectionObserver(
  observerCallback,
  observerOptions
);

elementsToAnimateOnScroll.forEach((element) => {
  animationObserver.observe(element);
});

document.addEventListener("DOMContentLoaded", () => {
  const timelineLinks = document.querySelectorAll(".vertical-timeline a");
  const chapters = document.querySelectorAll('[id^="chapter"]');

  // Smooth scroll for timeline links
  timelineLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate the target scroll position relative to the document top
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.scrollY;
        // Update the targetScrollY of your custom smooth scroll
        targetScrollY = targetPosition;
        // The custom smoothScrollLoop will now handle scrolling to this position
      }
    });
  });

  // Highlight active timeline link on scroll
  const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: "0px",
    threshold: 0.5, // 50% of the element is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const correspondingLink = document.querySelector(
        `.vertical-timeline a[href="#${entry.target.id}"]`
      );
      if (entry.isIntersecting) {
        // Remove active class from all links
        timelineLinks.forEach((link) => link.classList.remove("active"));
        // Add active class to the current link
        if (correspondingLink) {
          correspondingLink.classList.add("active");
        }
      } else {
        if (correspondingLink) {
          correspondingLink.classList.remove("active");
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  chapters.forEach((chapter) => {
    observer.observe(chapter);
  });
  let currentIndex = 0;
  const items = document.querySelectorAll(".fixedtop-timeline-item");

  function setActive(index) {
    items.forEach((item, i) => {
      item.classList.remove("active");
      document.getElementById("load-" + item.dataset.year).style.width = "0%";
      const progressBar = item.querySelector(".progress-bar-inner");
      if (progressBar) progressBar.style.width = "0%";
    });

    items[index].classList.add("active");
    document.getElementById("load-" + items[index].dataset.year).style.width =
      "50%";

    const activeProgressBar = items[index].querySelector(".progress-bar-inner");
    if (activeProgressBar) {
      activeProgressBar.style.width = "100%"; // Remplir la barre de progression
    }
  }

  items.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = index;
      setActive(index);
    });
  });

  // Créer la barre de progression pour chaque année
  items.forEach((item) => {
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar-inner");
    item.querySelector(".progress-bar").appendChild(progressBar);
  });

  // Initialiser avec le premier élément actif
  setActive(currentIndex);
});
