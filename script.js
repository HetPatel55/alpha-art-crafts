// ===== back to top =====
// Explicit scroll (rather than relying on the native #top anchor jump,
// which sticky-positioned headers can make unreliable) so this always works.
document.getElementById("backToTop").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
});

// ===== mobile nav =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("mobile-open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("mobile-open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ===== footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== gallery filters =====
const filterPills = Array.from(document.querySelectorAll(".filter-pill"));
const figures = Array.from(document.querySelectorAll("#grid figure"));
const emptyState = document.getElementById("emptyState");

function applyFilter(filter) {
  let visibleCount = 0;
  figures.forEach((fig) => {
    const match = filter === "all" || fig.dataset.category === filter;
    fig.classList.toggle("filtered-out", !match);
    if (match) visibleCount++;
  });
  emptyState.hidden = visibleCount > 0;
}

function selectFilter(filter) {
  const pill = document.querySelector(`.filter-pill[data-filter="${filter}"]`);
  if (!pill) return;
  filterPills.forEach((p) => {
    p.classList.remove("active");
    p.setAttribute("aria-selected", "false");
  });
  pill.classList.add("active");
  pill.setAttribute("aria-selected", "true");
  applyFilter(filter);
}

filterPills.forEach((pill) => {
  pill.addEventListener("click", () => selectFilter(pill.dataset.filter));
});

// footer quick-links jump to the gallery pre-filtered to that category
document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => selectFilter(link.dataset.filterLink));
});

// ===== lightbox (only cycles through currently visible/filtered images) =====
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let current = -1;

function visibleImages() {
  return figures
    .filter((fig) => !fig.classList.contains("filtered-out"))
    .map((fig) => fig.querySelector("img"));
}

function show(index) {
  const imgs = visibleImages();
  if (!imgs.length) return;
  current = (index + imgs.length) % imgs.length;
  const img = imgs[current];
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function close() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lbImg.src = "";
}

figures.forEach((fig) => {
  fig.addEventListener("click", () => {
    const imgs = visibleImages();
    const img = fig.querySelector("img");
    show(imgs.indexOf(img));
  });
});

lbClose.addEventListener("click", close);
lbPrev.addEventListener("click", () => show(current - 1));
lbNext.addEventListener("click", () => show(current + 1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) close();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// basic swipe support
let touchX = null;
lightbox.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });
