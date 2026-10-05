import { localizedError } from "../i18n/localizedError.js";
import { supabaseUrl } from "./supabase.js";
import { getSafeSocialLinks } from "../Shared/lib/socialLinks.js";

export async function getPublicSalon(slug) {
  if (!slug) {
    throw localizedError("salon.salonNotFoundPleaseCheckTheUrl");
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/public-salon?slug=${encodeURIComponent(slug)}`,
    );

    const data = await response.json();

    if (response.status === 404) {
      throw localizedError("salon.salonNotFoundPleaseCheckTheUrl");
    }

    if (!response.ok || !data?.success) {
      console.error("Public salon API failed:", data);
      throw localizedError("salon.failedToLoadSalonData");
    }

    return {
      salon: data.salon,
      services: data.services ?? [],
      staff: data.staff ?? [],
      settings: {
        currencyCode: data.settings?.currencyCode ?? "USD",
        externalWebsiteUrl: data.settings?.externalWebsiteUrl ?? null,
        socialLinks: getSafeSocialLinks(data.settings?.socialLinks),
      },
    };
  } catch (error) {
    console.error("Public salon failed to load:", error);
    throw error;
  }
}
