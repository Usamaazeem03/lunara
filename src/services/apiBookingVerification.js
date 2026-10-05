import { supabase } from "./supabase.js";

async function invokeVerification(path, body) {
  const { data, error } = await supabase.functions.invoke(
    `booking-verification/${path}`,
    { method: "POST", body },
  );

  if (error) {
    if (typeof error.context?.json === "function") {
      let response;
      try {
        response = await error.context.json();
      } catch {
        // Network and gateway errors may not have a JSON response body.
      }
      if (response?.error?.message) {
        const verificationError = new Error(response.error.message);
        verificationError.code = response.error.code || "VERIFICATION_FAILED";
        throw verificationError;
      }
    }
    throw error;
  }

  if (!data || data.error || !data.data) {
    const verificationError = new Error(
      data?.error?.message || "Unexpected email verification response.",
    );
    verificationError.code = data?.error?.code || "INVALID_VERIFICATION_RESPONSE";
    throw verificationError;
  }

  return data.data;
}

export function requestBookingVerification({ ownerId, email }) {
  return invokeVerification("request", { ownerId, email });
}

export function verifyBookingCode({ verificationId, code }) {
  return invokeVerification("verify", { verificationId, code });
}
