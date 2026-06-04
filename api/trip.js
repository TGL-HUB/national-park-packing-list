import { requireAuth } from "../lib/auth.js";
import { getAdminClient, readJson } from "../lib/supabaseAdmin.js";
import { TRIP, CREW, LOGISTICS, RESERVATIONS, DAYS, FUN_FACTS, PEOPLE } from "../lib/tripData.js";

// The shared itinerary lives in one reserved row of the person_lists table
// (the days array is stored in its `custom_items` jsonb column).
const ITINERARY_KEY = "__itinerary__";

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const db = getAdminClient();

  if (req.method === "GET") {
    const { data, error } = await db
      .from("person_lists")
      .select("custom_items")
      .eq("person", ITINERARY_KEY)
      .maybeSingle();

    let days = DAYS;
    if (!error && data && Array.isArray(data.custom_items) && data.custom_items.length) {
      days = data.custom_items;
    } else if (!error) {
      // Seed the shared baseline from the default plan (best-effort).
      await db.from("person_lists").upsert(
        { person: ITINERARY_KEY, custom_items: DAYS, checked: {}, removed_items: [], updated_at: new Date().toISOString() },
        { onConflict: "person" }
      );
    }

    return res.status(200).json({
      reference: { trip: TRIP, crew: CREW, logistics: LOGISTICS, reservations: RESERVATIONS, funFacts: FUN_FACTS, people: PEOPLE },
      defaultDays: DAYS,
      days,
    });
  }

  if (req.method === "PUT") {
    const { days } = await readJson(req);
    if (!Array.isArray(days)) return res.status(400).json({ error: "days_must_be_array" });
    const { error } = await db.from("person_lists").upsert(
      { person: ITINERARY_KEY, custom_items: days, checked: {}, removed_items: [], updated_at: new Date().toISOString() },
      { onConflict: "person" }
    );
    if (error) return res.status(500).json({ error: "save_failed" });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "method_not_allowed" });
}
