import { supabase } from "./supabase.js";
import { localizedError } from "../i18n/localizedError.js";
import {
  getSafeSocialLinks,
  normalizeSocialUrl,
  SOCIAL_LINK_TITLE_MAX_LENGTH,
} from "../Shared/lib/socialLinks.js";

function settingsError(error, fallback) {
  if (["42703", "PGRST204"].includes(error?.code)) {
    return localizedError("settings.socialLinks.setupRequired");
  }
  return localizedError(fallback);
}

export async function getSocialLinks(ownerId) {
  if (!ownerId)
    throw localizedError("settings.authenticatedOwnerCouldNotBeFound");
  const { data, error } = await supabase
    .from("settings")
    .select("social_links")
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error) throw settingsError(error, "settings.socialLinks.loadFailed");
  if (!data) throw localizedError("settings.socialLinks.settingsMissing");
  return getSafeSocialLinks(data.social_links);
}

export async function saveSocialLinks(ownerId, values) {
  if (!ownerId)
    throw localizedError("settings.authenticatedOwnerCouldNotBeFound");
  if (!Array.isArray(values)) throw localizedError("settings.socialLinks.saveFailed");
  for (const link of values) {
    if (typeof link?.title !== "string" || !link.title.trim()) {
      throw localizedError("settings.socialLinks.titleRequired");
    }
    if (link.title.trim().length > SOCIAL_LINK_TITLE_MAX_LENGTH) {
      throw localizedError("settings.socialLinks.titleTooLong");
    }
    if (!normalizeSocialUrl(link.url)) {
      throw localizedError("settings.socialLinks.invalidPlatformUrl", {
        value1: link.title,
      });
    }
  }
  const links = getSafeSocialLinks(values);
  const { data, error } = await supabase
    .from("settings")
    .update({ social_links: { links } })
    .eq("owner_id", ownerId)
    .select("social_links")
    .single();
  if (error?.code === "PGRST116")
    throw localizedError("settings.socialLinks.settingsMissing");
  if (error) throw settingsError(error, "settings.socialLinks.saveFailed");
  return getSafeSocialLinks(data.social_links);
}
