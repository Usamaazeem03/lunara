import { createClient } from "npm:@supabase/supabase-js@2";
import { Redis } from "npm:@upstash/redis";
import { getSafeSocialLinks } from "../../../src/Shared/lib/socialLinks.js";

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

// ─────────────────────────────────────────────
// Redis
// ─────────────────────────────────────────────

const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

// ─────────────────────────────────────────────
// JSON response helper
//
// IMPORTANT:
// Browser caching is disabled.
// Redis is responsible for caching.
// ─────────────────────────────────────────────

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

// ─────────────────────────────────────────────
// PUBLIC SALON EDGE FUNCTION
// ─────────────────────────────────────────────

Deno.serve(async (req) => {
  // ───────────────────────────────────────────
  // 1. CORS
  // ───────────────────────────────────────────

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // ───────────────────────────────────────────
  // 2. GET only
  // ───────────────────────────────────────────

  if (req.method !== "GET") {
    return jsonResponse(
      {
        success: false,
        error: "Method not allowed",
      },
      405,
    );
  }

  try {
    // ─────────────────────────────────────────
    // 3. Get salon slug
    //
    // Example:
    // /public-salon?slug=usamasalon
    // ─────────────────────────────────────────

    const url = new URL(req.url);

    const slug = url.searchParams
      .get("slug")
      ?.trim()
      .toLowerCase();

    if (!slug) {
      return jsonResponse(
        {
          success: false,
          error: "Salon slug is required",
        },
        400,
      );
    }

    // ─────────────────────────────────────────
    // 4. Redis cache key
    //
    // MUST stay identical to:
    // invalidate-public-cache
    //
    // Example:
    // salon:usamasalon:public
    // ─────────────────────────────────────────

    const cacheKey = `salon:${slug}:public`;

    // ─────────────────────────────────────────
    // 5. Check Redis
    //
    // Redis failure should never break
    // the public salon API.
    // ─────────────────────────────────────────

    try {
      const cachedData = await redis.get<{ settings?: { socialLinks?: unknown } }>(cacheKey);

      // Refresh payloads cached before social links were added.
      if (cachedData && Array.isArray(cachedData.settings?.socialLinks)) {
        console.log(
          "PUBLIC SALON CACHE HIT:",
          cacheKey,
        );

        return jsonResponse(
          cachedData,
          200,
          {
            "X-Lunara-Cache": "HIT",
          },
        );
      }
    } catch (redisError) {
      console.error(
        "REDIS GET FAILED:",
        redisError,
      );
    }

    console.log(
      "PUBLIC SALON CACHE MISS:",
      cacheKey,
    );

    // ─────────────────────────────────────────
    // 6. Supabase environment
    // ─────────────────────────────────────────

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "Missing Supabase environment variables",
      );

      return jsonResponse(
        {
          success: false,
          error: "Server configuration error",
        },
        500,
      );
    }

    // ─────────────────────────────────────────
    // 7. Supabase client
    // ─────────────────────────────────────────

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
    );

    // ─────────────────────────────────────────
    // 8. Find salon
    //
    // ONLY select information that is safe
    // and useful for the public website.
    // ─────────────────────────────────────────

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        phone,
        salon_slug,
        avatar_img,
        address
      `)
      .eq("salon_slug", slug)
      .eq("role", "owner")
      .maybeSingle();

    if (profileError) {
      console.error(
        "PROFILE QUERY FAILED:",
        profileError,
      );

      return jsonResponse(
        {
          success: false,
          error: "Unable to load salon",
        },
        500,
      );
    }

    if (!profile) {
      return jsonResponse(
        {
          success: false,
          error: "Salon not found",
        },
        404,
      );
    }

    // ─────────────────────────────────────────
    // 9. Owner ID
    //
    // Used internally for queries.
    // Also returned because your existing
    // Lunara booking flow needs it.
    // ─────────────────────────────────────────

    const ownerId = profile.id;

    // ─────────────────────────────────────────
    // 10. Load all public salon resources
    //
    // Run them in parallel for performance.
    // ─────────────────────────────────────────

    const [
      servicesResult,
      staffResult,
      settingsResult,
      workingHoursResult,
    ] = await Promise.all([
      // ───────────── SERVICES ────────────────

      supabase
        .from("services")
        .select(`
          id,
          name,
          description,
          category,
          price,
          duration_minutes,
          image
        `)
        .eq("owner_id", ownerId)
        .eq("is_active", true),

      // ───────────── STAFF ───────────────────

      supabase
        .from("staff")
        .select(`
          id,
          name,
          role,
          is_on_shift,
          specialties,
          rating
        `)
        .eq("owner_id", ownerId)
        .order("name", {
          ascending: true,
        }),

      // ───────────── SETTINGS ────────────────
      //
      // External website URL is intentionally
      // not returned in the public payload.
      //
      // The salon's external website does not
      // need its own URL returned to it.
      // ───────────────────────────────────────

      supabase
        .from("settings")
        .select(`
          currency_code,external_website_url,social_links
        `)
        .eq("owner_id", ownerId)
        .maybeSingle(),

      // ─────────── WORKING HOURS ─────────────
      //
      // Internal fields such as:
      // owner_id
      // salon_id
      // created_at
      // are NOT exposed.
      // ───────────────────────────────────────

      supabase
        .from("working_hours")
        .select(`
          day_of_week,
          day_name,
          is_open,
          open_time,
          close_time,
          break_start,
          break_end
        `)
        .eq("owner_id", ownerId)
        .order("day_of_week", {
          ascending: true,
        }),
    ]);

    // ─────────────────────────────────────────
    // 11. Check query errors
    // ─────────────────────────────────────────

    if (servicesResult.error) {
      console.error(
        "SERVICES QUERY FAILED:",
        servicesResult.error,
      );

      throw new Error(
        "SERVICES_QUERY_FAILED",
      );
    }

    if (staffResult.error) {
      console.error(
        "STAFF QUERY FAILED:",
        staffResult.error,
      );

      throw new Error(
        "STAFF_QUERY_FAILED",
      );
    }

    if (settingsResult.error) {
      console.error(
        "SETTINGS QUERY FAILED:",
        settingsResult.error,
      );

      throw new Error(
        "SETTINGS_QUERY_FAILED",
      );
    }

    if (workingHoursResult.error) {
      console.error(
        "WORKING HOURS QUERY FAILED:",
        workingHoursResult.error,
      );

      throw new Error(
        "WORKING_HOURS_QUERY_FAILED",
      );
    }

    // ─────────────────────────────────────────
    // 12. Build clean public response
    // ─────────────────────────────────────────

    const responseData = {
      success: true,

      // ───────────── SALON ───────────────────

      salon: {
        // Keep this because your current
        // booking flow needs ownerId.
        id: profile.id,

        name: profile.full_name,
        slug: profile.salon_slug,

        image: profile.avatar_img,

        email: profile.email,
        phone: profile.phone,

        address: profile.address,
      },

      // ───────────── SERVICES ────────────────

      services:
        servicesResult.data ?? [],

      // ───────────── STAFF ───────────────────

      staff:
        staffResult.data ?? [],

      // ─────────── WORKING HOURS ─────────────

      workingHours:
        workingHoursResult.data ?? [],

      // ───────────── SETTINGS ────────────────

      settings: {
        currencyCode:
          settingsResult.data
            ?.currency_code ?? "USD",
            externalWebsiteUrl:
    settingsResult.data?.external_website_url ?? null,
        socialLinks: getSafeSocialLinks(settingsResult.data?.social_links),
      },
    };

    // ─────────────────────────────────────────
    // 13. Save complete response in Redis
    //
    // TTL = 60 seconds
    //
    // IMPORTANT:
    // invalidate-public-cache deletes this
    // key immediately after salon data changes.
    // ─────────────────────────────────────────

    try {
      await redis.set(
        cacheKey,
        responseData,
        {
          ex: 60,
        },
      );

      console.log(
        "PUBLIC SALON CACHE SAVED:",
        cacheKey,
      );
    } catch (redisError) {
      // Redis problems should not stop
      // fresh Supabase data from being returned.

      console.error(
        "REDIS SET FAILED:",
        redisError,
      );
    }

    // ─────────────────────────────────────────
    // 14. Return fresh response
    // ─────────────────────────────────────────

    return jsonResponse(
      responseData,
      200,
      {
        "X-Lunara-Cache": "MISS",
      },
    );
  } catch (error) {
    // ─────────────────────────────────────────
    // 15. Unexpected error
    // ─────────────────────────────────────────

    console.error(
      "PUBLIC SALON ERROR:",
      error,
    );

    return jsonResponse(
      {
        success: false,
        error: "Unable to load salon",
      },
      500,
    );
  }
});
