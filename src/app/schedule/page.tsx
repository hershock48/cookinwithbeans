import type { Metadata } from "next";
import { getStatus, getWeek } from "@/content/schedule";
import { site } from "@/content/site";
import { StatusCard } from "@/components/TruckStatus";
import { WeekList } from "@/components/WeekList";
import { Rail, Zig } from "@/components/Motifs";
import { ButtonLink, Eyebrow, H2, Section } from "@/components/Ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Where is the truck today?",
  description:
    "The current weekly schedule for Cookin' with Beans, the mini street taco food truck in Marshall, Michigan. Stops in Marshall, Battle Creek, Albion, and Jackson.",
};

export default function SchedulePage() {
  const status = getStatus();
  const week = getWeek();

  return (
    <>
      <Rail>Updated every week</Rail>

      <div className="border-b-2 border-ink bg-turquoise px-5 py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-9 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h1 className="text-5xl leading-[0.9] text-vermillion sm:text-6xl lg:text-7xl">
              Where is
              <br />
              the truck?
            </h1>
            <p className="mt-5 max-w-md text-lg font-semibold text-ink">
              Right here. The truck moves every day, so this page is the one that always
              knows.
            </p>
          </div>
          <StatusCard status={status} />
        </div>
      </div>
      <Zig />

      <Section className="bg-cream">
        <Eyebrow>The next seven days</Eyebrow>
        <H2>This week</H2>
        <div className="mt-8">
          <WeekList week={week} />
        </div>

        <div className="edge-4 mt-10 bg-white p-6 sm:p-8">
          <h3 className="text-2xl text-oxblood">A note on the plant stops</h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed">
            Some of the weekday stops are on private sites, which means they are for the
            people who work there rather than the general public. Those are marked
            &ldquo;employees only&rdquo; above so nobody drives to a gate they cannot get
            through. Everything marked with directions is open to anyone.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/catering" tone="primary">
            Want the truck at your place?
          </ButtonLink>
          <ButtonLink href={site.facebook} tone="ghost" external>
            Same-day changes on Facebook
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
