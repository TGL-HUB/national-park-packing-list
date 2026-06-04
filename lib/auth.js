import crypto from "crypto";

// ── Signed session token (stateless) ─────────────────────────────────────────
// A tiny HMAC-signed token stored in an HttpOnly cookie. There are no user
// accounts: anyone who enters the shared access code gets a signed session.
const COOKIE_NAME = "cc_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not configured");
  return s;
}

export function signSession() {
  const payload = b64url(JSON.stringify({ exp: Date.now() + MAX_AGE_SEC * 1000 }));
  const sig = b64url(crypto.createHmac("sha256", secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifySession(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const expected = b64url(crypto.createHmac("sha256", secret()).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

// Compare the submitted code to the configured one in constant time.
export function codeMatches(input) {
  const expected = process.env.ACCESS_CODE;
  if (!expected) throw new Error("ACCESS_CODE is not configured");
  const a = Buffer.from(String(input ?? ""));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function readCookie(req, name = COOKIE_NAME) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export function setSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${signSession()}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SEC}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

// Guard for protected endpoints. Returns true if the request is authenticated;
// otherwise writes a 401 and returns false.
export function requireAuth(req, res) {
  if (verifySession(readCookie(req))) return true;
  res.status(401).json({ error: "unauthorized" });
  return false;
}
