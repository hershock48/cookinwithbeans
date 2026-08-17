// Kitchen auth: a PIN and a cookie. A gate, not a vault; see the Copper
// build's identical file for the full reasoning. Nothing behind it moves
// money or exposes more than the ticket queue and the menu editor.

import { cookies } from "next/headers";
import { KITCHEN_PIN_FALLBACK } from "./config";

const COOKIE = "beans_kitchen";

export function kitchenPin(): string {
  return process.env.KITCHEN_PIN || KITCHEN_PIN_FALLBACK;
}

export async function isKitchenAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === kitchenPin();
}

export async function setKitchenCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, kitchenPin(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 18,
    path: "/",
  });
}
