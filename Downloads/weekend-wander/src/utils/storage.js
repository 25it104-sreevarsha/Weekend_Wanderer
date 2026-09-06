// Thin, defensive wrapper around localStorage so a missing key, corrupted
// JSON, or a browser with storage disabled never throws into the app.
export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // storage unavailable/full — app continues without persistence
  }
}
