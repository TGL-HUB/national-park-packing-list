import { requireAuth } from "../lib/auth.js";
import { getAdminClient, readJson } from "../lib/supabaseAdmin.js";

const ITINERARY_KEY = "__itinerary__"; // reserved for the shared itinerary

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const db = getAdminClient();

  if (req.method === "GET") {
    const person = String(req.query.person || "");
    if (!person || person === ITINERARY_KEY) return res.status(400).json({ error: "bad_person" });
    const { data, error } = await db
      .from("person_lists")
      .select("checked, custom_items, removed_items")
      .eq("person", person)
      .maybeSingle();
    if (error) return res.status(500).json({ error: "load_failed" });
    return res.status(200).json({
      checked: data?.checked || {},
      custom_items: data?.custom_items || [],
      removed_items: data?.removed_items || [],
    });
  }

  if (req.method === "PUT") {
    const body = await readJson(req);
    const person = String(body.person || "");
    if (!person || person === ITINERARY_KEY) return res.status(400).json({ error: "bad_person" });
    const { error } = await db.from("person_lists").upsert(
      {
        person,
        checked: body.checked || {},
        custom_items: body.custom_items || [],
        removed_items: body.removed_items || [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "person" }
    );
    if (error) return res.status(500).json({ error: "save_failed" });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "method_not_allowed" });
}
