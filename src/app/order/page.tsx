import type { Metadata } from "next";
import { getStatus } from "@/content/schedule";
import { site } from "@/content/site";
import { TacoBuilder } from "@/components/TacoBuilder";
import { Rail, SkullField, Zig } from "@/components/Motifs";
import { Section } from "@/components/Ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Build an order",
  description:
    "Build your tacos the same way you would at the window. Pick a meat, a tortilla, toppings, sauce, cheese, and a drink, then text the order in.",
};

export default function OrderPage() {
  const status = getStatus();

  return (
    <>
      <Rail>Same six steps as the window</Rail>

      <div className="relative overflow-hidden border-b-2 border-ink bg-turquoise px-5 py-12">
        <SkullField />
        <div className="relative mx-auto w-full max-w-6xl">
          <h1 className="text-5xl leading-[0.9] text-vermillion sm:text-6xl">
            Build an order
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold text-ink">
            Exactly the way the board on the truck works. Tap through the six steps and the
            total adds itself up.
          </p>

          {status.state === "open" ? (
            <p className="edge mt-6 inline-block bg-lime px-4 py-2.5 font-display text-sm uppercase tracking-wide">
              Open now at {status.stop.place} until {status.until}
            </p>
          ) : status.state === "later" ? (
            <p className="edge mt-6 inline-block bg-white px-4 py-2.5 font-display text-sm uppercase tracking-wide">
              Out today at {status.stop.place} from {status.from}
            </p>
          ) : (
            <p className="edge mt-6 inline-block bg-white px-4 py-2.5 font-display text-sm uppercase tracking-wide">
              {status.nextDay?.stops[0]
                ? `Back ${status.nextDay.dayName} at ${status.nextDay.stops[0].place}`
                : "Check the schedule for the next stop"}
            </p>
          )}
        </div>
      </div>
      <Zig />

      <Section className="bg-cream">
        <TacoBuilder />

        <div className="edge-4 mt-12 bg-white p-6 sm:p-8">
          <h2 className="text-2xl text-oxblood">How this works</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed">
            Building an order here does not put you in a queue. It writes the order out for
            you and opens a text to the truck so they can tell you how long the wait is
            before you drive over. During a lunch rush that is faster and more honest than a
            checkout button that promises a time nobody can keep. You can also order through{" "}
            <a
              href={site.toast}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-oxblood underline decoration-2 underline-offset-4"
            >
              Toast
            </a>{" "}
            when it is switched on.
          </p>
        </div>
      </Section>
    </>
  );
}
