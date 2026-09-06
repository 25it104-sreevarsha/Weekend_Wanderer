import { escapeHTML } from "../utils/sanitize.js";
import { state } from "../state.js";

const BUDGET_LABEL = {
  budget: "Budget-friendly",
  mid: "Mid-range",
  splurge: "Splurge",
};

// FEATURE: Destination Discovery & Cards
// Shared markup used by the main grid, Recommended panel, and Favorites drawer.
export function cardHTML(d, { matchPct = null } = {}) {
  const isFav = state.favorites.has(d.id);

  return `
    <article class="card" data-id="${escapeHTML(String(d.id))}">
      <div class="card-img">
        <img
          src="${escapeHTML(d.images[0])}"
          width="900"
          height="700"
          alt="${escapeHTML(d.name)}, ${escapeHTML(d.region)}"
          loading="lazy"
        />
        ${
          matchPct !== null
            ? `<span class="match-badge" aria-label="${matchPct}% recommendation match">${matchPct}% match</span>`
            : ""
        }

        <button
          type="button"
          class="heart ${isFav ? "saved" : ""}"
          data-action="favorite"
          data-id="${escapeHTML(String(d.id))}"
          aria-pressed="${isFav}"
          aria-label="${isFav ? "Remove" : "Save"} ${escapeHTML(d.name)} ${isFav ? "from" : "to"} favorites"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-10-9.1C.4 8.5 2.2 4.8 6 4.4c2-.2 3.7.8 6 3 2.3-2.2 4-3.2 6-3 3.8.4 5.6 4.1 4 7.5C19.5 16.4 12 21 12 21z"/>
          </svg>
        </button>
      </div>

      <div class="card-body">
        <div class="card-region">${escapeHTML(d.region)}</div>
        <h3 class="card-name">${escapeHTML(d.name)}</h3>
        <p class="card-tagline">${escapeHTML(d.tagline)}</p>

        <div class="card-meta">
          <span>✈ ${escapeHTML(d.distanceLabel)}</span>
          <span>₹${Number(d.price).toLocaleString("en-IN")}</span>
          <span>★ ${escapeHTML(String(d.rating))}</span>
        </div>

        <div class="card-meta">
          <span>${escapeHTML(BUDGET_LABEL[d.budget] || d.budget)}</span>
        </div>

        <div class="card-actions">
          <button
            type="button"
            class="btn-ghost btn-details"
            data-action="details"
            data-id="${escapeHTML(String(d.id))}"
            aria-label="View details for ${escapeHTML(d.name)}"
          >
            View details
          </button>

          <button
            type="button"
            class="btn-add-plan"
            data-action="add-plan"
            data-id="${escapeHTML(String(d.id))}"
            aria-label="Add ${escapeHTML(d.name)} to Day 1 of the weekend plan"
          >
            + Add to weekend plan
          </button>
        </div>
      </div>
    </article>
  `;
}

// Delegated event binding — works for any container re-rendered with cardHTML.
export function bindCardActions(
  container,
  { onOpenDetail, onToggleFavorite, onAddToPlan }
) {
  if (!container) return;

  container.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const favBtn = target.closest('[data-action="favorite"]');
    if (favBtn) {
      e.stopPropagation();
      onToggleFavorite(favBtn.dataset.id);
      return;
    }

    const planBtn = target.closest('[data-action="add-plan"]');
    if (planBtn) {
      e.stopPropagation();
      onAddToPlan(planBtn.dataset.id);
      return;
    }

    const detailsBtn = target.closest('[data-action="details"]');
    if (detailsBtn) {
      e.stopPropagation();
      onOpenDetail(detailsBtn.dataset.id);
      return;
    }

    // Keep the whole card discoverable/clickable with a mouse,
    // while the actual interactive controls remain real buttons.
    const card = target.closest(".card");
    if (card && target === card) {
      onOpenDetail(card.dataset.id);
    }
  });
}
