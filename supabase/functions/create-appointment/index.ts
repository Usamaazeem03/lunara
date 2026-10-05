import { createBookingHandler } from "./handler.js";
import {
  createUserClient,
  createRuntimeVerificationService,
} from "../_shared/bookingRuntime.ts";

Deno.serve(
  createBookingHandler({
    createUserClient,
    publicMode: Deno.env.get("BOOKING_PUBLIC_MODE") ?? "compat",
    async createVerifiedAppointment(
      appointment: Record<string, unknown>,
      verification: unknown,
      authorization: string | null,
    ) {
      // Lazy: owner/compat booking never requires OTP secrets or a mail provider.
      const service = await createRuntimeVerificationService();
      return service.createAppointment(
        appointment,
        verification,
        authorization,
      );
    },
  }),
);
