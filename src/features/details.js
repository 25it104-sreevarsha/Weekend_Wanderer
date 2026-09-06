import { qs, qsa } from "../utils/dom.js";
import { escapeHTML } from "../utils/sanitize.js";
import { getDestination, state, toggleFavorite, addToPlan } from "../state.js";

// FEATURE: Destination Details
let lastFocused = null;

export function openDetail(id) {
  const d = getDestination(id);
  if (!d) return;

  qs("#detail-region").textContent = d.region;
  qs("#detail-name").textContent = d.name;
  qs("#detail-tagline").textContent = d.tagline;
  qs("#detail-description").textContent = d.description;
  qs("#detail-best-time").textContent = `Best time to go: ${d.bestTime}`;
  qs("#detail-price").textContent = `₹${d.price.toLocaleString("en-IN")} approx.`;
  qs("#detail-rating").textContent = `★ ${d.rating}`;

  qs("#detail-gallery").innerHTML = d.images
    .map((src, i) => `<img src="${src}" width="900" height="700" alt="${escapeHTML(d.name)} view ${i + 1}" loading="lazy" />`)
    .join("");

  qs("#detail-tags").innerHTML = [d.pace, ...d.vibe, d.distanceLabel]
    .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
    .join("");

  qs("#detail-highlights").innerHTML = d.highlights.map((h) => `<li>${escapeHTML(h)}</li>`).join("");

  syncFavoriteButton(d.id);
  qs("#detail-add-day1").dataset.id = d.id;
  qs("#detail-add-day2").dataset.id = d.id;

  const backdrop = qs("#detail-backdrop");
  lastFocused = document.activeElement;
  backdrop.classList.add("open");
  qs("#detail-close").focus();
  document.addEventListener("keydown", trapFocus);
}

export function closeDetail() {
  qs("#detail-backdrop").classList.remove("open");
  document.removeEventListener("keydown", trapFocus);
  if (lastFocused) lastFocused.focus();
}

function syncFavoriteButton(id) {
  const btn = qs("#detail-favorite");
  const isFav = state.favorites.has(id);
  btn.dataset.id = id;
  btn.classList.toggle("saved", isFav);
  btn.setAttribute("aria-pressed", String(isFav));
  qs("span", btn).textContent = isFav ? "Saved to favorites" : "Save for later";
}

function trapFocus(e) {
  if (e.key === "Escape") {
    closeDetail();
    return;
  }
  if (e.key !== "Tab") return;
  const modal = qs("#detail-modal");
  const focusable = qsa('button, [href], input, [tabindex]:not([tabindex="-1"])', modal);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function initDetailModal() {
  qs("#detail-close").addEventListener("click", closeDetail);
  qs("#detail-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "detail-backdrop") closeDetail();
  });
  qs("#detail-favorite").addEventListener("click", () => {
    const id = qs("#detail-favorite").dataset.id;
    toggleFavorite(id);
    syncFavoriteButton(id);
  });
  qs("#detail-add-day1").addEventListener("click", () => addToPlan("day1", qs("#detail-add-day1").dataset.id));
  qs("#detail-add-day2").addEventListener("click", () => addToPlan("day2", qs("#detail-add-day2").dataset.id));
}
