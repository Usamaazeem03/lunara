const resendEndpoint = "https://api.resend.com/emails";
const bookingSender = "Lunara <booking@lunara-booking.com>";

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

export function createBookingEmailProvider({ apiKey, fetchImpl = fetch }) {
  function assertConfigured() {
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      throw new Error("Booking email provider is not configured");
    }
  }

  return {
    assertConfigured,
    async sendCode({ email, code, verificationId, expiresInMinutes }) {
      assertConfigured();
      const escapedCode = escapeHtml(code);
      const expires = escapeHtml(expiresInMinutes);
      const text = [
        "Lunara",
        "",
        `Your booking verification code is ${code}.`,
        "Enter this code to confirm your booking.",
        `This code expires in ${expiresInMinutes} minutes.`,
        "",
        "If you didn't request this booking, you can ignore this email.",
      ].join("\n");
      const html = [
        '<div style="font-family:Arial,sans-serif;color:#2d2620;line-height:1.6">',
        '<h1 style="font-size:22px">Lunara</h1>',
        "<p>Use this code to confirm your booking:</p>",
        `<p style="font-size:30px;font-weight:700;letter-spacing:8px">${escapedCode}</p>`,
        `<p>This code expires in ${expires} minutes.</p>`,
        "<p>If you didn't request this booking, you can ignore this email.</p>",
        "</div>",
      ].join("");

      const response = await fetchImpl(resendEndpoint, {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": verificationId,
        },
        body: JSON.stringify({
          from: bookingSender,
          to: [email],
          subject: "Your Lunara booking verification code",
          text,
          html,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.text();

        console.error("Resend email failed:", {
          status: response.status,
          body: errorBody,
        });

        throw new Error("Booking email delivery failed");
      }
    },
  };
}
