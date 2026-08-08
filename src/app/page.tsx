import Link from "next/link";
import { getStatus, getWeek } from "@/content/schedule";
import { MEATS, site } from "@/content/site";
import { StatusCard } from "@/components/TruckStatus";
import { WeekList } from "@/components/WeekList";
import { Agave, Calavera, Rail, SkullField, Sunburst, Zig } from "@/components/Motifs";
import { ButtonLink, Eyebrow, H2, Lede, Section } from "@/components/Ui";

export const revalidate = 300;

export default function Home() {
  const status = getStatus();
  const week = getWeek();

  return (
    <>
      <Rail>Marshall · Battle Creek · Albion · Jackson</Rail>

      {/* HERO */}
      <div className="relative overflow-hidden bg-turquoise">
        <Sunburst className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[130%] w-[160%] -translate-x-1/2 opacity-90" />
        <SkullField />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <h1 className="text-[15vw] leading-[0.84] text-vermillion sm:text-7xl lg:text-8xl">
              Cookin&apos;
              <Agave className="ml-2 inline w-6 -translate-y-3 sm:w-9" />
              <br />
              with Beans
            </h1>
            <p className="mt-4 font-display text-base uppercase tracking-[0.1em] text-oxblood sm:text-xl">
              {site.subtitle}
            </p>
            <p className="mt-6 max-w-md text-lg font-semibold leading-relaxed text-ink">
              A mini street taco truck with big dreams. Two meats, six choices, and a
              different parking lot every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/order" tone="primary">
                Build an order
              </ButtonLink>
              <ButtonLink href="/catering" tone="dark">
                Book the truck
              </ButtonLink>
            </div>
          </div>

          <div>
            <StatusCard status={status} />
          </div>
        </div>
      </div>
      <Zig />

      {/* MARQUEE */}
      <div className="overflow-hidden border-b-2 border-ink bg-ink py-3">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex gap-8" aria-hidden={dup === 1}>
              {[
                "Pollo",
                "Carne asada",
                "Corn or flour",
                "Salsa verde",
                "Picante",
                "Cotija",
                "Chihuahua",
                "Jarritos in glass",
              ].map((w) => (
                <span key={w} className="flex items-center gap-8 font-display text-lg uppercase tracking-[0.14em] text-lime">
                  {w}
                  <Calavera className="w-5" fill="#DA3B22" line="#A3CE3C" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* THE WEEK */}
      <Section className="bg-cream">
        <Eyebrow>The whole point of this website</Eyebrow>
        <H2>Where the truck is this week</H2>
        <Lede>
          The truck moves every day. This page is the one place that always knows where it
          went, so you never have to scroll a feed hoping the post you found is current.
        </Lede>
        <div className="mt-9">
          <WeekList week={week} />
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/schedule" tone="dark">
            Full schedule
          </ButtonLink>
          <ButtonLink href={site.facebook} tone="ghost" external>
            Day-of updates on Facebook
          </ButtonLink>
        </div>
      </Section>

      <Zig flip />

      {/* MENU TEASE */}
      <div className="relative overflow-hidden bg-teal px-5 py-16 text-cream sm:py-20">
        <SkullField className="opacity-40" />
        <div className="relative mx-auto w-full max-w-6xl">
          <span className="mb-4 inline-block bg-lime px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.18em] text-ink">
            The menu
          </span>
          <h2 className="text-4xl text-white sm:text-5xl lg:text-6xl">Six choices, then you eat</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/90">
            The menu is short because short menus are better. Pick a meat, pick a tortilla,
            then decide how much you want on it. That is the entire system.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {MEATS.map((m) => (
              <div key={m.id} className="edge-4 border-lime bg-cream p-6 text-ink">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl">{m.label}</h3>
                    <p className="mt-1 font-display text-xs uppercase tracking-[0.14em] text-oxblood">
                      {m.note}
                    </p>
                  </div>
                  <Calavera className="w-12 shrink-0" />
                </div>
                <p className="mt-4 text-base leading-relaxed">{m.blurb}</p>
                <p className="mt-5 font-display text-2xl tabular-nums text-oxblood">
                  ${m.single} for one &nbsp;·&nbsp; ${m.triple} for three
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/menu" tone="lime">
              See the full menu
            </ButtonLink>
            <ButtonLink href="/order" tone="ghost">
              Build an order
            </ButtonLink>
          </div>
        </div>
      </div>

      <Zig />

      {/* CATERING */}
      <Section className="bg-cream">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Catering and events</Eyebrow>
            <H2>We already feed the hard hats</H2>
            <Lede>
              Weekday mornings the truck is in plant lots before most people have had coffee,
              in the snow, feeding crews on shift. If it can handle that, it can handle your
              wedding, your graduation party, or your company lunch.
            </Lede>
            <ul className="mt-7 space-y-3">
              {[
                "Corporate lunches and shift feeds",
                "Weddings, graduations, and birthdays",
                "Breweries, taprooms, and bars",
                "Festivals and public events",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Calavera className="mt-0.5 w-6 shrink-0" />
                  <span className="text-lg font-semibold">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/catering" tone="primary">
                Ask about your date
              </ButtonLink>
            </div>
          </div>

          <div className="edge-4 stack-shadow bg-turquoise p-7 sm:p-9">
            <p className="font-display text-xs uppercase tracking-[0.18em] text-oxblood">
              Straight from the owners
            </p>
            <blockquote className="mt-4 font-display text-3xl uppercase leading-[1.05] text-ink sm:text-4xl">
              &ldquo;Mini street taco food truck with big dreams. Available for catering and
              events.&rdquo;
            </blockquote>
            <p className="mt-5 text-base font-semibold text-ink/75">
              It is the whole business in one sentence, and it has been true since day one.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA STRIP */}
      <div className="border-y-2 border-ink bg-vermillion px-5 py-14 text-center">
        <h2 className="text-4xl text-white sm:text-5xl">Hungry now?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-white/95">
          Check today&apos;s stop, build your order on the way, and text it in so it is ready
          when you get there.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/order" tone="lime">
            Build an order
          </ButtonLink>
          <Link
            href="/schedule"
            className="edge inline-flex items-center justify-center border-white px-6 py-3.5 font-display text-base uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-vermillion"
          >
            Today&apos;s stop
          </Link>
        </div>
      </div>
    </>
  );
}
