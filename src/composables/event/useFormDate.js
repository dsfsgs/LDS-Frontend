const pad = (n) => String(n).padStart(2, "0");

// "2026-11-12 17:00" -> "2026-11-12 05:00 PM"  (Y-m-d h:i A, para sa backend)
export function formatFormDate(value) {
  if (!value) return "";
  const m = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})$/);
  if (!m) return "";
  let h = Number(m[2]);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${m[1]} ${pad(h)}:${m[3]} ${period}`;
}

// galing backend ("2026-11-12 05:00 PM" o ISO) -> "2026-11-12 17:00" (para sa q-date/q-time)
export function parseFormDate(value) {
  if (!value) return null;
  const m = String(value)
    .trim()
    .match(/^(\d{4}-\d{2}-\d{2})[T\s]+(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\s*(AM|PM)?$/i);
  if (!m) return null;
  let h = Number(m[2]);
  const p = m[4]?.toUpperCase();
  if (p === "PM" && h !== 12) h += 12;
  if (p === "AM" && h === 12) h = 0;
  return `${m[1]} ${pad(h)}:${m[3]}`;
}