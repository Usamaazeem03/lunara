import { supabase } from "./supabase.js";

const OWNER_ID_STORAGE_KEY = "owner_id";

export const readStoredOwnerId = () => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(OWNER_ID_STORAGE_KEY);
  } catch (error) {
    console.warn("Could not read owner_id from localStorage:", error);
    return null;
  }
};

export async function getOwnerId(ownerIdOverride = null) {
  const resolvedOwnerId = ownerIdOverride ?? readStoredOwnerId();

  if (resolvedOwnerId) {
    return resolvedOwnerId;
  }

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
