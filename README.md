# Cookin' with Beans

Website for Cookin' with Beans, a mini street taco food truck in Marshall, Michigan.
Built by [Glazed Web](https://www.glazedweb.com).

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · deploys on Vercel.

---

## The one thing that matters

The truck is somewhere different every day. Before this site, the only way to find
out where was to scroll their Facebook feed and hope the post you found was current.
**Answering "where is the truck right now" is the job of this site.** Everything else
is secondary.

That is why the schedule lives in one plain file and not behind a CMS login. If
updating it is harder than posting to Facebook, it will go stale, and a stale
schedule is worse than no schedule.

---

## Updating the schedule

Open `src/content/schedule.ts`. Edit `weeklyStops`. Each entry is one stop:

```ts
{
  id: "mon-viking",       // any unique string
  day: 1,                 // 0 = Sunday, 1 = Monday ... 6 = Saturday
  start: "11:00",         // 24 hour clock
  end: "13:00",
  place: "Viking-Cives",
  city: "Marshall",
  access: "private",      // "public" = anyone can walk up
                          // "private" = employees or badge holders only
  note: "Lunch for the plant",
  mapQuery: "Viking-Cives Marshall MI",   // optional, powers the Directions link
}
```

One-offs (festivals, a booked event, a closure) go in `specialDates` and override the
weekly stops for that date.

The home page, the schedule page, and the order page all read from this one file. The
site figures out on its own whether the truck is open right now, out later today, done
for the day, or off, and it does that in Michigan time regardless of where the visitor
is. Pages revalidate every five minutes.

**The `access` field matters.** Several weekday stops are on private industrial sites
and a federal campus. Marking those `private` is what stops a customer driving to a
gate they cannot get through.

### Moving to a phone-editable schedule later

The resolver is isolated in `schedule.ts` behind `getWeek()` and `getStatus()`. To swap
the data source for Airtable, a Google Sheet, or a CMS, replace the `weeklyStops` and
`specialDates` constants with a fetch. Nothing in the components changes.

---

## Everything else editable

`src/content/site.ts` holds the phone number, email, social links, the menu, catering
event types, and the About copy.

---

## Open questions before launch

Search the codebase for `TODO:CONFIRM`. Currently outstanding:

- **Two phone numbers exist publicly.** (269) 781-5163 on the Choose Marshall
  directory, (901) 581-5743 on Toast. Only one can be right.
- **Two addresses exist publicly.** 323 W Michigan Ave vs 707 W Mansion St.
- **Email address** is a guess and needs replacing.
- **The menu board and Toast disagree.** The window board sells pollo and carne asada
  only. Toast also lists a breakfast burrito and a quesadilla. Set
  `extras[].available = true` in `site.ts` once confirmed and they appear on the menu.
- **The whole schedule** is reconstructed from Facebook posts and is almost certainly
  out of date.
- **The About page is placeholder.** We do not have the owners' names, the story
  behind "Beans", or what **Locias** means. It is on the truck, the menu board, and an
  interior poster, so it clearly matters.
- **Brand assets.** Optic Edge wrapped the truck and holds the vector logo and exact
  colors. The palette here is eyeballed from photographs.
- **Photography.** No real photos are in the build yet. Everything we have is
  social-compressed and needs full resolution originals.
- **Domain** is assumed to be cookinwithbeans.com in `site.ts`.

---

## Design rules

Colors come off the truck wrap. The palette is beautiful and genuinely hostile to body
text, because turquoise, vermillion, and lime all sit at nearly the same lightness.
Measured contrast:

| Combination | Ratio | |
|---|---|---|
| lime on turquoise | 1.11 | invisible |
| white on turquoise | 2.04 | fails |
| vermillion on turquoise | 2.23 | fails |
| vermillion on ink | 4.06 | large text only |
| vermillion on white | 4.54 | AA |
| white on deep teal | 6.20 | AA |
| ink on turquoise | 9.04 | AAA |
| ink on lime | 10.05 | AAA |
| ink on cream | 17.21 | AAA |

**So:**

- Turquoise and lime are surfaces and decoration. Never text colors.
- Ink carries every word that matters.
- Vermillion is display type and buttons, on white or cream, never on turquoise.
- A section that needs to be dark and branded uses `bg-teal`, not turquoise, so white
  text can sit on it.

Type is Anton for display and Archivo for body, both from Google Fonts. Hard edges
everywhere: 2px black borders, no rounded corners, no gradients, no drop shadows apart
from the flat offset `stack-shadow`. That is the menu board's logic, kept.

Graphic kit lives in `src/components/Motifs.tsx`: the calavera, the sunburst, the
agave, the awning zigzag, the black rail.

---

## Ordering

`/order` is their window menu board ported one to one. Six numbered steps, running
total, then a hand-off to a prefilled text message.

There is deliberately **no payment step**. Until the owners confirm they can work a
pre-order queue during a lunch rush, a checkout button promising a pickup time nobody
can keep is worse than a text that gets a real answer. Swapping in a real checkout
later is a change to `handoff` in `TacoBuilder.tsx` and nothing else.

The catering form works the same way: it composes the inquiry and opens the owner's
email client, so it works on day one with no third party service. To deliver straight
to an inbox instead, replace `submit` in `CateringForm.tsx` with a server action
posting to Resend or Formspree.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```
