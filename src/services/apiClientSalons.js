import { localizedError } from "../i18n/localizedError.js";
import { supabase } from "./supabase.js";

export async function findClientSalons(search = "") {
  let query = supabase.from("profiles")
    .select("id, full_name, salon_slug, avatar_img")
    .eq("role", "owner")
    .not("salon_slug", "is", null)
    .order("full_name", { ascending: true })
    .limit(30);
  const term = search.trim().replace(/[%_]/g, "");
  if (term) query = query.ilike("full_name", `%${term}%`);
  const { data, error } = await query;
  if (error) throw localizedError("clients.salonsCouldNotBeLoadedTryAgainOrOpenYour");
  return data ?? [];
}
