import { qsa } from "../utils/dom.js";
import { escapeHTML } from "../utils/sanitize.js";
import { state } from "../state.js";

const BUDGET_LABEL = { budget: "Budget-friendly", mid: "Mid-range", splurge: "Splurge" };

// FEATURE: Destination Discovery & Cards
// Shared markup used by the main grid, the Recommended panel, and the
// Favorites drawer so a destination looks and behaves the same everywhere.
export function cardHTML(d, { matchPct = null } = {}) {
  const isFav = state.favorites.has(d.id);
  return `
    <article class="card" data-id="${d.id}" tabindex="0" role="button"
      aria-label="View details for ${escapeHTML(d.name)}">
      <div class="card-img">
        <img src="${d.images[0]}" width="900" height="700" alt="${escapeHTML(d.name)}, ${escapeHTML(d.region)}" loading="lazy" />
        ${matchPct !== null ? `<span class="match-badge">${matchPct}% match</span>` : ""}
        <button class="heart ${isFav ? "saved" : ""}" data-action="favorite" data-id="${d.id}"
          aria-pressed="${isFav}" aria-label="${isFav ? "Remove" : "Save"} ${escapeHTML(d.name)} from favorites">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.1C.4 8.5 2.2 4.8 6 4.4c2-.2 3.7.8 6 3 2.3-2.2 4-3.2 6-3 3.8.4 5.6 4.1 4 7.5C19.5 16.4 12 21 12 21z"/></svg>
        </button>
      </div>
      <div class="card-body">
        <div class="card-region">${escapeHTML(d.region)}</div>
        <h3 class="card-name">${escapeHTML(d.name)}</h3>
        <p class="card-tagline">${escapeHTML(d.tagline)}</p>
        <div class="card-meta">
          <span>✈ ${escapeHTML(d.distanceLabel)}</span>
          <span>₹${d.price.toLocaleString("en-IN")}</span>
          <span>★ ${d.rating}</span>
        </div>
        <div class="card-meta">
          <span>${BUDGET_LABEL[d.budget]}</span>
        </div>
        <button class="btn-add-plan" data-action="add-plan" data-id="${d.id}">+ Add to weekend plan</button>
      </div>
    </article>
  `;
}

// Delegated event binding — works for any container re-rendered with cardHTML.
export function bindCardActions(container, { onOpenDetail, onToggleFavorite, onAddToPlan }) {
  container.addEventListener("click", (e) => {
    const favBtn = e.target.closest('[data-action="favorite"]');
    if (favBtn) {
      e.stopPropagation();
      onToggleFavorite(favBtn.dataset.id);
      return;
    }
    const planBtn = e.target.closest('[data-action="add-plan"]');
    if (planBtn) {
      e.stopPropagation();
      onAddToPlan(planBtn.dataset.id);
      return;
    }
    const card = e.target.closest(".card");
    if (card) onOpenDetail(card.dataset.id);
  });

  container.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (card && e.target === card) {
      e.preventDefault();
      onOpenDetail(card.dataset.id);
    }
  });
}
