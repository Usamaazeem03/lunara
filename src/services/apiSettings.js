import { localizedError } from "../i18n/localizedError.js";
import { supabase } from "./supabase";
// load currency
export async function getCurrency(ownerId) {
  if (!ownerId) {
    throw localizedError("services.ownerIdIsRequiredToLoadCurrency");
  }

  const { data, error } = await supabase
    .from("settings")
    .select("currency_code")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw localizedError("services.currencyCodeCouldNotBeLoaded");
  }

  return data?.currency_code ?? null;
}

// update currency
export async function updateCurrency(ownerId, currencyCode) {
  if (!ownerId) {
    throw localizedError("services.ownerIdIsRequiredToUpdateCurrency");
  }
  if (!currencyCode) {
    throw localizedError("settings.currencyCodeIsRequiredToUpdateCurrency");
  }

  const { data, error } = await supabase
    .from("settings")
    .update({ currency_code: currencyCode })
    .eq("owner_id", ownerId)
    .select("currency_code")
    .maybeSingle();

  if (error) {
    console.error(error);
    throw localizedError("services.currencyCodeCouldNotBeUpdated");
  }

  return data?.currency_code ?? null;
}
