import { localizedError } from "../i18n/localizedError.js";
import { supabase } from "./supabase.js";
import { initializeCurrencyCode } from "../features/settings/initialCurrencyCodeUplode.js";
import { createAuthApi } from "./createAuthApi.js";

export function subscribeToAuthChanges(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

export async function getSignupCountry({ signal }) {
  const token = import.meta.env.VITE_IPINFO_TOKEN;
  if (!token) return null;
  const response = await fetch(
    `https://api.ipinfo.io/lite/me?token=${encodeURIComponent(token)}`,
    { signal },
  );
  if (!response.ok) throw localizedError("auth.countryDetectionIsUnavailable");
  const data = await response.json();
  return data.country_code || null;
}

export const {
  getAuthProfile,
  updateAuthProfile,
  signOut,
  signIn,
  resumeSavedAccount,
  signUp,
  signInWithGoogle,
  requestPasswordReset,
  resetRecoveredPassword,
  completeAuthCallback,
} = createAuthApi({
  supabase,
  initializeCurrencyCode,
  getOrigin: () => window.location.origin,
  getPublicUrl: () => import.meta.env.VITE_PUBLIC_URL || window.location.origin,
});
