import { supabase } from "./supabase";
import { validateInternationalPhone } from "../Shared/lib/phoneValidation";

export async function getClientInformation(userId) {
  if (!userId) throw new Error("Sign in to manage your information.");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .eq("role", "client")
    .single();
  if (error) throw error;
  return data;
}

export async function saveClientInformation(userId, values) {
  if (!userId) throw new Error("Sign in to manage your information.");
  const updates = Object.fromEntries(
    ["full_name", "phone", "email"].map((key) => [
      key,
      String(values[key] ?? "").trim(),
    ]),
  );
  if (!updates.full_name) throw new Error("Full name is required.");
  const phoneError = validateInternationalPhone(updates.phone);
  if (phoneError !== true) throw new Error(phoneError);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email))
    throw new Error("Enter a valid email address.");
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .eq("role", "client")
    .select()
    .single();
  if (error) throw error;
  return data;
}
