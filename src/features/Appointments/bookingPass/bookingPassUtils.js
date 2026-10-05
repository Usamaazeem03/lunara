import { localizedError } from "../../../i18n/localizedError.js";
import i18n from "../../../i18n/i18n.js";
const PASS_PREFIX = "LUNARA:1";
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export function createBookingReference(appointment) {
  const ownerId = String(appointment.owner_id ?? "");
  const appointmentId = String(appointment.id ?? "");
  if (!ID_PATTERN.test(ownerId) || !ID_PATTERN.test(appointmentId)) {
    throw localizedError("bookingPass.thisAppointmentDoesNotHaveASavedBookingReference");
  }
  return `${PASS_PREFIX}:${ownerId}:${appointmentId}`;
}

// A QR is a lookup reference, not proof of payment or confirmation.
// Always obtain the status and appointment details from the database.
export function parseBookingReference(value) {
  if (typeof value !== "string" || value.length > 300) {
    throw localizedError("bookingPass.thisIsNotALunaraBookingPass");
  }
  const parts = value.trim().split(":");
  if (
    parts.length !== 4 ||
    `${parts[0]}:${parts[1]}` !== PASS_PREFIX ||
    !ID_PATTERN.test(parts[2]) ||
    !ID_PATTERN.test(parts[3])
  ) {
    throw localizedError("bookingPass.thisIsNotALunaraBookingPassScanTheQr");
  }
  return { ownerId: parts[2], appointmentId: parts[3] };
}

export function getBookingStatus(status) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return {
        label: i18n.t("common.confirmed"),
        description: i18n.t("bookingPass.yourVisitIsConfirmedShowThisPassAtTheSalon"),
        tone: "bg-[#e8eee4] text-[#405738]",
      };
    case "cancelled":
      return {
        label: i18n.t("common.cancelled"),
        description:
          i18n.t("bookingPass.thisAppointmentHasBeenCancelledThisPassIsNotValid"),
        tone: "bg-red-50 text-red-800",
      };
    case "completed":
      return {
        label: i18n.t("common.completed"),
        description: i18n.t("bookingPass.thisVisitHasAlreadyBeenCompleted"),
        tone: "bg-ink/5 text-ink-muted",
      };
    case "pending":
      return {
        label: i18n.t("bookingPass.awaitingConfirmation"),
        description:
          i18n.t("bookingPass.yourRequestIsSavedTheSalonStillNeedsToConfirm"),
        tone: "bg-amber-50 text-amber-900",
      };
    default:
      return {
        label: i18n.t("bookingPass.statusUnavailable"),
        description:
          i18n.t("bookingPass.askTheSalonToCheckThisAppointmentBeforeYourVisit"),
        tone: "bg-ink/5 text-ink-muted",
      };
  }
}

export function formatPassDate(value) {
  if (!value) return i18n.t("common.dateUnavailable");
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? i18n.t("common.dateUnavailable")
    : date.toLocaleDateString(i18n.resolvedLanguage, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function formatPassTime(value) {
  if (!value) return i18n.t("bookingPass.timeUnavailable");
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? i18n.t("common.pm") : i18n.t("common.am")}`;
}
