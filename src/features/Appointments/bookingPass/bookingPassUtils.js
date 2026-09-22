const PASS_PREFIX = "LUNARA:1";
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export function createBookingReference(appointment) {
  const ownerId = String(appointment.owner_id ?? "");
  const appointmentId = String(appointment.id ?? "");
  if (!ID_PATTERN.test(ownerId) || !ID_PATTERN.test(appointmentId)) {
    throw new Error(
      "This appointment does not have a saved booking reference.",
    );
  }
  return `${PASS_PREFIX}:${ownerId}:${appointmentId}`;
}

// A QR is a lookup reference, not proof of payment or confirmation.
// Always obtain the status and appointment details from the database.
export function parseBookingReference(value) {
  if (typeof value !== "string" || value.length > 300) {
    throw new Error("This is not a Lunara booking pass.");
  }
  const parts = value.trim().split(":");
  if (
    parts.length !== 4 ||
    `${parts[0]}:${parts[1]}` !== PASS_PREFIX ||
    !ID_PATTERN.test(parts[2]) ||
    !ID_PATTERN.test(parts[3])
  ) {
    throw new Error(
      "This is not a Lunara booking pass. Scan the QR on the client's appointment pass.",
    );
  }
  return { ownerId: parts[2], appointmentId: parts[3] };
}

export function getBookingStatus(status) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return {
        label: "Confirmed",
        description: "Your visit is confirmed. Show this pass at the salon.",
        tone: "bg-[#e8eee4] text-[#405738]",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        description:
          "This appointment has been cancelled. This pass is not valid for a visit.",
        tone: "bg-red-50 text-red-800",
      };
    case "completed":
      return {
        label: "Completed",
        description: "This visit has already been completed.",
        tone: "bg-ink/5 text-ink-muted",
      };
    case "pending":
      return {
        label: "Awaiting confirmation",
        description:
          "Your request is saved. The salon still needs to confirm your visit.",
        tone: "bg-amber-50 text-amber-900",
      };
    default:
      return {
        label: "Status unavailable",
        description:
          "Ask the salon to check this appointment before your visit.",
        tone: "bg-ink/5 text-ink-muted",
      };
  }
}

export function formatPassDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function formatPassTime(value) {
  if (!value) return "Time unavailable";
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
