import type { Metadata } from "next";
import { about, site } from "@/content/site";
import { Calavera, Rail, SkullField, Zig } from "@/components/Motifs";
import { ButtonLink, Eyebrow, Section } from "@/components/Ui";

export const metadata: Metadata = {
  title: "About the truck",
  description:
    "Cookin' with Beans is a mini street taco food truck based in Marshall, Michigan, serving Calhoun County and beyond.",
};

export default function AboutPage() {
  return (
    <>
      <Rail>{site.subtitle}</Rail>

      <div className="relative overflow-hidden border-b-2 border-ink bg-turquoise px-5 py-12 sm:py-16">
        <SkullField />
        <div className="relative mx-auto w-full max-w-6xl">
          {/* A step down from the other page headings on purpose: this one is
              29 characters, so at the shared 7xl it wrapped to a huge two-line
              slab with "DREAMS" orphaned on its own line. text-balance evens
              out what's left. */}
          <h1 className="max-w-2xl text-balance text-4xl leading-[0.9] text-vermillion sm:text-5xl lg:text-6xl">
            {about.headline}
          </h1>
        </div>
      </div>
      <Zig />

      <Section className="bg-cream">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <Eyebrow>The truck</Eyebrow>
            {about.body.map((p, i) => (
              <p
                key={i}
                className={`max-w-2xl text-lg leading-relaxed ${i === 0 ? "mt-2" : "mt-5"} ${
                  p.startsWith("PLACEHOLDER")
                    ? "edge border-dashed bg-cream-deep p-4 text-base italic text-ink/70"
                    : ""
                }`}
              >
                {p}
              </p>
            ))}

            <h2 className="mt-12 text-3xl text-oxblood">Why it is so small</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">
              It is a kei truck, a Japanese mini truck, and it is the reason the whole thing
              works. It tucks into a plant lot or a bar patio where a full size rig would
              never fit, and it can be somewhere different three times in a day. Small truck,
              more places, more people fed.
            </p>

            <h2 className="mt-12 text-3xl text-oxblood">The short menu is the point</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">
              Two meats. Corn or flour. The toppings and sauces you actually want. Doing a
              few things properly beats doing twelve things at half speed, especially when
              there is a line and the lunch break is thirty minutes long.
            </p>
          </div>

          <aside className="edge-4 stack-shadow bg-turquoise p-7">
            <Calavera className="w-16" />
            <h2 className="mt-5 text-3xl text-ink">Find the truck</h2>
            <p className="mt-3 text-base font-semibold text-ink/85">
              Based in {site.city}, out most weekdays across{" "}
              {site.serviceArea.slice(0, -1).join(", ")}, and the rest of{" "}
              {site.serviceArea.at(-1)}.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href="/schedule" tone="dark">
                This week&apos;s stops
              </ButtonLink>
              <ButtonLink href="/catering" tone="ghost">
                Book us for an event
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
