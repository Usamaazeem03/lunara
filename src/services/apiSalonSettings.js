import { supabase } from "./supabase.js";
import { createClient } from "@supabase/supabase-js";

export async function getSalonInformation(ownerId) {
  if (!ownerId) throw new Error("Sign in to manage your salon.");
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
  if (!ownerId) throw new Error("Sign in to manage your salon.");
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
  if (!user?.email) throw new Error("Sign in again to change your password.");
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
    throw new Error(
      "Current password could not be verified. Check it and try again.",
    );
  try {
    if (data.user?.id !== user.id)
      throw new Error("Account could not be verified.");
    const { error } = await supabase.auth.updateUser({
      password,
      current_password: currentPassword,
    });
    if (error) throw error;
  } finally {
    await verifier.auth.signOut({ scope: "local" });
  }
}
