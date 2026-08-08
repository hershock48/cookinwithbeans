import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Buttons. Vermillion on white passes AA (4.54). Ink on lime is AAA. */

type ButtonTone = "primary" | "dark" | "lime" | "ghost";

const toneClass: Record<ButtonTone, string> = {
  primary: "bg-vermillion text-white hover:bg-vermillion-dark",
  dark: "bg-ink text-white hover:bg-teal-dark",
  lime: "bg-lime text-ink hover:bg-lime-dark",
  ghost: "bg-white text-ink hover:bg-cream-deep",
};

export function Button({
  tone = "primary",
  className = "",
  children,
  ...rest
}: { tone?: ButtonTone; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button
      className={`edge inline-flex items-center justify-center gap-2 px-6 py-3.5 font-display text-base uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toneClass[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  tone = "primary",
  className = "",
  external = false,
  children,
}: {
  href: string;
  tone?: ButtonTone;
  className?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const cls = `edge inline-flex items-center justify-center gap-2 px-6 py-3.5 font-display text-base uppercase tracking-wide transition-colors ${toneClass[tone]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, tone = "lime" }: { children: ReactNode; tone?: "lime" | "cream" }) {
  return (
    <span
      className={`mb-4 inline-block px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.18em] ${
        tone === "lime" ? "bg-ink text-lime" : "bg-ink text-cream"
      }`}
    >
      {children}
    </span>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-4xl text-oxblood sm:text-5xl lg:text-6xl ${className}`}>{children}</h2>
  );
}

export function Lede({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${className}`}>{children}</p>;
}
