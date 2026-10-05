import { localizedError } from "../i18n/localizedError.js";
import { supabase } from "./supabase";

// Load external website URL
export async function getExternalWebsite(ownerId) {
  if (!ownerId) {
    throw localizedError("settings.ownerIdIsRequiredToLoadWebsite");
  }

  const { data, error } = await supabase
    .from("settings")
    .select("external_website_url")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw localizedError("settings.websiteCouldNotBeLoaded");
  }

  return data?.external_website_url ?? null;
}

// Update external website URL
export async function updateExternalWebsite(ownerId, websiteUrl) {
  if (!ownerId) {
    throw localizedError("settings.ownerIdIsRequiredToUpdateWebsite");
  }

  // Empty input means:
  // use the normal Lunara public page.
  const normalizedUrl = websiteUrl?.trim() || null;

  const { data, error } = await supabase
    .from("settings")
    .update({
      external_website_url: normalizedUrl,
    })
    .eq("owner_id", ownerId)
    .select("external_website_url")
    .maybeSingle();

  if (error) {
    console.error(error);
    throw localizedError("settings.websiteCouldNotBeUpdated");
  }

  return data?.external_website_url ?? null;
}
