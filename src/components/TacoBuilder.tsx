"use client";

import { useEffect, useMemo, useState } from "react";
import { MEATS, site, steps } from "@/content/site";

/**
 * Their window menu board, ported one to one.
 * Six numbered steps, choose as you go, running total.
 *
 * The ending depends on whether the truck is open. Open: a real Jelly
 * checkout -- name, phone, tip, place the order, and the ticket lands on the
 * truck's kitchen board with a chime (demo mode takes no payment until
 * Stripe is wired). Closed: the original text-it-in handoff, which was this
 * component's whole ending before the ordering engine existed, kept because
 * "text us and we'll tell you the wait" is still the honest answer when
 * there is no open window to cook the order.
 *
 * The six steps map one to one onto the ordering menu's items and option
 * groups (see src/lib/ordering/toast-menu.json, seeded FROM this board), so
 * the server reprices exactly what the board shows.
 */

type Sel = Record<string, string[]>;

const money = (n: number) => `$${n.toFixed(2).replace(/\.00$/, "")}`;

type LiveState = { open: boolean; reason: string; placeName: string; quoteMinutes: number; taxRate: number; feeCents: number; demo: boolean };
type Confirmation = { id: string; number: number; quotedMinutes: number; totalCents: number; emailedTo: string; status: "new" | "accepted" | "done" | "refunded" };

// Builder choice ids -> the ordering menu's item ids and option names.
const DRINK_ITEMS: Record<string, string> = { jarritos: "glass-jarritos", coke: "glass-cokesprite", water: "bottled-water" };
const OPTION_NAMES: Record<string, string> = {
  corn: "Corn", flour: "Flour", cilantro: "Cilantro", onion: "Onion",
  verde: "Salsa Verde", picante: "Picante", chihuahua: "Chihuahua", cotija: "Cotija",
};
function tacoItemId(meatId: string, qty: 1 | 3): string {
  if (meatId === "pollo") return qty === 1 ? "pollo-taco" : "three-pollo-tacos";
  return qty === 1 ? "asada-taco" : "three-asada-tacos";
}

export function TacoBuilder() {
  const [meat, setMeat] = useState<string | null>(null);
  const [qty, setQty] = useState<1 | 3>(3);
  const [sel, setSel] = useState<Sel>({});
  const [live, setLive] = useState<LiveState | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tipPct, setTipPct] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = () =>
      fetch("/api/ordering/state", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => { if (alive) setLive(d); })
        .catch(() => {});
    tick();
    const t = setInterval(tick, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  // The accepted flip is the product moment; poll while it can still change.
  useEffect(() => {
    if (!confirmation || confirmation.status === "done" || confirmation.status === "refunded") return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/ordering/order?id=${confirmation.id}`, { cache: "no-store" });
        if (r.ok) {
          const d = await r.json();
          setConfirmation((c) => (c ? { ...c, status: d.status } : c));
        }
      } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, [confirmation]);

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

  const tipCents = useMemo(() => {
    if (tipPct === null || !chosenMeat) return 0;
    const foodCents = Math.round((qty === 3 ? chosenMeat.triple : chosenMeat.single) * 100)
      + ["3", "4", "5"].flatMap((k) => sel[k] ?? []).filter((id) => id === "chihuahua" || id === "cotija").length * 100;
    return Math.round((foodCents * tipPct) / 100);
  }, [tipPct, chosenMeat, qty, sel]);

  const canPlace =
    ready && !placing && (live?.open ?? false) &&
    name.trim().length > 0 && phone.replace(/\D/g, "").length >= 10;

  async function placeOrder() {
    if (!chosenMeat) return;
    setPlacing(true);
    setError("");
    // The taco line: item id from meat and quantity, options from steps 2-5.
    const options = ["2", "3", "4", "5"]
      .flatMap((k) => sel[k] ?? [])
      .map((id) => OPTION_NAMES[id])
      .filter(Boolean);
    const lines = [{ itemId: tacoItemId(chosenMeat.id, qty), qty: 1, options }];
    for (const id of sel["6"] ?? []) {
      if (DRINK_ITEMS[id]) lines.push({ itemId: DRINK_ITEMS[id], qty: 1, options: [] });
    }
    try {
      const r = await fetch("/api/ordering/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: name.trim(),
          guestPhone: phone,
          guestEmail: email.trim(),
          tipCents,
          lines,
        }),
      });
      const data = await r.json();
      if (!r.ok) setError(data.error ?? "Something went wrong. The text button below still works.");
      else
        setConfirmation({
          id: data.id,
          number: data.number,
          quotedMinutes: data.quotedMinutes,
          totalCents: data.totals.totalCents,
          emailedTo: email.trim(),
          status: "new",
        });
    } catch {
      setError("Could not reach the truck. Check your connection, or text the order in below.");
    } finally {
      setPlacing(false);
    }
  }

  if (confirmation) {
    const accepted = confirmation.status === "accepted";
    if (confirmation.status === "refunded") {
      return (
        <div className="edge-4 mx-auto max-w-lg bg-white p-8 text-center">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-oxblood">Order #{confirmation.number}</p>
          <p className="mt-3 font-display text-4xl uppercase text-vermillion">Refunded</p>
          <p className="mt-4 text-base leading-relaxed">
            Your {money(confirmation.totalCents / 100)} is on its way back. Card refunds usually show up in 5 to 10 business days.
          </p>
        </div>
      );
    }
    return (
      <div className="edge-4 stack-shadow-lime mx-auto max-w-lg bg-ink p-8 text-center text-cream">
        <p className="font-display text-sm uppercase tracking-[0.18em] text-lime">Order in</p>
        <p className="mt-3 font-display text-7xl tabular-nums">#{confirmation.number}</p>
        <p className="mt-5 text-base leading-relaxed text-cream/85">
          {accepted
            ? `The truck has it. Walk up in about ${confirmation.quotedMinutes} minutes and give your name.`
            : `Sent to the truck. Ready in about ${confirmation.quotedMinutes} minutes.`}
        </p>
        <p className="edge mt-6 inline-block bg-lime px-4 py-2 font-display text-sm uppercase tracking-wide text-ink">
          {accepted ? "Accepted by the truck" : "Waiting for the truck to accept"}
        </p>
        {confirmation.emailedTo && (
          <p className="mt-4 text-xs text-cream/60">Confirmation sent to {confirmation.emailedTo}.</p>
        )}
        <p className="mt-4 text-sm text-cream/70">Total {money(confirmation.totalCents / 100)} · pay at the window in this demo</p>
      </div>
    );
  }

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

          {live?.open ? (
            <div className="mt-5 space-y-3">
              <p className="edge inline-block bg-lime/20 px-3 py-1.5 font-display text-xs uppercase tracking-wide text-lime">
                Open now{live.placeName !== "the truck" ? ` at ${live.placeName}` : ""} · ready in ~{live.quoteMinutes} min
              </p>
              <label className="block text-xs uppercase tracking-wide text-cream/70">
                Name for the order
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
                  className="edge mt-1 w-full border-cream/40 bg-cream px-3 py-2.5 text-ink outline-none" />
              </label>
              <label className="block text-xs uppercase tracking-wide text-cream/70">
                Phone
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel"
                  className="edge mt-1 w-full border-cream/40 bg-cream px-3 py-2.5 text-ink outline-none" />
              </label>
              <label className="block text-xs uppercase tracking-wide text-cream/70">
                Email for your confirmation (optional)
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"
                  className="edge mt-1 w-full border-cream/40 bg-cream px-3 py-2.5 text-ink outline-none" />
              </label>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cream/70">
                Tip
                {[null, 10, 15, 20].map((pct) => (
                  <button key={pct === null ? "none" : pct} type="button" onClick={() => setTipPct(pct)}
                    className={`edge px-2.5 py-1.5 font-display text-xs uppercase ${tipPct === pct ? "bg-lime text-ink" : "bg-transparent text-cream/80"}`}>
                    {pct === null ? "None" : `${pct}%`}
                  </button>
                ))}
              </div>
              {error && <p role="alert" className="edge bg-vermillion/20 px-3 py-2 text-sm text-vermillion">{error}</p>}
              <button
                type="button"
                disabled={!canPlace}
                onClick={placeOrder}
                className="edge block w-full border-lime bg-lime px-4 py-3.5 text-center font-display uppercase tracking-wide text-ink transition-colors hover:bg-lime-dark disabled:cursor-not-allowed disabled:opacity-45"
              >
                {placing ? "Sending to the truck" : `Place order · ${money(total)} + tax & fee`}
              </button>
              {live.demo && <p className="text-center text-xs text-cream/55">Demo checkout. No card is charged.</p>}
            </div>
          ) : (
            <>
              {live && (
                <p className="mt-5 text-xs leading-relaxed text-cream/70">{live.reason}</p>
              )}
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
                className={`edge mt-4 block px-4 py-3.5 text-center font-display uppercase tracking-wide transition-colors ${
                  ready
                    ? "border-lime bg-lime text-ink hover:bg-lime-dark"
                    : "border-cream/50 bg-transparent text-cream/70"
                }`}
              >
                Text this order in
              </a>
            </>
          )}

          {!live?.open && (
            <button
              type="button"
              onClick={copyOrder}
              disabled={!ready}
              className="edge mt-3 block w-full border-cream/60 bg-transparent px-4 py-3 text-center font-display text-sm uppercase tracking-wide text-cream transition-colors hover:bg-cream/10 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {copied ? "Copied — now paste it" : "Copy the order"}
            </button>
          )}

          <p className="mt-3 text-xs leading-relaxed text-cream/60">
            {!ready
              ? "Pick a meat and a tortilla to finish."
              : live?.open
              ? "Pay at the window when you pick up. Your name calls the order."
              : (
                <>
                  The truck is closed right now, so this hands your order to your messages
                  app instead. Send it to{" "}
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="font-bold text-lime underline decoration-from-font underline-offset-2"
                  >
                    {site.phone}
                  </a>{" "}
                  and they will confirm the wait for the next stop.
                </>
              )}
          </p>
        </div>
      </aside>
    </div>
  );
}
