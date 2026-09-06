import { qs } from "../utils/dom.js";
import { setSortKey } from "../state.js";

// FEATURE: Destination Sorting
export function initSort() {
  qs("#sort-select").addEventListener("change", (e) => setSortKey(e.target.value));
}
