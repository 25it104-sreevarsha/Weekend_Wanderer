import { qs } from "../utils/dom.js";
import { debounce } from "../utils/debounce.js";
import { setQuery } from "../state.js";

// FEATURE: Destination Search
export function initSearch() {
  const input = qs("#search-input");
  const clearBtn = qs("#search-clear");

  const onInput = debounce((value) => setQuery(value), 250);

  input.addEventListener("input", (e) => {
    clearBtn.hidden = e.target.value.length === 0;
    onInput(e.target.value);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.hidden = true;
    setQuery("");
    input.focus();
  });
}
