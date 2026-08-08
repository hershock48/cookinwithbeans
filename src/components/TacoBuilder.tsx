"use client";

import { useEffect, useMemo, useState } from "react";
import { MEATS, site, steps } from "@/content/site";

/**
 * Their window menu board, ported one to one.
 * Six numbered steps, choose as you go, running total.
 *
 * There is deliberately no payment here. Until the owners
 * confirm they can work a pre-order queue during a lunch rush,
 * this hands off to a prefilled text message. Swapping in a
 * real checkout later is a change to `handoff` only.
 */

type Sel = Record<string, string[]>;

const money = (n: number) => `$${n.toFixed(2).replace(/\.00$/, "")}`;

export function TacoBuilder() {
  const [meat, setMeat] = useState<string | null>(null);
  const [qty, setQty] = useState<1 | 3>(3);
  const [sel, setSel] = useState<Sel>({});

  const chosenMeat = MEATS.find((m) => m.id === meat) ?? null;

  const total = useMemo(() => {
    if (!chosenMeat) return 0;
    let t = qty === 3 ? chosenMeat.triple : chosenMeat.single;
    for (const step of steps) {
      for (const c of step.choices) {
        if (c.price && sel[String(step.n)]?.includes(c.id)) t += c.price;
      }
    }
    return t;
  }, [chosenMeat, qty, sel]);

  function toggle(stepN: number, choiceId: string, mode: "one" | "many") {
    const key = String(stepN);
    setSel((prev) => {
      const cur = prev[key] ?? [];
      if (mode === "one") {
        return { ...prev, [key]: cur[0] === choiceId ? [] : [choiceId] };
      }
      return {
        ...prev,
        [key]: cur.includes(choiceId)
          ? cur.filter((x) => x !== choiceId)
          : [...cur, choiceId],
      };
    });
  }

  const summary = useMemo(() => {
    if (!chosenMeat) return [];
    const lines: string[] = [
      `${qty} ${chosenMeat.label} taco${qty > 1 ? "s" : ""}`,
    ];
    for (const step of steps) {
      const picked = (sel[String(step.n)] ?? [])
        .map((id) => step.choices.find((c) => c.id === id)?.label)
        .filter(Boolean);
      if (!picked.length) continue;
      // "Choose your tortilla" -> "Tortilla". This text lands in a stranger's
      // messages app, so it gets a capital letter.
      const label = step.question
        .replace(/^Choose your |^Add a |^Add /i, "")
        .replace(/\?$/, "");
      lines.push(`${label[0].toUpperCase()}${label.slice(1)}: ${picked.join(", ")}`);
    }
    return lines;
  }, [chosenMeat, qty, sel]);

  const orderText = useMemo(
    () => `Hi! I'd like to order:\n${summary.join("\n")}\nTotal: ${money(total)}`,
    [summary, total],
  );

  // RFC 5724 puts the message in a query string (`sms:number?body=`). iOS
  // Messages has always wanted it after an ampersand instead. The old code
  // hedged with `?&body=`, which is malformed and drops the body on some
  // Android keyboards. Ship the spec form so the href is correct before any JS
  // runs, then switch to the Apple form on Apple hardware after mount.
  const [smsSep, setSmsSep] = useState("?");
  useEffect(() => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) setSmsSep("&");
  }, []);

  // Desktop browsers have no sms: handler at all — the link is simply inert,
  // which is what "the text button doesn't work" looks like on a laptop. So
  // copying is always offered, and the number is always visible.
  const [copied, setCopied] = useState(false);
  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(orderText);
    } catch {
      const el = document.createElement("textarea");
      el.value = orderText;
      el.setAttribute("readonly", "");
      el.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  const ready = Boolean(chosenMeat) && (sel["2"]?.length ?? 0) > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="edge-4 bg-white">
        {/* STEP 1 — meat */}
        <fieldset className="border-b-2 border-ink">
          <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[68px_1fr]">
            <div className="flex items-center justify-center bg-vermillion font-display text-2xl text-white sm:text-3xl">
              1
            </div>
            <div className="p-4 sm:p-6">
              <legend className="font-display text-lg uppercase tracking-wide sm:text-xl">
                Choose your meat
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {MEATS.map((m) => {
                  const on = meat === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMeat(on ? null : m.id)}
                      aria-pressed={on}
                      className={`edge p-4 text-left transition-colors ${
                        on ? "bg-lime" : "bg-cream hover:bg-cream-deep"
                      }`}
                    >
                      <span className="block font-display text-xl uppercase leading-none">
                        {m.label}
                      </span>
                      <span className="mt-1 block text-sm text-ink/70">{m.note}</span>
                      <span className="mt-3 block text-sm font-bold tabular-nums">
                        1 for {money(m.single)} &nbsp;·&nbsp; 3 for {money(m.triple)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {chosenMeat && (
                <div className="mt-5">
                  <p className="font-display text-xs uppercase tracking-[0.16em] text-oxblood">
                    How many?
                  </p>
                  <div className="mt-2 flex gap-3">
                    {([1, 3] as const).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQty(n)}
                        aria-pressed={qty === n}
                        className={`edge px-6 py-2.5 font-display uppercase tracking-wide transition-colors ${
                          qty === n ? "bg-ink text-lime" : "bg-cream hover:bg-cream-deep"
                        }`}
                      >
                        {n} taco{n > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* STEPS 2 to 6 */}
        {steps.map((step, i) => (
          <fieldset
            key={step.n}
            className={i < steps.length - 1 ? "border-b-2 border-ink" : ""}
          >
            <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[68px_1fr]">
              <div className="flex items-center justify-center bg-vermillion font-display text-2xl text-white sm:text-3xl">
                {step.n}
              </div>
              <div className="p-4 sm:p-6">
                <legend className="font-display text-lg uppercase tracking-wide sm:text-xl">
                  {step.question}
                </legend>
                {step.helper && (
                  <p className="mt-1 text-sm text-ink/65">{step.helper}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  {step.choices.map((c) => {
                    const on = sel[String(step.n)]?.includes(c.id) ?? false;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggle(step.n, c.id, step.mode)}
                        aria-pressed={on}
                        className={`edge px-4 py-3 text-left transition-colors ${
                          on ? "bg-lime" : "bg-cream hover:bg-cream-deep"
                        }`}
                      >
                        <span className="block font-display text-base uppercase leading-none">
                          {c.label}
                        </span>
                        {(c.note || c.price) && (
                          <span className="mt-1 block text-xs text-ink/70">
                            {c.note}
                            {c.note && c.price ? " · " : ""}
                            {c.price ? `+${money(c.price)}` : ""}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {/* RUNNING ORDER */}
      <aside className="edge-4 stack-shadow-lime sticky top-24 bg-ink text-cream">
        <div className="border-b-2 border-lime px-5 py-3">
          <h3 className="font-display text-sm uppercase tracking-[0.18em] text-lime">
            Your order
          </h3>
        </div>
        <div className="px-5 py-5">
          {!chosenMeat ? (
            <p className="text-sm text-cream/70">
              Start with step one and this fills itself in.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {summary.map((line, i) => (
                <li key={i} className={i === 0 ? "font-display text-lg uppercase text-lime" : "text-cream/85"}>
                  {line}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex items-baseline justify-between border-t border-cream/25 pt-4">
            <span className="font-display text-sm uppercase tracking-[0.16em]">Total</span>
            <span className="font-display text-3xl tabular-nums text-lime">{money(total)}</span>
          </div>

          <a
            href={
              ready
                ? `sms:${site.phoneHref}${smsSep}body=${encodeURIComponent(orderText)}`
                : undefined
            }
            aria-disabled={!ready}
            onClick={(e) => {
              if (!ready) e.preventDefault();
            }}
            className={`edge mt-5 block px-4 py-3.5 text-center font-display uppercase tracking-wide transition-colors ${
              ready
                ? "border-lime bg-lime text-ink hover:bg-lime-dark"
                : "border-cream/50 bg-transparent text-cream/70"
            }`}
          >
            Text this order in
          </a>

          <button
            type="button"
            onClick={copyOrder}
            disabled={!ready}
            className="edge mt-3 block w-full border-cream/60 bg-transparent px-4 py-3 text-center font-display text-sm uppercase tracking-wide text-cream transition-colors hover:bg-cream/10 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {copied ? "Copied — now paste it" : "Copy the order"}
          </button>

          <p className="mt-3 text-xs leading-relaxed text-cream/60">
            {ready ? (
              <>
                Texting opens your messages app with all of this written out. On a computer
                there is no messages app to open, so copy it and send it to{" "}
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-bold text-lime underline decoration-from-font underline-offset-2"
                >
                  {site.phone}
                </a>
                . They will confirm the wait before you head over.
              </>
            ) : (
              "Pick a meat and a tortilla to finish."
            )}
          </p>
        </div>
      </aside>
    </div>
  );
}
