import { qs } from "../utils/dom.js";
import { escapeHTML } from "../utils/sanitize.js";
import { state } from "../state.js";
import { runDiscoveryPipeline } from "../logic.js";
import { cardHTML } from "./cards.js";

export function renderDiscoveryGrid() {
  const grid = qs("#discovery-grid");
  const results = runDiscoveryPipeline(state.destinations, {
    query: state.query,
    filters: state.filters,
    sortKey: state.sortKey,
  });

  qs("#result-count").textContent = `${results.length} destination${results.length === 1 ? "" : "s"} found`;

  if (results.length === 0) {
    grid.innerHTML = `<p class="empty-state">No destinations match "${escapeHTML(state.query)}" with the current filters. Try clearing a filter or a different search term.</p>`;
    return;
  }
  grid.innerHTML = results.map((d) => cardHTML(d)).join("");
}
