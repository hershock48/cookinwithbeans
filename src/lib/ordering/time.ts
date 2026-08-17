// The ordering window follows the truck, not a clock on a wall.
//
// Copper's version of this file opens and closes by fixed venue hours. A food
// truck has no fixed hours: it has stops. So the window derives from the same
// schedule the whole site runs on (src/content/schedule.ts): ordering is open
// while a stop is live, and closed with an honest reason the rest of the
// time. No preordering before the truck parks, on purpose -- the kitchen is
// not there yet, and an order with nobody to cook it is a complaint with a
// timestamp.
//
// ORDERING_DEMO_ALWAYS_OPEN=1 overrides for pitching outside stop hours, same
// convention as the Copper build; remove it at go-live.

import { getStatus } from "@/content/schedule";

export type OrderingWindow =
  | { open: true; placeName: string; until: string }
  | { open: false; reason: string };

export function orderingWindow(): OrderingWindow {
  if (process.env.ORDERING_DEMO_ALWAYS_OPEN === "1") {
    return { open: true, placeName: "the truck", until: "close" };
  }
  const status = getStatus();
  if (status.state === "open") {
    return { open: true, placeName: status.stop.place, until: status.until };
  }
  if (status.state === "later") {
    return {
      open: false,
      reason: `The truck opens at ${status.stop.place} at ${status.from}. Ordering turns on when the window does.`,
    };
  }
  const next = status.nextDay?.stops[0];
  return {
    open: false,
    reason: next
      ? `The truck is done for today. Back ${status.nextDay!.dayName} at ${next.place}.`
      : "The truck is off today. Check the schedule for the next stop.",
  };
}
