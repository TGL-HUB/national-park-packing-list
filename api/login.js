import { codeMatches, setSessionCookie } from "../lib/auth.js";
import { readJson } from "../lib/supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const { code } = await readJson(req);
  // Small fixed delay to blunt brute-forcing of the shared code.
  await new Promise((r) => setTimeout(r, 400));
  if (!codeMatches(code)) {
    return res.status(401).json({ error: "invalid_code" });
  }
  setSessionCookie(res);
  return res.status(200).json({ ok: true });
}
