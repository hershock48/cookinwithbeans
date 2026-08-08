"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Agave, Calavera } from "./Motifs";
import { site } from "@/content/site";

const nav = [
  { href: "/schedule", label: "Schedule" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-turquoise">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
          aria-label={`${site.name}, home`}
        >
          <Calavera className="w-9 shrink-0 sm:w-10" />
          <span className="leading-none">
            <span className="flex items-baseline gap-1.5 font-display text-xl text-vermillion sm:text-2xl">
              Cookin&apos;
              <Agave className="w-2.5 -translate-y-1.5 sm:w-3" />
              with Beans
            </span>
            <span className="mt-0.5 block font-display text-[9px] uppercase tracking-[0.16em] text-ink sm:text-[10px]">
              Mini Street Taco Food Truck
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2 font-display text-sm uppercase tracking-wide transition-colors ${
                  active ? "bg-ink text-lime" : "text-ink hover:bg-ink hover:text-lime"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/order"
            className="edge ml-2 bg-vermillion px-4 py-2.5 font-display text-sm uppercase tracking-wide text-white transition-colors hover:bg-vermillion-dark"
          >
            Build an order
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="edge bg-ink px-3.5 py-2.5 font-display text-xs uppercase tracking-widest text-lime lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t-2 border-ink bg-turquoise px-5 pb-5 lg:hidden"
        >
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block border-b border-ink/25 py-3.5 font-display text-lg uppercase tracking-wide ${
                  active ? "text-oxblood" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="edge mt-4 block bg-vermillion px-4 py-3.5 text-center font-display uppercase tracking-wide text-white"
          >
            Build an order
          </Link>
        </nav>
      )}
    </header>
  );
}
