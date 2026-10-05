import { createClient } from "npm:@supabase/supabase-js@2.102.1";
import {
  createBookingCrypto,
  createOptionalBookingIdentity,
  createVerificationService,
} from "./bookingVerification.js";
import { createBookingEmailProvider } from "./bookingEmail.js";

const authOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
};

export function createUserClient(authorization: string | null) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: authorization ? { Authorization: authorization } : {},
      },
      auth: authOptions,
    },
  );
}

export async function createRuntimeVerificationService() {
  // This client NEVER receives caller Authorization. It is used only behind
  // server validation and service-role-only RPCs, including atomic consumption.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: authOptions },
  );
  return createVerificationService({
    admin,
    otpCrypto: await createBookingCrypto(Deno.env.get("BOOKING_OTP_SECRET")),
    getOptionalUser: createOptionalBookingIdentity(
      createUserClient,
      Deno.env.get("SUPABASE_ANON_KEY"),
    ),
    emailProvider: createBookingEmailProvider({
      apiKey: Deno.env.get("RESEND_API_KEY"),
    }),
  });
}
