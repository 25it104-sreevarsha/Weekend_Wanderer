import { qs, qsa } from "../utils/dom.js";
import { escapeHTML } from "../utils/sanitize.js";
import { state, getDestination, toggleFavorite, addToPlan } from "../state.js";

// FEATURE: Save / Favorite Destination
export function renderFavorites() {
  qs("#fav-count").textContent = state.favorites.size;
  qs("#fav-count").classList.toggle("show", state.favorites.size > 0);

  const list = qs("#favorites-list");
  if (state.favorites.size === 0) {
    list.innerHTML = '<p class="drawer-empty">Nothing saved yet — tap the heart on any destination to keep it here.</p>';
    return;
  }
  list.innerHTML = Array.from(state.favorites)
    .map((id) => getDestination(id))
    .filter(Boolean)
    .map(
      (d) => `
      <div class="drawer-item">
        <img src="${d.images[0]}" width="54" height="54" alt="${escapeHTML(d.name)}" loading="lazy" />
        <div>
          <div class="di-name">${escapeHTML(d.name)}</div>
          <div class="di-region">${escapeHTML(d.region)}</div>
        </div>
        <button class="di-plan" data-action="plan" data-id="${d.id}" aria-label="Add ${escapeHTML(d.name)} to weekend plan">+ Plan</button>
        <button class="di-remove" data-action="remove" data-id="${d.id}" aria-label="Remove ${escapeHTML(d.name)} from favorites">&times;</button>
      </div>`
    )
    .join("");
}

export function initFavoritesDrawer() {
  qs("#favorites-pill").addEventListener("click", () => {
    renderFavorites();
    qs("#favorites-drawer").classList.add("open");
    qs("#favorites-backdrop").classList.add("open");
  });
  const close = () => {
    qs("#favorites-drawer").classList.remove("open");
    qs("#favorites-backdrop").classList.remove("open");
  };
  qs("#favorites-close").addEventListener("click", close);
  qs("#favorites-backdrop").addEventListener("click", close);

  qs("#favorites-list").addEventListener("click", (e) => {
    const removeBtn = e.target.closest('[data-action="remove"]');
    if (removeBtn) toggleFavorite(removeBtn.dataset.id);
    const planBtn = e.target.closest('[data-action="plan"]');
    if (planBtn) addToPlan("day1", planBtn.dataset.id);
  });
}
