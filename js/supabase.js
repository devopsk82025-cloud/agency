// Replace these placeholders with your Supabase Project URL and publishable key.
// Never put a Supabase secret/service_role key in browser JavaScript.
const SUPABASE_URL = "https://nwhfohsxemacxarzgloa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_W4U_koiry0I0m8KqXe89JQ_2YHdoyyx";

if (!window.supabase) throw new Error("Supabase JS library did not load.");
if (SUPABASE_URL.startsWith("YOUR_") || SUPABASE_PUBLISHABLE_KEY.startsWith("YOUR_")) {
  console.warn("Add your Supabase URL and publishable key in js/supabase.js.");
}
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
