"use client";

import { useState } from "react";
import { cateringTypes, site } from "@/content/site";

/**
 * Catering inquiry.
 *
 * Ships with a zero-dependency handoff: it composes the inquiry
 * and opens the owner's email client with everything filled in.
 * That works on day one with no service to sign up for and no
 * key to rotate.
 *
 * TO UPGRADE to a real inbox-delivered form, replace `submit`
 * with a server action that posts to Resend, Formspree, or
 * similar. Nothing else in this component needs to change.
 */

const field =
  "edge w-full bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:bg-cream";
const label = "block font-display text-xs uppercase tracking-[0.16em] text-oxblood";

export function CateringForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const body = [
      `Name: ${get("name")}`,
      `Phone: ${get("phone")}`,
      `Email: ${get("email")}`,
      "",
      `Event type: ${get("type")}`,
      `Date: ${get("date")}`,
      `Time: ${get("time") || "Flexible"}`,
      `Headcount: ${get("headcount")}`,
      `Location: ${get("location")}`,
      "",
      "Details:",
      get("details") || "(none)",
    ].join("\n");

    const subject = `Catering inquiry: ${get("type")} on ${get("date")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="edge-4 stack-shadow bg-cream-deep p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required className={`${field} mt-2`} />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" required className={`${field} mt-2`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className={`${field} mt-2`} />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="type">
            What kind of event?
          </label>
          <select id="type" name="type" required className={`${field} mt-2`} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {cateringTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="date">
            Date
          </label>
          <input id="date" name="date" type="date" required className={`${field} mt-2`} />
        </div>
        <div>
          <label className={label} htmlFor="time">
            Time
          </label>
          <input
            id="time"
            name="time"
            placeholder="11am to 1pm"
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label className={label} htmlFor="headcount">
            Roughly how many people?
          </label>
          <input
            id="headcount"
            name="headcount"
            type="number"
            min={1}
            required
            className={`${field} mt-2`}
          />
        </div>
        <div>
          <label className={label} htmlFor="location">
            Where?
          </label>
          <input
            id="location"
            name="location"
            placeholder="City, or the full address"
            required
            className={`${field} mt-2`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="details">
            Anything else worth knowing?
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            placeholder="Power available, indoor or outdoor, dietary needs, budget, whatever helps."
            className={`${field} mt-2 resize-y`}
          />
        </div>
      </div>

      <button
        type="submit"
        className="edge mt-7 w-full bg-vermillion px-6 py-4 font-display text-lg uppercase tracking-wide text-white transition-colors hover:bg-vermillion-dark sm:w-auto"
      >
        Send the inquiry
      </button>

      <p className="mt-4 text-sm text-ink/70" role="status">
        {sent
          ? "Your email app should be open with everything filled in. Hit send and they will get back to you."
          : `This opens an email to the truck with your details filled in. Prefer to talk? Call ${site.phone}.`}
      </p>
    </form>
  );
}
