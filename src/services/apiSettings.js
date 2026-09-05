import { supabase } from "./supabase";
// load currency
export async function getCurrency(ownerId) {
  if (!ownerId) {
    throw new Error("owner_id is required to load currency");
  }

  const { data, error } = await supabase
    .from("settings")
    .select("currency_code")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("currency_code could not be loaded");
  }

  return data?.currency_code ?? null;
}

// update currency
export async function updateCurrency(ownerId, currencyCode) {
  if (!ownerId) {
    throw new Error("owner_id is required to update currency");
  }
  if (!currencyCode) {
    throw new Error("currency_code is required to update currency");
  }

  const { data, error } = await supabase
    .from("settings")
    .update({ currency_code: currencyCode })
    .eq("owner_id", ownerId)
    .select("currency_code")
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("currency_code could not be updated");
  }

  return data?.currency_code ?? null;
}
