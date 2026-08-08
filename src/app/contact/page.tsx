import type { Metadata } from "next";
import { site } from "@/content/site";
import { Calavera, Rail, SkullField, Zig } from "@/components/Motifs";
import { ButtonLink, Eyebrow, Section } from "@/components/Ui";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with Cookin' with Beans in Marshall, Michigan. Call ${site.phone}, or find the truck on Facebook and Instagram.`,
};

const ways = [
  {
    title: "Call or text",
    value: site.phone,
    href: `tel:${site.phoneHref}`,
    body: "Fastest way to reach the truck. Someone actually answers.",
  },
  {
    title: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    body: "Best for catering details, invoices, and anything with a date attached.",
  },
  {
    title: "Facebook",
    value: "Cookin' with Beans",
    href: site.facebook,
    body: "Same-day changes, weather calls, and where the truck ended up.",
    external: true,
  },
  {
    title: "Instagram",
    value: "@cookin.with.beans",
    href: site.instagram,
    body: "Photos of what came off the flat top today.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <Rail>A real person, not a chatbot</Rail>

      <div className="relative overflow-hidden border-b-2 border-ink bg-turquoise px-5 py-12 sm:py-16">
        <SkullField />
        <div className="relative mx-auto w-full max-w-6xl">
          <h1 className="text-5xl leading-[0.9] text-vermillion sm:text-6xl lg:text-7xl">
            Get in touch
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold text-ink">
            Questions about a stop, a big order, or a date you want to hold. All of it goes
            to the same place.
          </p>
        </div>
      </div>
      <Zig />

      <Section className="bg-cream">
        <div className="grid gap-5 sm:grid-cols-2">
          {ways.map((w) => (
            <a
              key={w.title}
              href={w.href}
              {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="edge-4 group bg-white p-6 transition-colors hover:bg-turquoise"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl text-oxblood">{w.title}</h2>
                  <p className="mt-1.5 break-all font-display text-lg uppercase">{w.value}</p>
                </div>
                <Calavera className="w-10 shrink-0" />
              </div>
              <p className="mt-4 text-base leading-relaxed">{w.body}</p>
            </a>
          ))}
        </div>

        <div className="edge-4 mt-10 bg-ink p-7 text-cream sm:p-9">
          <Eyebrow>Planning something</Eyebrow>
          <h2 className="text-3xl text-lime sm:text-4xl">
            Catering questions have their own form
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/85">
            It asks for the date, the headcount, and the location up front, which saves
            about four messages back and forth.
          </p>
          <div className="mt-6">
            <ButtonLink href="/catering" tone="lime">
              Go to catering
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
