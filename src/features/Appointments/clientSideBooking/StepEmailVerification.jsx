import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const CODE_LENGTH = 6;

function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  const visible = localPart.length > 2 ? localPart.slice(0, 2) : localPart.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(3, localPart.length - visible.length))}@${domain}`;
}

export default function StepEmailVerification({
  email,
  state,
  onRequestCode,
  onVerifyCode,
  onRetryBooking,
}) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [now, setNow] = useState(() => Date.now());
  const inputs = useRef([]);
  const requestedEmail = useRef("");
  const resendSeconds = Math.max(
    0,
    Math.ceil((new Date(state.resendAvailableAt || 0).getTime() - now) / 1000),
  );

  useEffect(() => {
    if (requestedEmail.current === email || state.email === email) return;
    requestedEmail.current = email;
    onRequestCode();
  }, [email, onRequestCode, state.email]);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = window.setTimeout(
      () => setNow(Date.now()),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (state.status === "ready" && state.expiresAt) {
      inputs.current[0]?.focus();
    }
  }, [state.status, state.expiresAt]);

  const beginRequest = async () => {
    setDigits(Array(CODE_LENGTH).fill(""));
    await onRequestCode({ force: true });
  };

  const updateDigit = (index, rawValue) => {
    const sanitized = rawValue.replace(/\D/g, "");
    if (sanitized.length > 1) {
      setDigits(Array.from({ length: CODE_LENGTH }, (_, position) => sanitized[position] || ""));
      inputs.current[Math.min(sanitized.length, CODE_LENGTH) - 1]?.focus();
      return;
    }
    const value = sanitized.slice(-1);
    setDigits((current) => current.map((digit, position) =>
      position === index ? value : digit,
    ));
    if (value && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        setDigits((current) => current.map((digit, position) =>
          position === index - 1 ? "" : digit,
        ));
      } else {
        setDigits((current) => current.map((digit, position) =>
          position === index ? "" : digit,
        ));
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    setDigits(Array.from({ length: CODE_LENGTH }, (_, index) => pasted[index] || ""));
    inputs.current[Math.min(pasted.length, CODE_LENGTH) - 1]?.focus();
  };

  const submitCode = async (event) => {
    event.preventDefault();
    if (digits.join("").length !== CODE_LENGTH || state.status !== "ready") return;
    await onVerifyCode(digits.join(""));
  };

  const errorMessage = {
    wrong_code: t("booking.verificationWrongCode"),
    expired: t("booking.verificationExpired"),
    attempts_exhausted: t("booking.verificationAttemptsExhausted"),
    delivery_failed: t("booking.verificationDeliveryFailed"),
    network_failed: t("booking.verificationNetworkFailed"),
    request_failed: t("booking.verificationRequestFailed"),
    booking_failed: t("booking.verificationBookingFailed"),
  }[state.errorType];

  const isRequesting = state.status === "requesting";
  const isVerifying = state.status === "verifying";
  const isBooking = state.status === "booking";
  const isExpired = state.status === "expired";
  const isExhausted = state.status === "attempts_exhausted";
  const canResend = !isRequesting && !isVerifying && !isBooking && resendSeconds === 0;

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3efe9] text-xl" aria-hidden="true">
        @
      </div>
      <p className="text-ink-muted text-[10px] font-semibold tracking-[0.2em] uppercase">
        {t("booking.bookingEmailCheck")}
      </p>
      <h3 className="text-ink mt-2 text-2xl font-semibold">
        {t("booking.checkYourEmail")}
      </h3>
      <p className="text-ink-muted mt-3 text-sm leading-6">
        {t("booking.bookingCodeSentTo")}
      </p>
      <p className="text-ink mt-1 break-all text-sm font-semibold" aria-label={maskEmail(email)}>
        {maskEmail(email)}
      </p>

      {state.status === "booking_error" ? (
        <div className="mt-7">
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={onRetryBooking}
            className="mt-5 min-h-12 w-full rounded-xl bg-ink px-5 text-sm font-semibold text-cream"
          >
            {t("booking.retryBooking")}
          </button>
        </div>
      ) : (
        <form onSubmit={submitCode} className="mt-7">
          <fieldset disabled={isRequesting || isVerifying || isBooking || isExpired || isExhausted}>
            <legend className="mb-3 text-sm font-medium text-ink">
              {t("booking.enterSixDigitCode")}
            </legend>
            <div
              className="mx-auto grid w-full max-w-[22rem] grid-cols-6 gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { inputs.current[index] = element; }}
                  aria-label={t("booking.digitOfSix", { value1: index + 1 })}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className="h-11 w-full min-w-0 rounded-xl border border-ink/20 bg-[#fffdf9] text-center text-xl font-semibold leading-none text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:opacity-60 sm:h-14"
                />
              ))}
            </div>
          </fieldset>

          {errorMessage && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              {errorMessage}
            </p>
          )}
          {state.status === "requesting" && (
            <p role="status" className="mt-4 text-sm text-ink-muted">
              {t("booking.sendingVerificationCode")}
            </p>
          )}
          {(isVerifying || isBooking) && (
            <p role="status" aria-live="polite" className="mt-4 text-sm text-ink-muted">
              {isBooking ? t("booking.confirmingYourAppointment") : t("booking.checkingVerificationCode")}
            </p>
          )}
          {state.status === "ready" && state.expiresAt && (
            <p className="text-ink-muted mt-4 text-xs">{t("booking.codeExpiresInTenMinutes")}</p>
          )}

          <button
            type="submit"
            disabled={digits.join("").length !== CODE_LENGTH || state.status !== "ready"}
            className="mt-6 min-h-12 w-full rounded-xl bg-ink px-5 text-sm font-semibold text-cream transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isVerifying
              ? t("booking.checkingVerificationCode")
              : isBooking
                ? t("booking.confirmingYourAppointment")
                : t("booking.verifyAndBook")}
          </button>
        </form>
      )}

      {state.status !== "booking_error" && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
          <span className="text-ink-muted">{t("booking.didNotGetTheCode")}</span>
          <button
            type="button"
            disabled={!canResend}
            onClick={beginRequest}
            className="min-h-11 font-semibold text-ink underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isRequesting
              ? t("booking.sendingVerificationCode")
              : resendSeconds > 0
                ? t("booking.resendInSeconds", { value1: resendSeconds })
                : t("booking.resendCode")}
          </button>
        </div>
      )}
    </section>
  );
}
