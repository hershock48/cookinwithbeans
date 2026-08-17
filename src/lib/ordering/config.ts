// Jelly ordering: the numbers, in one place. Beans edition.
//
// Same model as the Copper build it was ported from: a 99 cent order fee paid
// by the guest at online checkout, split 50/49 with the truck at payment time
// (Stripe application_fee_amount when payments are wired). The window and its
// register are untouched by any of this.

export const ORDERING = {
  feeCents: 99,
  feeStudioCents: 49,
  feeLabel: "99¢ order fee",
  feeExplainer: "Half of it stays with the truck.",
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
