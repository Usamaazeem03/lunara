// Dependency injection keeps transport/error contracts testable without loading
// browser auth or translations. This switch is deployment staging, NOT security.
export function createAppointmentTransport(supabase, transport = "direct") {
  return async function createAppointment(path, appointment, verification) {
    if (transport === "direct") {
      if (verification !== undefined) {
        return {
          data: null,
          error: {
            code: "BOOKING_CONFIGURATION",
            message: "Verified bookings require the server booking endpoint.",
          },
        };
      }
      const { data, error } = await supabase
        .from("appointments")
        .insert(appointment)
        .select("*");
      return { data, error };
    }
    if (transport !== "edge") {
      return {
        data: null,
        error: {
          code: "BOOKING_CONFIGURATION",
          message: "Unknown booking transport.",
        },
      };
    }

    const { data, error } = await supabase.functions.invoke(
      `create-appointment/${path}`,
      {
        method: "POST",
        body: {
          appointment,
          ...(verification !== undefined ? { verification } : {}),
        },
      },
    );
    if (error) {
      // Supabase wraps non-2xx responses in FunctionsHttpError. Retain Postgres
      // codes and details for the existing owner retries/error presentation.
      if (typeof error.context?.json === "function") {
        try {
          const body = await error.context.json();
          if (body?.error?.message) return { data: null, error: body.error };
        } catch {
          /* Gateway/network errors may not contain JSON. */
        }
      }
      return { data: null, error };
    }
    if (!data || !Array.isArray(data.data) || data.error) {
      return {
        data: null,
        error: data?.error ?? {
          code: "INVALID_BOOKING_RESPONSE",
          message:
            "Unexpected booking response. Please check your bookings before trying again.",
        },
      };
    }
    // No fallback to direct INSERT after any Edge Function failure.
    return data;
  };
}
