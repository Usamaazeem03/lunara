import { createRuntimeVerificationService } from "../_shared/bookingRuntime.ts";
import { createVerificationHandler } from "./handler.js";

Deno.serve(
  createVerificationHandler({ getService: createRuntimeVerificationService }),
);
