// Guest email: order confirmation and refund notice, Beans edition.
//
// Same delivery posture as the Copper build and the site's catering form:
// RESEND_API_KEY unset means the full payload goes to the server log and the
// caller carries on -- an email failure must never fail an order. Sender is a
// verified glazedweb.com address (INQUIRY_FROM) with reply_to the truck's own
// inbox, so no client DNS work sits on the critical path.

import { site } from "@/content/site";
import type { Order } from "./store";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function orderLines(order: Order): string {
  return order.lines
    .map((l) => `  ${l.qty} x ${l.name}${l.options.length ? ` (${l.options.join(", ")})` : ""} - ${money(l.lineCents)}`)
    .join("\n");
}

async function send(to: string, subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM;
  if (!key || !from) {
    console.log(`[ordering email, delivery unconfigured] to=${to} subject="${subject}"\n${text}`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${site.name} <${from}>`,
        to: [to],
        reply_to: site.email,
        subject,
        text,
      }),
    });
  } catch (err) {
    console.log(`[ordering email failed] to=${to} subject="${subject}"`, err);
  }
}

export async function sendOrderConfirmation(order: Order): Promise<void> {
  if (!order.guestEmail) return;
  const paidLine = order.paid
    ? "Paid online. Nothing owed at the window."
    : `Due at the window: ${money(order.totalCents)}.`;
  await send(
    order.guestEmail,
    `Order #${order.number} at ${site.name}`,
    `Thanks, ${order.guestName}. The truck has your order.

Order #${order.number} - ready in about ${order.quotedMinutes} minutes.

${orderLines(order)}

  Subtotal      ${money(order.subtotalCents)}
  Taxes & fees  ${money(order.feeCents + order.taxCents)}${order.tipCents > 0 ? `\n  Tip           ${money(order.tipCents)}` : ""}
  Total         ${money(order.totalCents)}

${paidLine}
Walk up to the window and give your name. Questions? Call ${site.phone}.`
  );
}

export async function sendRefundNotice(order: Order): Promise<void> {
  if (!order.guestEmail) return;
  await send(
    order.guestEmail,
    `Refund for order #${order.number} at ${site.name}`,
    `Hi ${order.guestName},

Your refund of ${money(order.totalCents)} for order #${order.number} has been issued.

${order.paid
  ? "Card refunds usually appear on your statement in 5 to 10 business days, depending on your bank."
  : "This order was not charged online, so there is nothing further to do."}

Sorry it did not work out this time. Questions? Call ${site.phone}.`
  );
}
