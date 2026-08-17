"use client";

// The kitchen screen: the whole staff surface, one page, three controls.
//
// Design bar: usable by a busy bartender with wet hands on a phone. Big
// targets, no nesting, nothing that needs explaining twice. The chime repeats
// until every new order is acknowledged, because a notification that fires
// once is a notification that gets missed during a Friday rush.
//
// Audio note: browsers refuse to play sound before a user gesture, which is
// why the PIN screen doubles as the audio unlock. The oscillator chime needs
// no asset file and cannot 404.

import { useCallback, useEffect, useRef, useState } from "react";
import MenuEditor from "@/components/ordering/MenuEditor";
import type { OrderableSection } from "@/lib/ordering/menu";
import type { KitchenState, Order } from "@/lib/ordering/store";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function age(ms: number): string {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return "just now";
  return `${mins} min ago`;
}

export default function KitchenClient({ sections }: { sections: OrderableSection[] }) {
  const [authed, setAuthed] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<KitchenState | null>(null);
  const [backend, setBackend] = useState<"postgres" | "memory" | null>(null);
  const [printers, setPrinters] = useState<{ id: string; label: string; role: string; online: boolean }[]>([]);
  // The board opens on 86s and hours (Kevin's call): that is the tab staff
  // reach for on their own; orders announce themselves with the chime and the
  // badge, so they do not need to be the front page.
  const [tab, setTab] = useState<"orders" | "menu" | "editor">("menu");
  const [filter, setFilter] = useState("");
  // Two-tap refund: first tap arms, second tap fires. Arming clears when the
  // list refreshes so a stale armed button cannot refund the wrong ticket.
  const [refundArm, setRefundArm] = useState<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const knownRef = useRef<Set<string>>(new Set());

  const chime = useCallback(() => {
    const ctx = audioRef.current;
    if (!ctx) return;
    // Two quick notes, loud enough for a bar. Repeats via the poll loop as
    // long as an unacknowledged order exists.
    const now = ctx.currentTime;
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, now + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.2);
    });
  }, []);

  const poll = useCallback(async () => {
    try {
      const [ordersRes, stateRes] = await Promise.all([
        fetch("/api/kitchen/orders", { cache: "no-store" }),
        fetch("/api/kitchen/state", { cache: "no-store" }),
      ]);
      if (ordersRes.status === 401) {
        setAuthed(false);
        return;
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
        setBackend(data.backend);
        const fresh = (data.orders as Order[]).filter((o) => o.status === "new");
        // Chime for anything new since last poll, and keep chiming while
        // anything sits unaccepted.
        if (fresh.some((o) => !knownRef.current.has(o.id)) || fresh.length > 0) {
          chime();
        }
        knownRef.current = new Set((data.orders as Order[]).map((o) => o.id));
      }
      if (stateRes.ok) {
        const data = await stateRes.json();
        setState(data.state);
        setPrinters(data.printers ?? []);
      }
    } catch {
      /* next poll retries; the backend badge covers persistent trouble */
    }
  }, [chime]);

  // A shift cookie survives a reload; making staff re-type the PIN because
  // someone bumped refresh would get this screen abandoned by Friday. Audio
  // stays locked until a tap either way (browser rule), so the board shows a
  // "turn sound on" chip until someone touches it.
  useEffect(() => {
    fetch("/api/kitchen/state", { cache: "no-store" }).then((r) => {
      if (r.ok) setAuthed(true);
    }).catch(() => {});
  }, []);

  const ensureAudio = useCallback(() => {
    audioRef.current ??= new AudioContext();
    audioRef.current.resume();
    setAudioReady(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    poll();
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, [authed, poll]);

  async function login() {
    setPinError("");
    const r = await fetch("/api/kitchen/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (r.ok) {
      // The login tap is the user gesture that unlocks audio for the shift.
      ensureAudio();
      setAuthed(true);
      setPin("");
    } else {
      setPinError("Wrong PIN.");
    }
  }

  async function patchState(patch: Record<string, unknown>) {
    const r = await fetch("/api/kitchen/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (r.ok) setState((await r.json()).state);
  }

  async function setOrderStatus(id: string, status: "accepted" | "done" | "refunded") {
    // Optimistic: the tap has to feel instant behind a bar.
    setRefundArm(null);
    setOrders((os) =>
      status === "done" || status === "refunded"
        ? os.filter((o) => o.id !== id)
        : os.map((o) => (o.id === id ? { ...o, status } : o))
    );
    await fetch("/api/kitchen/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-xs py-16 text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-lime-400">Kitchen</p>
        <h1 className="font-display mt-3 text-2xl uppercase text-neutral-100">Start the shift</h1>
        <label className="mt-8 block text-left text-sm text-neutral-400">
          Kitchen PIN
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            type="password"
            inputMode="numeric"
            autoComplete="off"
            className="mt-1 w-full rounded-sm border border-neutral-700 bg-neutral-900 px-3 py-3 text-center text-xl tracking-[0.5em] text-neutral-100 outline-none focus:border-lime-300"
          />
        </label>
        {pinError && (
          <p role="alert" className="mt-3 text-sm text-[#d9736b]">{pinError}</p>
        )}
        <button
          type="button"
          onClick={login}
          className="font-display mt-5 w-full rounded-sm bg-lime-400 px-6 py-4 text-sm uppercase tracking-widest text-neutral-950 transition-colors hover:bg-lime-400-light"
        >
          Open the board
        </button>
        <p className="mt-6 text-xs leading-relaxed text-neutral-400/60">
          Signing in turns the sound on. Keep this open in the truck; it rings until an order is accepted.
        </p>
      </div>
    );
  }

  const newCount = orders.filter((o) => o.status === "new").length;
  const paused = state?.pausedUntil != null && state.pausedUntil > Date.now();

  return (
    <div className="pb-16">
      {backend === "memory" && (
        <p className="mb-6 rounded-sm border border-[#d9736b]/40 bg-[#d9736b]/10 px-4 py-3 text-sm text-[#d9736b]">
          Running without a database: orders may not reach this screen from other devices. Add the free
          Postgres to the Vercel project before using this for real. See the README.
        </p>
      )}

      {/* Tab rail */}
      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            ["menu", "86 Board"],
            ["orders", newCount > 0 ? `Orders · ${newCount} new` : "Orders"],
            ["editor", "Edit Menu"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`font-display rounded-sm px-5 py-3 text-xs uppercase tracking-widest transition-colors ${
              tab === key ? "bg-lime-400 text-neutral-950" : "border border-neutral-700 text-neutral-400 hover:border-lime-300"
            }`}
          >
            {label}
          </button>
        ))}
        {!audioReady && (
          <button
            type="button"
            onClick={ensureAudio}
            className="font-display rounded-sm border border-lime-400 px-5 py-3 text-xs uppercase tracking-widest text-lime-400 transition-colors hover:bg-lime-400 hover:text-neutral-950"
          >
            Turn sound on
          </button>
        )}
      </div>

      {tab === "editor" ? (
        <MenuEditor />
      ) : tab === "orders" ? (
        <>
          {orders.length === 0 ? (
            <p className="rounded-sm border border-neutral-700 bg-neutral-900 px-5 py-10 text-center text-sm text-neutral-400/70">
              No open orders. This screen checks every few seconds and rings when one lands.
            </p>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className={`rounded-sm border p-5 ${
                    o.status === "new" ? "border-lime-400 bg-lime-400/10" : "border-neutral-700 bg-neutral-900"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-2xl text-neutral-100 tabular-nums">
                      #{o.number}
                      <span className="ml-3 text-sm uppercase tracking-widest text-neutral-400">{o.guestName}</span>
                      {o.hasAlcohol && (
                        <span className="ml-3 rounded-sm bg-[#d9736b] px-2 py-0.5 text-xs uppercase tracking-widest text-neutral-950">
                          ID check
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-neutral-400/70">
                      {age(o.createdAt)} · quoted {o.quotedMinutes} min · {money(o.totalCents)}
                    </p>
                  </div>
                  <ul className="mt-3 space-y-1 border-t border-neutral-700 pt-3 text-sm text-neutral-400">
                    {o.lines.map((l, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span>
                          <span className="text-neutral-100 tabular-nums">{l.qty}×</span> {l.name}
                          {l.options.length > 0 && <span className="text-neutral-400/70"> · {l.options.join(", ")}</span>}
                        </span>
                      </li>
                    ))}
                    {o.note && <li className="pt-1 text-lime-400">Note: {o.note}</li>}
                  </ul>
                  <div className="mt-4 flex gap-3">
                    {o.status === "new" ? (
                      <button
                        type="button"
                        onClick={() => setOrderStatus(o.id, "accepted")}
                        className="font-display flex-1 rounded-sm bg-lime-400 px-5 py-3.5 text-sm uppercase tracking-widest text-neutral-950 transition-colors hover:bg-lime-400-light"
                      >
                        Accept
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOrderStatus(o.id, "done")}
                        className="font-display flex-1 rounded-sm border border-lime-400 px-5 py-3.5 text-sm uppercase tracking-widest text-lime-400 transition-colors hover:bg-lime-400 hover:text-neutral-950"
                      >
                        Picked up
                      </button>
                    )}
                    <a
                      href={`tel:${o.guestPhone.replace(/\D/g, "")}`}
                      className="font-display rounded-sm border border-neutral-700 px-5 py-3.5 text-sm uppercase tracking-widest text-neutral-400 transition-colors hover:border-lime-300"
                    >
                      Call
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        refundArm === o.id ? setOrderStatus(o.id, "refunded") : setRefundArm(o.id)
                      }
                      className={`font-display rounded-sm border px-4 py-3.5 text-sm uppercase tracking-widest transition-colors ${
                        refundArm === o.id
                          ? "border-[#d9736b] bg-[#d9736b] text-neutral-950"
                          : "border-neutral-700 text-neutral-400/70 hover:border-[#d9736b] hover:text-[#d9736b]"
                      }`}
                    >
                      {refundArm === o.id ? "Confirm refund" : "Refund"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div>
          {/* Tonight's dials live with the 86 board: this whole tab is "how is
              the kitchen doing", the Orders tab is just the queue. */}
          <div className="mb-6 rounded-sm border border-neutral-700 bg-neutral-900 p-4">
            <p className="font-display mb-3 text-xs uppercase tracking-widest text-lime-400">Tonight</p>
            <div className="flex flex-wrap items-center gap-2">
              {([0, 15, 30] as const).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => patchState({ busyMinutes: mins })}
                  className={`rounded-sm border px-4 py-3 text-sm transition-colors ${
                    state?.busyMinutes === mins && !paused
                      ? "border-lime-400 bg-lime-400 text-neutral-950"
                      : "border-neutral-700 text-neutral-400 hover:border-lime-300"
                  }`}
                >
                  {mins === 0 ? "Normal" : `Busy +${mins} min`}
                </button>
              ))}
              <span className="mx-1 h-6 w-px bg-ink-line" aria-hidden />
              {paused ? (
                <button
                  type="button"
                  onClick={() => patchState({ pauseMinutes: 0 })}
                  className="rounded-sm border border-[#7dd18a]/50 bg-[#7dd18a]/10 px-4 py-3 text-sm text-[#7dd18a]"
                >
                  Paused · resumes in {Math.max(1, Math.ceil((state!.pausedUntil! - Date.now()) / 60000))} min · tap to resume now
                </button>
              ) : (
                <>
                  <span className="text-sm text-neutral-400/70">Pause ordering:</span>
                  {[30, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => patchState({ pauseMinutes: mins })}
                      className="rounded-sm border border-neutral-700 px-4 py-3 text-sm text-neutral-400 transition-colors hover:border-[#d9736b] hover:text-[#d9736b]"
                    >
                      {mins} min
                    </button>
                  ))}
                </>
              )}
            </div>
            {printers.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-700 pt-3">
                <span className="font-display text-xs uppercase tracking-widest text-lime-400">Printers</span>
                {printers.map((p) => (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs ${
                      p.online ? "border-[#7dd18a]/40 text-[#7dd18a]" : "border-[#d9736b] text-[#d9736b]"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${p.online ? "bg-[#7dd18a]" : "bg-[#d9736b]"}`} aria-hidden />
                    {p.label} {p.online ? "" : "· OFFLINE"}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-neutral-400/60">
              Every tap saves by itself and hits the order page within seconds. No save button, nothing to submit.
              Ordering opens and closes with the schedule: live stop, live ordering.
            </p>
          </div>

          {/* What's off right now, one glance, one tap to bring back. */}
          {(state?.unavailable.length ?? 0) > 0 && (
            <div className="mb-6 rounded-sm border border-[#d9736b]/40 bg-[#d9736b]/5 p-4">
              <p className="font-display mb-3 text-xs uppercase tracking-widest text-[#d9736b]">
                86&apos;d tonight · tap to bring back
              </p>
              <div className="flex flex-wrap gap-2">
                {state!.unavailable.map((id) => {
                  const item = sections.flatMap((s) => s.items).find((i) => i.id === id);
                  if (!item) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => patchState({ toggle86: id })}
                      className="rounded-sm border border-[#d9736b] bg-[#d9736b]/15 px-4 py-3 text-sm text-[#d9736b] line-through"
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 114 items need a filter more than they need scrolling. */}
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find an item to 86..."
            aria-label="Filter menu items"
            className="mb-6 w-full max-w-sm rounded-sm border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-lime-300"
          />

          {sections
            .map((section) => ({
              ...section,
              items: filter
                ? section.items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()))
                : section.items,
            }))
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <section key={section.name} className="mb-8">
                <h2 className="font-display mb-3 text-sm uppercase tracking-widest text-lime-400">{section.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item) => {
                    const off = state?.unavailable.includes(item.id) ?? false;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => patchState({ toggle86: item.id })}
                        aria-pressed={off}
                        className={`rounded-sm border px-4 py-3 text-sm transition-colors ${
                          off
                            ? "border-[#d9736b] bg-[#d9736b]/15 text-[#d9736b] line-through"
                            : "border-neutral-700 text-neutral-400 hover:border-lime-300"
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
