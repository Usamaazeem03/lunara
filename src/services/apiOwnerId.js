import { supabase } from "./supabase.js";

export async function getOwnerId(ownerIdOverride = null) {
  // Client booking must read the salon owner's settings, not the client's.
  if (ownerIdOverride) return ownerIdOverride;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to load owner id:", error);
    throw new Error("owner_id could not be loaded");
  }

  return user?.id ?? null;
}
