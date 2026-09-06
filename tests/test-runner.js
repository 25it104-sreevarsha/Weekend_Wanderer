// Tiny, dependency-free test runner. Renders pass/fail results into #results
// on tests.html. Kept intentionally simple since this project has no build
// step or package manager — this runs directly in the browser.
const results = [];

export function test(name, fn) {
  try {
    fn();
    results.push({ name, pass: true });
  } catch (err) {
    results.push({ name, pass: false, message: err.message });
  }
}

export function assertEqual(actual, expected, label = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${label ? label + ": " : ""}expected ${e}, got ${a}`);
  }
}

export function assertTrue(value, label = "") {
  if (!value) throw new Error(`${label ? label + ": " : ""}expected truthy value`);
}

export function renderResults(targetSelector) {
  const el = document.querySelector(targetSelector);
  const passed = results.filter((r) => r.pass).length;
  const summary = `<p><strong>${passed} / ${results.length} tests passed</strong></p>`;
  const list = results
    .map(
      (r) =>
        `<li class="${r.pass ? "pass" : "fail"}">${r.pass ? "✓" : "✗"} ${r.name}${r.message ? ` — ${r.message}` : ""}</li>`
    )
    .join("");
  el.innerHTML = summary + `<ul>${list}</ul>`;
}
