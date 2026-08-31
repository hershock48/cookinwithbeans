// Jelly ordering: the numbers, in one place. Beans edition.
//
// A 99 cent order fee paid by the guest at online checkout, and all of it is
// Glazed Web's, taken as the Stripe application_fee_amount when payments are
// wired. That diverges from the founding Jelly 50/49 split in the Copper
// build this was ported from: Kevin retired the split here, Aug 31 2026,
// along with the whole idea of running the truck's window register (the
// pitch now recommends Square at the window instead). The truck keeps the
// full food price, and the window is untouched by any of this.

export const ORDERING = {
  feeCents: 99,
  feeLabel: "99¢ order fee",
  feeExplainer: "It keeps order-ahead free for the truck.",
  timezone: "America/Detroit",

  // Michigan 6% on prepared food. Demo computes it for display; the live
  // build hands this to Stripe Tax on the truck's connected account.
  taxRate: 0.06,

  // A truck turns orders faster than a bar kitchen.
  basePickupMinutes: 10,

  demoNoticeShort: "Demo checkout. No card is charged.",
} as const;

// PLACEHOLDER: demo PIN, the truck's street number (707 W Mansion). Set
// KITCHEN_PIN in Vercel before the owner's staff use the board for real.
export const KITCHEN_PIN_FALLBACK = "0707";
