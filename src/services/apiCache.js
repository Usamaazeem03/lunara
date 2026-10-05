import { supabase } from "./supabase";

/**
 * Invalidate one section of the public salon cache.
 *
 * Cache invalidation is best-effort.
 * A cache failure must NOT make the main database mutation fail.
 */
export async function invalidatePublicCache(resource) {
  if (!resource) {
    console.warn("Cache resource is required.");
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "invalidate-public-cache",
      {
        method: "POST",
        body: {
          resource,
        },
      },
    );

    if (error) {
      console.error(`Failed to invalidate "${resource}" cache:`, error);

      return false;
    }

    if (!data?.success) {
      console.error(`Failed to invalidate "${resource}" cache:`, data?.error);

      return false;
    }

    console.log(`CACHE INVALIDATED: ${resource}`);

    return true;
  } catch (error) {
    console.error(
      `Cache invalidation request failed for "${resource}":`,
      error,
    );

    return false;
  }
}
