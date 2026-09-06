import { qs } from "./utils/dom.js";
import { state, subscribe, toggleFavorite, addToPlan } from "./state.js";

import { initSearch } from "./features/search.js";
import { initFilters, renderFilterChips } from "./features/filters.js";
import { initSort } from "./features/sort.js";
import { renderDiscoveryGrid } from "./features/discoveryGrid.js";
import { bindCardActions } from "./features/cards.js";
import { initDetailModal, openDetail } from "./features/details.js";
import { initFavoritesDrawer, renderFavorites } from "./features/favorites.js";
import { initPlanner, renderPlanner } from "./features/planner.js";
import { initRecommendationQuiz, renderRecommendations } from "./features/recommendations.js";

function renderAll() {
  renderFilterChips();
  renderDiscoveryGrid();
  renderRecommendations();
  renderFavorites();
  renderPlanner();
}

function init() {
  initSearch();
  initFilters();
  initSort();
  initDetailModal();
  initFavoritesDrawer();
  initPlanner();
  initRecommendationQuiz();

  // Delegated card actions work across the discovery grid AND the
  // recommendations grid since both use the same card markup.
  const actions = { onOpenDetail: openDetail, onToggleFavorite: toggleFavorite, onAddToPlan: (id) => addToPlan("day1", id) };
  bindCardActions(qs("#discovery-grid"), actions);
  bindCardActions(qs("#recommendations-grid"), actions);

  qs("#hero-start-btn").addEventListener("click", () => {
    qs("#recommend").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  subscribe(renderAll);
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
