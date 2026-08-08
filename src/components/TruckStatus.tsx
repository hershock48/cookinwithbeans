import Link from "next/link";
import { mapsUrl, type TruckStatus } from "@/content/schedule";

/**
 * The single most important element on the site.
 * Answers "where is the truck right now" before anyone scrolls.
 *
 * Contrast note: this sits on turquoise, so all text is ink.
 * Never put white or lime type in here.
 */
export function StatusCard({ status }: { status: TruckStatus }) {
  const dot =
    status.state === "open"
      ? { color: "bg-lime", label: "Open right now", pulse: true }
      : status.state === "later"
        ? { color: "bg-vermillion", label: "Out later today", pulse: false }
        : status.state === "done"
          ? { color: "bg-ink/40", label: "Done for today", pulse: false }
          : { color: "bg-ink/40", label: "Off today", pulse: false };

  return (
    <div className="edge-4 stack-shadow bg-white">
      <div className="flex items-center gap-2.5 border-b-2 border-ink bg-ink px-4 py-2.5">
        <span className="relative flex h-3 w-3 shrink-0">
          {dot.pulse && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
          )}
          <span className={`relative inline-flex h-3 w-3 rounded-full ${dot.color}`} />
        </span>
        <span className="font-display text-xs uppercase tracking-[0.18em] text-white">
          {dot.label}
        </span>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-8">
        {(status.state === "open" || status.state === "later") && (
          <>
            <p className="font-display text-xs uppercase tracking-[0.16em] text-oxblood">
              {status.state === "open" ? "You can walk up now" : "Later today"}
            </p>
            <h2 className="mt-2 text-3xl leading-[0.95] text-ink sm:text-4xl lg:text-5xl">
              {status.stop.place}
            </h2>
            <p className="mt-2 text-lg font-semibold">
              {status.stop.city}
              <span className="mx-2 text-ink/40">·</span>
              {status.stop.startLabel} to {status.stop.endLabel}
            </p>

            {status.stop.access === "private" ? (
              <p className="edge mt-4 bg-cream-deep px-4 py-3 text-sm">
                <strong className="font-display uppercase tracking-wide">Heads up.</strong>{" "}
                This is a private site, so it is open to people who work there rather than
                the general public.{" "}
                {status.stop.note ? `${status.stop.note}.` : ""}
              </p>
            ) : (
              <>
                {status.stop.note && (
                  <p className="mt-3 text-base text-ink/80">{status.stop.note}</p>
                )}
                <a
                  href={mapsUrl(status.stop)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="edge mt-5 inline-flex items-center gap-2 bg-vermillion px-6 py-3.5 font-display uppercase tracking-wide text-white transition-colors hover:bg-vermillion-dark"
                >
                  Get directions
                  <span aria-hidden="true">→</span>
                </a>
              </>
            )}
          </>
        )}

        {(status.state === "done" || status.state === "off") && (
          <>
            <p className="font-display text-xs uppercase tracking-[0.16em] text-oxblood">
              Next stop
            </p>
            {status.nextDay && status.nextDay.stops[0] ? (
              <>
                <h2 className="mt-2 text-3xl leading-[0.95] text-ink sm:text-4xl lg:text-5xl">
                  Back {status.nextDay.dayName}
                </h2>
                <p className="mt-2 text-lg font-semibold">
                  {status.nextDay.stops[0].place}
                  <span className="mx-2 text-ink/40">·</span>
                  {status.nextDay.stops[0].startLabel}
                </p>
              </>
            ) : (
              <h2 className="mt-2 text-3xl leading-[0.95] text-ink sm:text-4xl">
                Check back soon
              </h2>
            )}
          </>
        )}

        <Link
          href="/schedule"
          className="mt-6 inline-block font-display text-sm uppercase tracking-wide text-oxblood underline decoration-2 underline-offset-4 hover:text-vermillion"
        >
          See the whole week →
        </Link>
      </div>
    </div>
  );
}
