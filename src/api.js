// Thin client for the gated /api endpoints. The session lives in an HttpOnly
// cookie, so requests just need credentials included; nothing sensitive is
// stored in the browser.
export class AuthError extends Error {}

async function json(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (res.status === 401) throw new AuthError("unauthorized");
  if (!res.ok) throw new Error(`request_failed_${res.status}`);
  return res.status === 204 ? null : res.json();
}

export async function login(code) {
  const res = await fetch("/api/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return res.ok;
}

export const logout = () => fetch("/api/logout", { method: "POST", credentials: "same-origin" });

export const getTrip = () => json("/api/trip");
export const putTrip = (days) => json("/api/trip", { method: "PUT", body: JSON.stringify({ days }) });

export const getList = (person) => json(`/api/list?person=${encodeURIComponent(person)}`);
export const putList = (payload) => json("/api/list", { method: "PUT", body: JSON.stringify(payload) });
