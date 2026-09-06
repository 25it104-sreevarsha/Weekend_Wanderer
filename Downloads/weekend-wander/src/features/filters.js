import { qs, qsa } from "../utils/dom.js";
import { state, toggleFilter, clearFilters, activeFilterCount } from "../state.js";
import { escapeHTML } from "../utils/sanitize.js";

// FEATURE: Destination Filtering
const LABELS = {
  vibe: { chill: "Chill", adventure: "Adventure", culture: "Culture", nightlife: "Nightlife" },
  budget: { budget: "Budget-friendly", mid: "Mid-range", splurge: "Splurge" },
  distance: { near: "Under 4 hrs", medium: "4–10 hrs", far: "Worth a flight" },
};

export function initFilters() {
  qsa("#filter-panel input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      toggleFilter(cb.dataset.group, cb.value);
    });
  });

  qs("#clear-filters").addEventListener("click", () => {
    qsa("#filter-panel input[type=checkbox]").forEach((cb) => (cb.checked = false));
    clearFilters();
  });
}

export function renderFilterChips() {
  const chipsEl = qs("#active-filter-chips");
  const count = activeFilterCount();
  qs("#clear-filters").hidden = count === 0;

  const chips = [];
  ["vibe", "budget", "distance"].forEach((group) => {
    state.filters[group].forEach((value) => {
      chips.push(`<span class="filter-chip" data-group="${group}" data-value="${value}">${escapeHTML(LABELS[group][value] || value)} <button aria-label="Remove filter ${escapeHTML(LABELS[group][value])}">&times;</button></span>`);
    });
  });
  chipsEl.innerHTML = chips.join("");

  qsa(".filter-chip button", chipsEl).forEach((btn) => {
    btn.addEventListener("click", () => {
      const chip = btn.closest(".filter-chip");
      const cb = qs(`#filter-panel input[data-group="${chip.dataset.group}"][value="${chip.dataset.value}"]`);
      if (cb) cb.checked = false;
      toggleFilter(chip.dataset.group, chip.dataset.value);
    });
  });
}
