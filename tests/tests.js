import { test, assertEqual, assertTrue, renderResults } from "./test-runner.js";
import {
  searchDestinations,
  filterDestinations,
  sortDestinations,
  runDiscoveryPipeline,
  scoreDestination,
  getRecommendations,
} from "../src/logic.js";
import { escapeHTML } from "../src/utils/sanitize.js";

const sample = [
  { id: "a", name: "Alpha Bay", region: "North", vibe: ["chill"], pace: "slow", distance: "near", budget: "budget", price: 100, rating: 4.1 },
  { id: "b", name: "Beta Hills", region: "South", vibe: ["adventure"], pace: "packed", distance: "far", budget: "splurge", price: 500, rating: 4.8 },
  { id: "c", name: "Gamma Town", region: "North", vibe: ["chill", "culture"], pace: "balanced", distance: "medium", budget: "mid", price: 300, rating: 4.4 },
];
const emptyFilters = { vibe: new Set(), budget: new Set(), distance: new Set() };

test("searchDestinations: empty query returns full list", () => {
  assertEqual(searchDestinations(sample, "").length, 3);
});

test("searchDestinations: matches by name, case-insensitive", () => {
  const res = searchDestinations(sample, "beta");
  assertEqual(res.map((d) => d.id), ["b"]);
});

test("searchDestinations: matches by region", () => {
  const res = searchDestinations(sample, "north");
  assertEqual(res.map((d) => d.id).sort(), ["a", "c"]);
});

test("filterDestinations: no filters selected returns all", () => {
  assertEqual(filterDestinations(sample, emptyFilters).length, 3);
});

test("filterDestinations: vibe filter narrows results", () => {
  const filters = { vibe: new Set(["adventure"]), budget: new Set(), distance: new Set() };
  assertEqual(filterDestinations(sample, filters).map((d) => d.id), ["b"]);
});

test("filterDestinations: combined filters use AND logic", () => {
  const filters = { vibe: new Set(["chill"]), budget: new Set(["mid"]), distance: new Set() };
  assertEqual(filterDestinations(sample, filters).map((d) => d.id), ["c"]);
});

test("sortDestinations: price ascending", () => {
  assertEqual(sortDestinations(sample, "price-asc").map((d) => d.id), ["a", "c", "b"]);
});

test("sortDestinations: price descending", () => {
  assertEqual(sortDestinations(sample, "price-desc").map((d) => d.id), ["b", "c", "a"]);
});

test("sortDestinations: name ascending", () => {
  assertEqual(sortDestinations(sample, "name-asc").map((d) => d.id), ["a", "b", "c"]);
});

test("runDiscoveryPipeline: search + filter + sort compose correctly", () => {
  const result = runDiscoveryPipeline(sample, {
    query: "",
    filters: { vibe: new Set(["chill"]), budget: new Set(), distance: new Set() },
    sortKey: "price-desc",
  });
  assertEqual(result.map((d) => d.id), ["c", "a"]);
});

test("scoreDestination: mood match worth more than pace/distance", () => {
  const dest = { vibe: ["chill"], pace: "slow", distance: "near" };
  assertTrue(scoreDestination(dest, { vibe: "chill", pace: null, distance: null }) === 2);
  assertTrue(scoreDestination(dest, { vibe: null, pace: "slow", distance: null }) === 1);
});

test("getRecommendations: ranks and limits results", () => {
  const answers = { vibe: "chill", pace: null, distance: null };
  const recs = getRecommendations(sample, answers, 1);
  assertEqual(recs.length, 1);
  assertTrue(["a", "c"].includes(recs[0].dest.id));
});

test("getRecommendations: returns nothing for no answers", () => {
  assertEqual(getRecommendations(sample, { vibe: null, pace: null, distance: null }).length, 0);
});

test("escapeHTML: neutralizes script tags", () => {
  const out = escapeHTML('<script>alert(1)</script>');
  assertTrue(!out.includes("<script>"));
});

test("escapeHTML: escapes quotes used in attribute injection", () => {
  const out = escapeHTML(`"><img src=x onerror=alert(1)>`);
  assertTrue(!out.includes('"') && !out.includes("<img"));
});

renderResults("#results");
