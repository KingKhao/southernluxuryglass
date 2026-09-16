import { buildMonthGrid } from "@/lib/calendar";

type EventItem = {
  id: string;
  title: string;
  date: Date;
  platformLink: string;
  platformName: string;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function EventSchedule({ events }: { events: EventItem[] }) {
  const today = new Date();
  const grid = buildMonthGrid(today, events.map((e) => e.date));

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
      <div className="rounded-lg border border-emerald/15 bg-white/60 p-5">
        <p className="mb-4 text-center font-serif text-lg text-emerald">
          {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-charcoal-muted">
          {WEEKDAYS.map((d, i) => (
            <div key={`${d}-${i}`} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day, i) => {
            const isToday = day.date.toDateString() === today.toDateString();
            return (
              <div
                key={i}
                className={[
                  "flex h-9 items-center justify-center rounded-full text-sm",
                  day.inCurrentMonth ? "text-charcoal" : "text-charcoal/35",
                  isToday ? "bg-emerald text-cream" : "",
                  day.hasEvent && !isToday ? "bg-gold/20 font-semibold text-emerald" : "",
                ].join(" ")}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-charcoal-muted">
          Highlighted days have a scheduled live show.
        </p>
      </div>

      <ul className="space-y-4">
        {events.length === 0 && (
          <li className="text-charcoal-muted">No upcoming live shows scheduled right now — check back soon!</li>
        )}
        {events.map((event) => (
          <li
            key={event.id}
            className="flex flex-col gap-3 rounded-lg border border-emerald/15 bg-white/60 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-serif text-lg text-emerald">{event.title}</p>
              <p className="text-sm text-charcoal-muted">
                {event.date.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                &middot;{" "}
                {event.date.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <a
              href={event.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block whitespace-nowrap rounded-full bg-emerald px-5 py-2 text-sm text-cream transition-colors hover:bg-emerald-dark"
            >
              Watch on {event.platformName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
