import type { Metadata } from "next";
import { MEATS, extras, merch, site, steps } from "@/content/site";
import { Calavera, Rail, SkullField, Zig } from "@/components/Motifs";
import { ButtonLink, Eyebrow, H2, Section } from "@/components/Ui";

export const metadata: Metadata = {
  title: "Menu and prices",
  description:
    "Pollo and carne asada mini street tacos. Corn or flour, cilantro and onion, salsa verde or picante, Chihuahua or cotija. Jarritos in glass bottles.",
};

const money = (n: number) => `$${n}`;

export default function MenuPage() {
  return (
    <>
      <Rail>Two meats · Six choices · No filler</Rail>

      <div className="relative overflow-hidden border-b-2 border-ink bg-turquoise px-5 py-12 sm:py-16">
        <SkullField />
        <div className="relative mx-auto w-full max-w-6xl">
          <h1 className="text-5xl leading-[0.9] text-vermillion sm:text-6xl lg:text-7xl">
            The menu
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold text-ink">
            Short on purpose. Pick a meat, pick a tortilla, then decide how much you want on
            it. Six decisions and you are eating.
          </p>
        </div>
      </div>
      <Zig />

      {/* MEATS */}
      <Section className="bg-cream">
        <Eyebrow>Step one</Eyebrow>
        <H2>Choose your meat</H2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {MEATS.map((m) => (
            <article key={m.id} className="edge-4 stack-shadow bg-white p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-4xl">{m.label}</h3>
                  <p className="mt-1 font-display text-xs uppercase tracking-[0.16em] text-oxblood">
                    {m.note}
                  </p>
                </div>
                <Calavera className="w-14 shrink-0" />
              </div>
              <p className="mt-5 text-base leading-relaxed">{m.blurb}</p>
              <div className="mt-6 flex gap-3">
                <span className="edge bg-cream px-4 py-2.5 font-display text-lg tabular-nums">
                  1 taco {money(m.single)}
                </span>
                <span className="edge bg-lime px-4 py-2.5 font-display text-lg tabular-nums">
                  3 tacos {money(m.triple)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* STEPS 2-6 */}
      <div className="relative overflow-hidden bg-teal px-5 py-16 text-cream sm:py-20">
        <SkullField className="opacity-40" />
        <div className="relative mx-auto w-full max-w-6xl">
          <span className="mb-4 inline-block bg-lime px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.18em] text-ink">
            Steps two through six
          </span>
          <h2 className="text-4xl text-white sm:text-5xl">Then build it</h2>
          <p className="mt-5 max-w-2xl text-lg text-cream/90">
            Everything below is included unless it says otherwise. Nobody is going to charge
            you for cilantro.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="edge-4 border-lime bg-cream p-6 text-ink">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl text-vermillion">{step.n}</span>
                  <h3 className="text-xl leading-tight">
                    {step.question.replace(/\?$/, "")}
                  </h3>
                </div>
                {step.helper && (
                  <p className="mt-2 text-sm text-ink/65">{step.helper}</p>
                )}
                <ul className="mt-4 space-y-2">
                  {step.choices.map((c) => (
                    <li key={c.id} className="flex items-baseline justify-between gap-3 border-b border-ink/15 pb-2">
                      <span className="font-semibold">
                        {c.label}
                        {c.note && (
                          <span className="ml-1.5 text-sm font-normal text-ink/60">
                            {c.note}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-display tabular-nums text-oxblood">
                        {c.price ? `+${money(c.price)}` : "Free"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/order" tone="lime">
              Build your order now
            </ButtonLink>
          </div>
        </div>
      </div>

      <Zig />

      {/* EXTRAS + MERCH */}
      <Section className="bg-cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Also on the truck</Eyebrow>
            <H2 className="text-3xl sm:text-4xl">Merch</H2>
            <ul className="mt-6 space-y-3">
              {merch.map((m) => (
                <li key={m.id} className="edge flex items-baseline justify-between gap-4 bg-white px-5 py-4">
                  <span>
                    <span className="font-display text-xl uppercase">{m.label}</span>
                    <span className="ml-2 text-sm text-ink/65">{m.note}</span>
                  </span>
                  <span className="font-display text-xl tabular-nums text-oxblood">
                    {money(m.price)}
                  </span>
                </li>
              ))}
            </ul>
            {extras.some((e) => e.available) && (
              <ul className="mt-4 space-y-3">
                {extras
                  .filter((e) => e.available)
                  .map((e) => (
                    <li key={e.id} className="edge flex items-baseline justify-between gap-4 bg-white px-5 py-4">
                      <span className="font-display text-xl uppercase">{e.label}</span>
                      <span className="font-display text-xl tabular-nums text-oxblood">
                        {money(e.price)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="edge-4 bg-turquoise p-7 sm:p-9">
            <h3 className="text-3xl text-ink">Allergies or a big group?</h3>
            <p className="mt-4 text-base font-semibold leading-relaxed text-ink/85">
              Just ask at the window, or call ahead if you are ordering for a crowd. For
              twenty people or more, catering is the better route and it comes with a set
              time so nobody waits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/catering" tone="dark">
                Catering
              </ButtonLink>
              <ButtonLink href={`tel:${site.phoneHref}`} tone="ghost">
                Call the truck
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
