import { DESTINATIONS } from "./data.js";
import { getJSON, setJSON } from "./utils/storage.js";

const FAVORITES_KEY = "escape:favorites";
const PLAN_KEY = "escape:plan";

// Central store. Kept intentionally small and explicit rather than a full
// framework — every feature module mutates it through the exported actions
// below, and calls notify() so main.js can re-render.
export const state = {
  destinations: DESTINATIONS,
  query: "",
  filters: { vibe: new Set(), budget: new Set(), distance: new Set() },
  sortKey: "recommended",
  favorites: new Set(getJSON(FAVORITES_KEY, [])),
  plan: getJSON(PLAN_KEY, { day1: [], day2: [] }),
  quizAnswers: { vibe: null, pace: null, distance: null },
};

const listeners = new Set();
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify() {
  listeners.forEach((fn) => fn(state));
}

// ---- Search ----
export function setQuery(q) {
  state.query = q;
  notify();
}

// ---- Filtering ----
export function toggleFilter(group, value) {
  const set = state.filters[group];
  set.has(value) ? set.delete(value) : set.add(value);
  notify();
}
export function clearFilters() {
  state.filters.vibe.clear();
  state.filters.budget.clear();
  state.filters.distance.clear();
  notify();
}
export function activeFilterCount() {
  return state.filters.vibe.size + state.filters.budget.size + state.filters.distance.size;
}

// ---- Sorting ----
export function setSortKey(key) {
  state.sortKey = key;
  notify();
}

// ---- Favorites ----
export function toggleFavorite(id) {
  state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
  setJSON(FAVORITES_KEY, Array.from(state.favorites));
  notify();
}

// ---- Weekend Planner ----
export function addToPlan(day, id) {
  if (!state.plan[day].includes(id)) state.plan[day].push(id);
  setJSON(PLAN_KEY, state.plan);
  notify();
}
export function removeFromPlan(day, id) {
  state.plan[day] = state.plan[day].filter((x) => x !== id);
  setJSON(PLAN_KEY, state.plan);
  notify();
}
export function reorderPlan(day, index, direction) {
  const arr = state.plan[day];
  const target = index + direction;
  if (target < 0 || target >= arr.length) return;
  [arr[index], arr[target]] = [arr[target], arr[index]];
  setJSON(PLAN_KEY, state.plan);
  notify();
}

// ---- Recommendation quiz ----
export function setQuizAnswer(key, value) {
  state.quizAnswers[key] = value;
  notify();
}
export function resetQuiz() {
  state.quizAnswers = { vibe: null, pace: null, distance: null };
  notify();
}

export function getDestination(id) {
  return state.destinations.find((d) => d.id === id);
}
