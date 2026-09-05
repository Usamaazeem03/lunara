import { supabase } from "../../services/supabase";

export async function initializeCurrencyCode(ownerId, currencyCode = "USD") {
  if (!ownerId) return;

  const { data: existingSetting, error: selectError } = await supabase
    .from("settings")
    .select("id")
    .eq("owner_id", ownerId)
    .limit(1)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existingSetting) return;

  const { error: insertError } = await supabase.from("settings").insert({
    owner_id: ownerId,
    currency_code: currencyCode,
  });

  if (insertError) throw insertError;
}
