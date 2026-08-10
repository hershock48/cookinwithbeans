import Link from "next/link";
import { site } from "@/content/site";
import { Calavera, Rail, Zig } from "./Motifs";
import GlazedCredit from "@/components/GlazedCredit";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Zig />
      <div className="bg-ink px-5 py-14 text-cream">
        <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Calavera className="w-10" />
              <span className="font-display text-2xl leading-none text-lime">
                Cookin&apos;
                <br />
                with Beans
              </span>
            </div>
            <p className="mt-4 font-display text-xs uppercase tracking-[0.14em] text-cream/70">
              {site.subtitle}
            </p>
            <p className="mt-3 text-sm text-cream/80">{site.blurb}</p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-lime">Go</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/schedule", "This week's schedule"],
                ["/menu", "Menu and prices"],
                ["/order", "Build an order"],
                ["/catering", "Book us for an event"],
                ["/about", "About the truck"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="underline-offset-4 hover:text-lime hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-lime">Find us</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`tel:${site.phoneHref}`} className="underline-offset-4 hover:text-lime hover:underline">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="break-all underline-offset-4 hover:text-lime hover:underline">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-lime hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-lime hover:underline">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.16em] text-lime">Where we roll</h3>
            <p className="mt-4 text-sm leading-relaxed text-cream/85">
              Based in {site.city}. The truck gets out to {site.serviceArea.slice(0, -1).join(", ")}, and
              the rest of {site.serviceArea.at(-1)}.
            </p>
            <p className="mt-4 text-sm text-cream/85">
              Want us somewhere we are not?{" "}
              <Link href="/catering" className="text-lime underline underline-offset-4">
                Ask.
              </Link>
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-2 border-t border-cream/20 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. {site.baseAddress}.
          </p>
          {/* Already pointed at the canonical host — the only one of the four that did.
              Swapped for the shared component so the credit is one file across the account
              instead of four hand-written variants. */}
          <GlazedCredit line="Double dipped by" />
        </div>
      </div>
      <Rail>Tacos are ready when you are</Rail>
    </footer>
  );
}
