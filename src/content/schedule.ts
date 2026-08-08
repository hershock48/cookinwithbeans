/**
 * ============================================================
 *  THE SCHEDULE — the most important file on this site
 * ============================================================
 *
 *  This is the whole reason the site exists. If it is wrong,
 *  people drive somewhere the truck is not, and that is worse
 *  than having no schedule at all.
 *
 *  TO UPDATE A WEEK:
 *  Edit `weeklyStops` below. Each entry is one stop.
 *    day    0=Sunday 1=Monday ... 6=Saturday
 *    start  24h clock, "07:00"
 *    end    24h clock, "10:00"
 *    access "public"   anyone can walk up
 *           "private"  employees or badge holders only
 *
 *  Put anything that is not a normal week (festivals, one-off
 *  bookings, closures) in `specialDates`. Those override the
 *  weekly stops for that date.
 *
 *  TODO:CONFIRM every stop below is reconstructed from their
 *  Facebook posts and is almost certainly out of date. Replace
 *  with the owners' current week before launch.
 * ============================================================
 */

export type Access = "public" | "private";

export type Stop = {
  id: string;
  day: number;
  start: string;
  end: string;
  place: string;
  city: string;
  access: Access;
  note?: string;
  mapQuery?: string;
};

export type SpecialDate = {
  date: string; // YYYY-MM-DD
  place: string;
  city: string;
  start: string;
  end: string;
  access: Access;
  note?: string;
  closed?: boolean;
};

export const weeklyStops: Stop[] = [
  {
    id: "mon-blueoval",
    day: 1,
    start: "07:00",
    end: "10:00",
    place: "Ford BlueOval Battery Park",
    city: "Marshall",
    access: "private",
    note: "Breakfast shift for crews on site",
  },
  {
    id: "mon-viking",
    day: 1,
    start: "11:00",
    end: "13:00",
    place: "Viking-Cives",
    city: "Marshall",
    access: "private",
    note: "Lunch for the plant",
  },
  {
    id: "tue-dla",
    day: 2,
    start: "11:00",
    end: "13:00",
    place: "Defense Logistics Agency",
    city: "Battle Creek",
    access: "private",
    note: "Federal campus, badge holders only",
  },
  {
    id: "wed-horrocks",
    day: 3,
    start: "17:00",
    end: "20:00",
    place: "Horrocks Farm Market",
    city: "Battle Creek",
    access: "public",
    mapQuery: "Horrocks Farm Market Battle Creek MI",
  },
  {
    id: "thu-ace",
    day: 4,
    start: "16:00",
    end: "19:00",
    place: "Darling Ace Hardware",
    city: "Marshall",
    access: "public",
    mapQuery: "Darling Ace Hardware Marshall MI",
  },
  {
    id: "fri-stagecoach",
    day: 5,
    start: "17:00",
    end: "20:00",
    place: "The Stagecoach Inn",
    city: "Marshall",
    access: "public",
    note: "Live music on the patio",
    mapQuery: "Stagecoach Inn Marshall MI",
  },
  {
    id: "sat-downtown",
    day: 6,
    start: "11:00",
    end: "15:00",
    place: "Downtown Marshall",
    city: "Marshall",
    access: "public",
    note: "On the Fountain Circle end of Michigan Ave",
    mapQuery: "Brooks Memorial Fountain Marshall MI",
  },
];

export const specialDates: SpecialDate[] = [
  // Example of a one-off. Delete or replace.
  // {
  //   date: "2026-09-05",
  //   place: "Calhoun County Fairgrounds",
  //   city: "Marshall",
  //   start: "11:00",
  //   end: "19:00",
  //   access: "public",
  //   note: "Taco Festival",
  // },
];

/* ============================================================
   Resolver. Nothing below here needs editing.
   ============================================================ */

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const TIMEZONE = "America/Detroit";

export type ResolvedStop = {
  id: string;
  place: string;
  city: string;
  start: string;
  end: string;
  access: Access;
  note?: string;
  mapQuery?: string;
  startLabel: string;
  endLabel: string;
};

export type DaySchedule = {
  day: number;
  dayName: string;
  dateISO: string;
  stops: ResolvedStop[];
  closed: boolean;
};

/** Current date parts in the truck's timezone, not the server's. */
export function nowInMichigan(): { y: number; m: number; d: number; minutes: number; day: number } {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    parts.weekday as string,
  );
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    day: dayIndex,
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function timeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

function resolve(s: Stop | SpecialDate, id: string): ResolvedStop {
  return {
    id,
    place: s.place,
    city: s.city,
    start: s.start,
    end: s.end,
    access: s.access,
    note: s.note,
    mapQuery: "mapQuery" in s ? s.mapQuery : undefined,
    startLabel: timeLabel(s.start),
    endLabel: timeLabel(s.end),
  };
}

function isoFor(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** The next seven days starting today, in Michigan time. */
export function getWeek(): DaySchedule[] {
  const { y, m, d, day } = nowInMichigan();
  const base = Date.UTC(y, m - 1, d);
  const out: DaySchedule[] = [];

  for (let i = 0; i < 7; i++) {
    const dt = new Date(base + i * 86400000);
    const dayIdx = (day + i) % 7;
    const iso = isoFor(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());

    const specials = specialDates.filter((s) => s.date === iso);
    if (specials.length > 0) {
      const closed = specials.every((s) => s.closed);
      out.push({
        day: dayIdx,
        dayName: DAY_NAMES[dayIdx],
        dateISO: iso,
        closed,
        stops: closed
          ? []
          : specials
              .filter((s) => !s.closed)
              .map((s, n) => resolve(s, `${iso}-special-${n}`)),
      });
      continue;
    }

    const stops = weeklyStops
      .filter((s) => s.day === dayIdx)
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
      .map((s) => resolve(s, s.id));

    out.push({
      day: dayIdx,
      dayName: DAY_NAMES[dayIdx],
      dateISO: iso,
      stops,
      closed: stops.length === 0,
    });
  }
  return out;
}

export type TruckStatus =
  | { state: "open"; stop: ResolvedStop; until: string }
  | { state: "later"; stop: ResolvedStop; from: string }
  | { state: "done"; nextDay: DaySchedule | null }
  | { state: "off"; nextDay: DaySchedule | null };

/** Where is the truck right now. */
export function getStatus(): TruckStatus {
  const { minutes } = nowInMichigan();
  const week = getWeek();
  const today = week[0];

  const nextOpenDay = week.slice(1).find((d) => d.stops.length > 0) ?? null;

  if (today.stops.length === 0) {
    return { state: "off", nextDay: nextOpenDay };
  }

  const live = today.stops.find(
    (s) => minutes >= toMinutes(s.start) && minutes < toMinutes(s.end),
  );
  if (live) return { state: "open", stop: live, until: live.endLabel };

  const upcoming = today.stops.find((s) => minutes < toMinutes(s.start));
  if (upcoming) return { state: "later", stop: upcoming, from: upcoming.startLabel };

  return { state: "done", nextDay: nextOpenDay };
}

export function mapsUrl(stop: ResolvedStop): string {
  const q = stop.mapQuery ?? `${stop.place} ${stop.city} MI`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
