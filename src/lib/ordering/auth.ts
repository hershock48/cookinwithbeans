// Kitchen auth: a PIN and a signed session cookie. A gate, not a vault; see
// the Copper build's file for the full reasoning. Nothing behind it moves
// money or exposes more than the ticket queue and the menu editor.
//
// WHAT CHANGED FROM THE FIRST VERSION. The cookie used to be the PIN itself,
// compared with `===`. Anyone who read the cookie had the PIN, and the compare
// leaked how many leading characters matched. Now:
//
//   - The cookie is a signed, expiring token from the shared workroom-session
//     component (src/lib/workroom/session.ts, pinned in .glazed/components.json).
//     It never contains the PIN. Its signature is bound to the PIN, so
//     changing KITCHEN_PIN signs every open session out at once.
//   - The PIN is compared in constant time over fixed-length digests, so a
//     wrong guess costs the same whether it shares zero or three characters
//     with the real one.
//   - Every login issues a fresh token with a fresh nonce, so a session that
//     leaked before sign-in is not the session in use after it.
//   - Signing needs a secret. In production that is KITCHEN_SESSION_SECRET,
//     32 characters or more, and without it nobody can sign in: the door is
//     closed rather than open. Outside production a per-process random secret
//     stands in so `next dev` works with nothing set.
//
// The login throttle lives in src/lib/workroom/login-limit.ts and is applied
// by the login route, not here.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { KITCHEN_PIN_FALLBACK } from "./config";
import { issueSession, sessionRole, SESSION_SECONDS, type WorkroomRole } from "../workroom/session";

const COOKIE = "beans_kitchen";
const SECRET_MIN = 32;

// One PIN, one role. The shared component knows staff and owner; the truck's
// board has a single PIN and every holder of it is staff. If an owner PIN is
// ever added, it becomes the second entry in pins() below and nothing else
// moves.
const ROLE: WorkroomRole = "staff";

type SecretState = typeof globalThis & { __beansSessionSecret?: string };

export function kitchenPin(): string {
  return process.env.KITCHEN_PIN || KITCHEN_PIN_FALLBACK;
}

// The signing secret, or null when production has none. The dev fallback is
// random per process on purpose: a fixed string in the repo would be a real
// secret the moment someone forgot to set the env var.
function secret(): string | null {
  const configured = process.env.KITCHEN_SESSION_SECRET;
  if (configured && configured.length >= SECRET_MIN) return configured;
  if (process.env.NODE_ENV === "production") return null;
  const g = globalThis as SecretState;
  if (!g.__beansSessionSecret) g.__beansSessionSecret = randomBytes(32).toString("hex");
  return g.__beansSessionSecret;
}

function pins(): { staff: string | null; owner: string | null } {
  return { staff: kitchenPin(), owner: null };
}

/** True when this deployment can sign anyone in at all. */
export function kitchenSessionReady(): boolean {
  return !!kitchenPin() && secret() !== null;
}

// Constant-time PIN check. Both sides are hashed to the same length first, so
// timingSafeEqual never throws on a length mismatch and the length of the
// real PIN is not something a guess can measure.
//
// Candidates over 512 characters are refused before hashing. That is a
// behavior change from the old equality check, which would hash anything: a
// PIN is four to twelve digits, so a longer candidate is never right and
// hashing a megabyte of it per guess is work the throttle should not have to
// pay for. Same cap as the DeVine workroom route.
export function pinMatches(candidate: unknown): boolean {
  if (typeof candidate !== "string" || candidate.length === 0 || candidate.length > 512) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(kitchenPin()).digest();
  return timingSafeEqual(a, b);
}

export async function isKitchenAuthed(): Promise<boolean> {
  if (!kitchenSessionReady()) return false;
  const jar = await cookies();
  return sessionRole(jar.get(COOKIE)?.value, secret(), pins()) === ROLE;
}

// Issue a fresh signed session for a PIN that has already been checked. The
// token is new on every call (fresh nonce, fresh expiry), which is the
// rotation: a login never extends an old cookie, it replaces it.
//
// sameSite is lax, not strict, so a /kitchen link opened from a text message
// still lands signed in. The cookie is httpOnly and, in production, secure.
export async function setKitchenCookie(pin: string): Promise<void> {
  const signer = secret();
  if (!kitchenSessionReady() || signer === null) throw new Error("Kitchen sessions are not configured.");
  if (!pinMatches(pin)) throw new Error("Invalid kitchen credential.");
  const jar = await cookies();
  jar.set(COOKIE, issueSession(ROLE, kitchenPin(), signer), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_SECONDS,
    path: "/",
  });
}
