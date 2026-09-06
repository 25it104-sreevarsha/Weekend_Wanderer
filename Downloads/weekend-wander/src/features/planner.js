import { qs } from "../utils/dom.js";
import { escapeHTML } from "../utils/sanitize.js";
import { state, getDestination, removeFromPlan, reorderPlan } from "../state.js";

// FEATURE: Weekend Trip Planning
function dayListHTML(day) {
  const ids = state.plan[day];
  if (ids.length === 0) {
    return '<li class="plan-empty">No stops yet — use "Add to weekend plan" on any destination card.</li>';
  }
  return ids
    .map((id, i) => {
      const d = getDestination(id);
      if (!d) return "";
      return `
        <li class="plan-item">
          <img src="${d.images[0]}" width="44" height="44" alt="" loading="lazy" />
          <span class="plan-name">${escapeHTML(d.name)}</span>
          <span class="plan-controls">
            <button data-day="${day}" data-index="${i}" data-dir="-1" aria-label="Move ${escapeHTML(d.name)} earlier" ${i === 0 ? "disabled" : ""}>↑</button>
            <button data-day="${day}" data-index="${i}" data-dir="1" aria-label="Move ${escapeHTML(d.name)} later" ${i === ids.length - 1 ? "disabled" : ""}>↓</button>
            <button data-day="${day}" data-remove="${d.id}" aria-label="Remove ${escapeHTML(d.name)} from plan">&times;</button>
          </span>
        </li>`;
    })
    .join("");
}

export function renderPlanner() {
  qs("#plan-day1-list").innerHTML = dayListHTML("day1");
  qs("#plan-day2-list").innerHTML = dayListHTML("day2");
  const total = state.plan.day1.length + state.plan.day2.length;
  qs("#plan-summary").textContent =
    total === 0 ? "Your weekend is empty so far." : `${total} stop${total === 1 ? "" : "s"} planned across the weekend.`;
}

export function initPlanner() {
  qs("#planner").addEventListener("click", (e) => {
    const moveBtn = e.target.closest("button[data-dir]");
    if (moveBtn) {
      reorderPlan(moveBtn.dataset.day, Number(moveBtn.dataset.index), Number(moveBtn.dataset.dir));
      return;
    }
    const removeBtn = e.target.closest("button[data-remove]");
    if (removeBtn) removeFromPlan(removeBtn.dataset.day, removeBtn.dataset.remove);
  });
}
