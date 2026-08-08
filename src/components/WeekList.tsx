import { mapsUrl, type DaySchedule } from "@/content/schedule";

export function WeekList({ week }: { week: DaySchedule[] }) {
  return (
    <ol className="edge-4 bg-white">
      {week.map((day, i) => (
        <li
          key={day.dateISO}
          className={`grid gap-0 sm:grid-cols-[190px_1fr] ${
            i < week.length - 1 ? "border-b-2 border-ink" : ""
          } ${i === 0 ? "bg-lime/25" : ""}`}
        >
          <div
            className={`flex items-baseline gap-2 border-ink px-5 py-4 sm:block sm:border-r-2 ${
              i === 0 ? "bg-ink text-lime" : "bg-cream-deep text-ink"
            }`}
          >
            <span className="font-display text-xl uppercase leading-none sm:text-2xl">
              {i === 0 ? "Today" : day.dayName}
            </span>
            <span
              className={`font-display text-[11px] uppercase tracking-[0.14em] sm:mt-1.5 sm:block ${
                i === 0 ? "text-lime/80" : "text-ink/60"
              }`}
            >
              {i === 0 ? day.dayName : formatShort(day.dateISO)}
            </span>
          </div>

          <div className="px-5 py-4">
            {day.stops.length === 0 ? (
              <p className="py-1 text-base text-ink/55">
                No stop posted. Catering days often land here, so it is worth asking.
              </p>
            ) : (
              <ul className="space-y-4">
                {day.stops.map((stop) => (
                  <li key={stop.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-lg uppercase leading-tight">
                      {stop.place}
                    </span>
                    <span className="text-sm font-semibold text-ink/70">{stop.city}</span>
                    <span className="edge bg-cream px-2 py-0.5 text-sm font-bold tabular-nums">
                      {stop.startLabel} – {stop.endLabel}
                    </span>
                    {stop.access === "private" ? (
                      <span className="edge bg-cream-deep px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
                        Employees only
                      </span>
                    ) : (
                      <a
                        href={mapsUrl(stop)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-oxblood underline decoration-2 underline-offset-4 hover:text-vermillion"
                      >
                        Directions
                      </a>
                    )}
                    {stop.note && (
                      <span className="w-full text-sm text-ink/70">{stop.note}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
