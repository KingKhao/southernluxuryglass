// Builds a minimal RFC 5545 .ics file as a data: URI, so "Add to calendar"
// works with a plain <a download> link — no server round-trip, no library.
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsDate(date: Date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

// Calendar text fields need CRLF line breaks and certain characters escaped.
function escapeIcsText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildEventIcsDataUrl({
  uid,
  title,
  start,
  durationMinutes = 60,
  description,
  url,
}: {
  uid: string;
  title: string;
  start: Date;
  durationMinutes?: number;
  description?: string;
  url?: string;
}) {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Southern Luxury Glass//Live Show//EN",
    "BEGIN:VEVENT",
    `UID:${uid}@southernluxuryglass.vercel.app`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    description ? `DESCRIPTION:${escapeIcsText(description)}` : null,
    url ? `URL:${url}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
