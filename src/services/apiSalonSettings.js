import { localizedError } from "../i18n/localizedError.js";
import { supabase } from "./supabase.js";
import { createClient } from "@supabase/supabase-js";

export async function getSalonInformation(ownerId) {
  if (!ownerId) throw localizedError("services.signInToManageYourSalon");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", ownerId)
    .eq("role", "owner")
    .single();
  if (error) throw error;
  return data;
}

export async function saveSalonInformation(ownerId, values) {
  if (!ownerId) throw localizedError("services.signInToManageYourSalon");
  const updates = Object.fromEntries(
    ["full_name", "address", "phone", "email"].map((key) => [
      key,
      String(values[key] ?? "").trim(),
    ]),
  );
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", ownerId)
    .eq("role", "owner")
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function changeAccountPassword({ currentPassword, password }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user?.email) throw localizedError("services.signInAgainToChangeYourPassword");
  // Verify without replacing the app's session or writing to browser storage.
  const verifier = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  const { data, error: verificationError } =
    await verifier.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
  if (verificationError)
    throw localizedError("services.currentPasswordCouldNotBeVerifiedCheckItAndTry");
  try {
    if (data.user?.id !== user.id)
      throw localizedError("services.accountCouldNotBeVerified");
    const { error } = await supabase.auth.updateUser({
      password,
      current_password: currentPassword,
    });
    if (error) throw error;
  } finally {
    await verifier.auth.signOut({ scope: "local" });
  }
}
