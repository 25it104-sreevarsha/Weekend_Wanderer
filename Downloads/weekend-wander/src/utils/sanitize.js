// Escapes HTML-significant characters. Used on every piece of text that
// originates from user input (search query, etc.) before it is ever
// interpolated into innerHTML, to prevent DOM/HTML injection.
export function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
