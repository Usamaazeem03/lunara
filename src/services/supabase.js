import { createClient } from "@supabase/supabase-js";

// Use environment variables (Vite uses import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for development (remove in production!)
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
