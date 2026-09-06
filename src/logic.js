// Pure functions only — no DOM access — so these can be unit tested in
// isolation (see /tests/tests.html) and reused by both the browse grid and
// the recommendations panel.

export function searchDestinations(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
  );
}

export function filterDestinations(list, filters) {
  return list.filter((d) => {
    const vibeOk = filters.vibe.size === 0 || d.vibe.some((v) => filters.vibe.has(v));
    const budgetOk = filters.budget.size === 0 || filters.budget.has(d.budget);
    const distanceOk = filters.distance.size === 0 || filters.distance.has(d.distance);
    return vibeOk && budgetOk && distanceOk;
  });
}

const SORTERS = {
  recommended: (a, b) => b.rating - a.rating,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
};
export function sortDestinations(list, key) {
  const sorter = SORTERS[key] || SORTERS.recommended;
  return [...list].sort(sorter);
}

// Search -> Filter -> Sort pipeline used by the main Destination Discovery grid.
export function runDiscoveryPipeline(list, { query, filters, sortKey }) {
  const searched = searchDestinations(list, query);
  const filtered = filterDestinations(searched, filters);
  return sortDestinations(filtered, sortKey);
}

// Scores a destination against quiz answers for Personalized Recommendations.
// Mood match counts double; pace and distance count once each.
export function scoreDestination(dest, answers) {
  let score = 0;
  if (answers.vibe && dest.vibe.includes(answers.vibe)) score += 2;
  if (answers.pace && dest.pace === answers.pace) score += 1;
  if (answers.distance && dest.distance === answers.distance) score += 1;
  return score;
}

export function getRecommendations(list, answers, limit = 3) {
  return list
    .map((d) => ({ dest: d, score: scoreDestination(d, answers) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
