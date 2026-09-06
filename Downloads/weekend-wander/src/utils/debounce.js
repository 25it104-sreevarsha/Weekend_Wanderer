// Delays invoking fn until `wait` ms have passed since the last call.
// Used on the search input so we don't re-filter/re-render on every keystroke.
export function debounce(fn, wait = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
