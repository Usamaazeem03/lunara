const encoder = new TextEncoder();
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export class VerificationError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function normalizeBookingEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new VerificationError(
      "INVALID_EMAIL",
      "Enter a valid email address.",
    );
  }
  return email;
}

export function requireVerificationId(value) {
  if (typeof value !== "string" || !uuidPattern.test(value)) {
    throw new VerificationError(
      "INVALID_VERIFICATION",
      "Invalid verification reference.",
    );
  }
  return value;
}

export function generateBookingCode() {
  // Rejection sampling avoids modulo bias over all one million 6-digit codes.
  const buffer = new Uint32Array(1);
  const limit = 2 ** 32 - (2 ** 32 % 1000000);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return String(buffer[0] % 1000000).padStart(6, "0");
}

export async function createBookingCrypto(secret) {
  if (typeof secret !== "string" || encoder.encode(secret).length < 32) {
    throw new VerificationError(
      "OTP_CONFIGURATION",
      "Verification is not configured.",
      503,
    );
  }
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const message = (id, code) =>
    encoder.encode(`lunara-booking-otp-v1:${id}:${code}`);
  return {
    async hashCode(id, code) {
      return hex(
        new Uint8Array(
          await crypto.subtle.sign("HMAC", key, message(id, code)),
        ),
      );
    },
    async matchesCode(id, code, storedHash) {
      if (!/^[0-9a-f]{64}$/.test(storedHash ?? "")) return false;
      const signature = Uint8Array.from(storedHash.match(/../g), (byte) =>
        Number.parseInt(byte, 16),
      );
      // Native cryptographic verification, not an early-return string comparison.
      return crypto.subtle.verify("HMAC", key, signature, message(id, code));
    },
  };
}

export async function hashBookingProof(token) {
  return hex(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", encoder.encode(token)),
    ),
  );
}

export function createOptionalBookingIdentity(createUserClient, anonKey) {
  return async (authorization) => {
    if (!authorization) return null;
    const token = authorization.match(/^Bearer\s+(\S+)$/i)?.[1];
    // The SDK sends the public anon API key for signed-out visitors. This is
    // anonymous access, never an authenticated identity or owner exemption.
    if (token && token === anonKey) return null;
    if (!token)
      throw new VerificationError("INVALID_AUTH", "Invalid session.", 401);
    const { data, error } =
      await createUserClient(authorization).auth.getUser(token);
    if (error || !data?.user?.id)
      throw new VerificationError(
        "INVALID_AUTH",
        "Invalid or expired session.",
        401,
      );
    return data.user;
  };
}

export function createVerificationService({
  admin,
  otpCrypto,
  emailProvider,
  getOptionalUser,
}) {
  async function rpc(name, params) {
    const { data, error } = await admin.rpc(name, params);
    if (error) throw error;
    if (data?.error)
      throw new VerificationError(
        data.error,
        data.message,
        data.error === "RATE_LIMITED" ? 429 : 400,
      );
    return data;
  }
  return {
    async request({ ownerId, email }, authorization) {
      requireVerificationId(ownerId);
      email = normalizeBookingEmail(email);
      // Fail before storing/sending when delivery is not configured.
      emailProvider.assertConfigured();
      const user = await getOptionalUser(authorization);
      const id = crypto.randomUUID();
      const code = generateBookingCode();
      const codeHash = await otpCrypto.hashCode(id, code);
      const result = await rpc("request_booking_verification", {
        p_id: id,
        p_owner_id: ownerId,
        p_email: email,
        p_code_hash: codeHash,
        p_auth_user_id: user?.id ?? null,
      });
      try {
        await emailProvider.sendCode({
          email,
          code,
          verificationId: id,
          expiresInMinutes: 10,
        });
        await rpc("set_booking_verification_delivery", {
          p_id: id,
          p_sent: true,
        });
      } catch {
        // A failed/ambiguous delivery cannot produce usable verification. Never
        // return/log the provider response, OTP, token, or email credentials.
        await rpc("set_booking_verification_delivery", {
          p_id: id,
          p_sent: false,
        });
        throw new VerificationError(
          "DELIVERY_FAILED",
          "The code could not be delivered. Please try again later.",
          503,
        );
      }
      return { verificationId: id, expiresAt: result.expires_at };
    },
    async verify({ verificationId, code }) {
      requireVerificationId(verificationId);
      // Malformed codes count as failed attempts too; do not coerce numbers.
      const candidate =
        typeof code === "string" && /^\d{6}$/.test(code) ? code : "invalid";
      const { data: record, error } = await admin
        .from("booking_verifications")
        .select("code_hash")
        .eq("id", verificationId)
        .maybeSingle();
      if (error) throw error;
      if (!record)
        throw new VerificationError(
          "INVALID_VERIFICATION",
          "Invalid or expired verification.",
        );
      const matches = await otpCrypto.matchesCode(
        verificationId,
        candidate,
        record.code_hash,
      );
      const token = hex(crypto.getRandomValues(new Uint8Array(32)));
      const result = await rpc("verify_booking_code", {
        p_id: verificationId,
        p_code_matches: matches,
        p_proof_hash: await hashBookingProof(token),
      });
      return { verificationId, token, expiresAt: result.expires_at };
    },
    async createAppointment(appointment, verification, authorization) {
      requireVerificationId(verification?.verificationId);
      if (
        typeof verification?.token !== "string" ||
        !/^[0-9a-f]{64}$/.test(verification.token)
      ) {
        throw new VerificationError(
          "VERIFICATION_REQUIRED",
          "Verify your email before booking.",
          403,
        );
      }
      const user = await getOptionalUser(authorization);
      const payload = {
        ...appointment,
        client_email: normalizeBookingEmail(appointment.client_email),
      };
      // The DB binds email/salon/account and locks/consumes the proof in the same
      // transaction as INSERT and reward triggers. No Edge read-then-consume race.
      const rows = await rpc("create_verified_public_appointment", {
        p_verification_id: verification.verificationId,
        p_proof_hash: await hashBookingProof(verification.token),
        p_auth_user_id: user?.id ?? null,
        p_appointment: payload,
      });
      return rows;
    },
  };
}
