import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service-role key. This bypasses RLS and
// must NEVER be shipped to the browser — it only ever runs inside the serverless
// functions in /api. Once RLS is locked down, this is the only way in.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://sinjmdlhabgywoavwjkl.supabase.co";

let client = null;

export function getAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  if (!client) {
    client = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

// Read JSON body from a Vercel Node request (req.body may be unparsed).
export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return await new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}
