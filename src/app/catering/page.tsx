import type { Metadata } from "next";
import { site } from "@/content/site";
import { CateringForm } from "@/components/CateringForm";
import { Calavera, Rail, SkullField, Zig } from "@/components/Motifs";
import { Eyebrow, H2, Lede, Section } from "@/components/Ui";

export const metadata: Metadata = {
  title: "Catering and events",
  description:
    "Book Cookin' with Beans for corporate lunches, weddings, graduations, festivals, and taproom nights across Marshall, Battle Creek, Albion, and Jackson.",
};

const proof = [
  {
    stat: "7am",
    label: "In plant lots before the first shift",
  },
  {
    stat: "Year round",
    label: "Including January, in the snow",
  },
  {
    stat: "6 steps",
    label: "Everyone builds their own",
  },
];

export default function CateringPage() {
  return (
    <>
      <Rail>Corporate · Weddings · Festivals · Private parties</Rail>

      <div className="relative overflow-hidden border-b-2 border-ink bg-turquoise px-5 py-12 sm:py-16">
        <SkullField />
        <div className="relative mx-auto w-full max-w-6xl">
          <h1 className="max-w-3xl text-5xl leading-[0.9] text-vermillion sm:text-6xl lg:text-7xl">
            Bring the truck
            <br />
            to your people
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold text-ink">
            The truck is small, which is exactly why it fits where the big rigs cannot.
            Parking lots, back patios, farm fields, loading docks.
          </p>
        </div>
      </div>
      <Zig />

      {/* PROOF */}
      <div className="border-b-2 border-ink bg-ink px-5 py-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-3">
          {proof.map((p) => (
            <div key={p.stat}>
              <p className="font-display text-4xl text-lime sm:text-5xl">{p.stat}</p>
              <p className="mt-2 text-sm font-semibold text-cream/85">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Section className="bg-cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow>Why us</Eyebrow>
            <H2>Feeding a crowd is the day job</H2>
            <Lede>
              Most weeks the truck is out before sunrise feeding crews at manufacturing sites
              and a federal campus, then back out in the evening at a market or a bar. Doing
              that on a schedule, in Michigan weather, is the entire skill.
            </Lede>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed">
              For your event that means a set arrival time, a menu everyone can build the way
              they want, and a line that keeps moving. No chafing dishes, no catering trays
              going cold on a folding table.
            </p>

            <h3 className="mt-10 text-2xl text-oxblood">What to send over</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Your date, and a backup date if you have one",
                "Roughly how many people you are feeding",
                "Where it is, and whether there is power on site",
                "Indoor, outdoor, or both",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Calavera className="mt-1 w-5 shrink-0" />
                  <span className="text-base font-semibold">{t}</span>
                </li>
              ))}
            </ul>

            <div className="edge mt-9 bg-turquoise p-5">
              <p className="font-display text-sm uppercase tracking-[0.14em] text-oxblood">
                In a hurry?
              </p>
              <p className="mt-2 text-base font-semibold text-ink">
                Call or text{" "}
                <a
                  href={`tel:${site.phoneHref}`}
                  className="underline decoration-2 underline-offset-4"
                >
                  {site.phone}
                </a>
                . A real person answers.
              </p>
            </div>
          </div>

          <div id="inquiry">
            <Eyebrow>Check your date</Eyebrow>
            <H2 className="mb-7 text-3xl sm:text-4xl">Tell us about it</H2>
            <CateringForm />
          </div>
        </div>
      </Section>
    </>
  );
}
