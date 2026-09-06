# ESCAPE — Weekend Trip Planner

A frontend-only weekend-trip discovery and planning app. Search, filter, and
sort a set of destinations, get personalized recommendations from a short
quiz, save favorites, and build a day-by-day plan — all persisted locally,
no backend required.

## Mandatory features (explicitly implemented, one module each)

| Feature | Where it lives | Notes |
|---|---|---|
| **Destination Discovery & Cards** | `src/features/cards.js`, `src/features/discoveryGrid.js` | Grid of 15 mock destinations with image, name, region, tagline, price, rating, budget tag |
| **Destination Search** | `src/features/search.js` | Live, debounced search by name/region/tagline with a visible clear button and an aria-live result count |
| **Destination Filtering** | `src/features/filters.js` | Sidebar with mood / budget / distance checkboxes, combined with AND logic, active-filter chips, "clear filters" |
| **Destination Sorting** | `src/features/sort.js` | Sort by top rated, price (asc/desc), rating, or name — applies on top of current search + filters |
| **Destination Details** | `src/features/details.js` | Accessible modal: image gallery, full description, highlights, best time to go, price/rating, keyboard focus trap |
| **Save / Favorite Destination** | `src/features/favorites.js` | Heart toggle on every card and in the detail modal; dedicated Favorites drawer; persisted via `localStorage` |
| **Weekend Trip Planning** | `src/features/planner.js` | Day 1 / Day 2 itinerary builder — add from any card or the Favorites drawer, reorder with ↑/↓, remove; persisted via `localStorage` |
| **Personalized Destination Recommendations** | `src/features/recommendations.js` | Separate, clearly labeled "Recommended for you" section driven by a 3-question quiz, distinct from the main browse grid |

## Architecture

```
index.html                Semantic markup + landmarks for every feature
styles.css                Design system (tokens, components, responsive rules)
src/
  data.js                 Mock dataset (15 destinations)
  logic.js                Pure functions: search, filter, sort, scoring — no DOM, fully unit-testable
  state.js                Central store + pub/sub; every mutation goes through named actions
  main.js                 Wires feature modules together, drives re-render on state change
  features/
    search.js              Destination Search
    filters.js              Destination Filtering
    sort.js                 Destination Sorting
    cards.js                Shared card template + delegated event binding
    discoveryGrid.js        Destination Discovery & Cards (runs the search→filter→sort pipeline)
    details.js              Destination Details modal (incl. focus trap)
    favorites.js             Save / Favorite Destination
    planner.js               Weekend Trip Planning
    recommendations.js       Personalized Destination Recommendations
  utils/
    sanitize.js             escapeHTML() — used on every piece of user-influenced text before DOM insertion
    storage.js               Safe localStorage get/set with JSON + fallback
    debounce.js               Used on the search input
    dom.js                    qs/qsa helpers
tests/
  tests.html / tests.js / test-runner.js   Zero-dependency unit tests for src/logic.js and sanitize.js
  manual-test-cases.md                     UI/keyboard/persistence flows to re-check by hand
```

State flows one way: a UI event calls an action in `state.js` → the action
mutates state and persists what needs persisting → `notify()` fires →
`main.js`'s `renderAll()` re-renders every affected section. No feature
module reaches into another module's DOM directly.

## Non-functional requirements

- **Security / sanitization** — All user-influenced text (search query, any
  destination text rendered via template strings) passes through
  `escapeHTML()` before being interpolated into `innerHTML`, preventing
  HTML/DOM injection from the search box.
- **Accessibility** — Semantic landmarks (`header`, `nav`, `main`, `section`,
  `aside`, `footer`), a skip-to-content link, labeled form controls, ARIA on
  icon-only buttons (`aria-label`, `aria-pressed`), an `aria-live` result
  counter, keyboard-operable cards (`tabindex`, Enter/Space), and a focus
  trap + `Escape`-to-close on the detail modal, with focus restored to the
  triggering element on close.
- **Performance** — Images are lazy-loaded with explicit `width`/`height` to
  avoid layout shift, search input is debounced (250 ms) to avoid re-render
  churn on every keystroke, and there are no render-blocking scripts (the
  only external request is the Google Fonts stylesheet).
- **Responsiveness** — Breakpoints at 960px and 640px collapse the filter
  sidebar, grid, and planner columns down to mobile-friendly single columns.
- **Persistence** — Favorites and the weekend plan are saved to
  `localStorage` and survive a page refresh.

## Run locally

This project uses native ES modules (`<script type="module">`), which
browsers block from `file://` for security reasons — so serve it over HTTP:

```bash
cd escape-weekend-planner

# option A — Node
npx serve .

# option B — Python
python3 -m http.server 5500
```

Then open the printed URL (e.g. `http://localhost:5500`).

## Run the tests

With the app served locally (see above), open `tests/tests.html` in the
browser — it runs a small dependency-free test suite against `src/logic.js`
(search/filter/sort/recommendation scoring) and `escapeHTML()`, and prints a
pass/fail list on the page. `tests/manual-test-cases.md` lists the UI flows
(keyboard, persistence, modal focus) to check by hand.

## Deploy

### GitHub Pages
```bash
git init
git add .
git commit -m "ESCAPE — Weekend Trip Planner"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Then **Settings → Pages → Deploy from a branch → `main` / root**. Live in a
minute or two at `https://<your-username>.github.io/<repo-name>/`.

### Netlify
Drag the project folder onto **Add new site → Deploy manually** at
[app.netlify.com](https://app.netlify.com).

### Vercel
```bash
npm i -g vercel
vercel
```
No build command needed — it's fully static.

Any static host works the same way (Cloudflare Pages, Surge, Firebase
Hosting, S3 static website hosting) since there's no build step.

## Known limitations

- Photos are placeholders (picsum.photos); swap the `images` arrays in
  `src/data.js` for real photography in production.
- No routing — everything lives on a single page.
- Reordering in the planner uses ↑/↓ buttons rather than drag-and-drop, by
  design — it's keyboard-accessible without extra dependencies.
