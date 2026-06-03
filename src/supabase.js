import { createClient } from "@supabase/supabase-js";

// These are public, client-side keys by design. Access is governed by the
// row-level-security policies on the `person_lists` table (shared group access).
const SUPABASE_URL = "https://sinjmdlhabgywoavwjkl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vKfPqYDtbBhxsaZTimtcFw_jNVuArqy";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
