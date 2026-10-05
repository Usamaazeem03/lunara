import { VerificationError } from "../_shared/bookingVerification.js";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};
const reply = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers });

export function createVerificationHandler({ getService }) {
  return async (request) => {
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    if (request.method !== "POST")
      return reply(
        { error: { code: "METHOD_NOT_ALLOWED", message: "Use POST." } },
        405,
      );
    const action = new URL(request.url).pathname.match(
      /\/booking-verification\/(request|verify)\/?$/,
    )?.[1];
    if (!action)
      return reply(
        { error: { code: "NOT_FOUND", message: "Unknown verification path." } },
        404,
      );
    try {
      const text = await request.text();
      if (text.length > 4096)
        throw new VerificationError("INVALID_REQUEST", "Request is too large.");
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        throw new VerificationError("INVALID_REQUEST", "Expected JSON.");
      }
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new VerificationError("INVALID_REQUEST", "Expected an object.");
      const service = await getService();
      const data =
        action === "request"
          ? await service.request(body, request.headers.get("Authorization"))
          : await service.verify(body);
      return reply({ data, error: null });
    } catch (error) {
      if (error instanceof VerificationError)
        return reply(
          { data: null, error: { code: error.code, message: error.message } },
          error.status,
        );
      return reply(
        {
          data: null,
          error: {
            code: "VERIFICATION_UNAVAILABLE",
            message: "Verification is temporarily unavailable.",
          },
        },
        503,
      );
    }
  };
}
