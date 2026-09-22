import { useEffect, useRef, useState } from "react";
import BookingPass from "./BookingPass.jsx";
import {
  formatPassDate,
  formatPassTime,
  getBookingStatus,
} from "./bookingPassUtils.js";

export default function ClientBookingPassCard({ appointment, initialOpen = false }) {
  const [expanded, setExpanded] = useState(initialOpen);
  const cardRef = useRef(null);
  useEffect(() => {
    if (!initialOpen) return;
    const frame = requestAnimationFrame(() => {
      cardRef.current?.querySelector("summary")?.focus({ preventScroll: true });
      cardRef.current?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [initialOpen]);
  const status = getBookingStatus(appointment.status);
  return (
    <details
      ref={cardRef}
      open={expanded}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
      className="border-ink/10 scroll-mt-4 self-start rounded-2xl border bg-white/70 p-4 sm:p-5"
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${status.tone}`}
          >
            {status.label}
          </span>
          <span className="text-ink-muted text-xs">
            {appointment.duration_minutes} min
          </span>
        </div>
        <h2 className="mt-4 text-lg font-semibold">
          {appointment.service_name || "Appointment"}
        </h2>
        <p className="text-ink-muted mt-2 text-sm">
          {formatPassDate(appointment.appointment_date)} at{" "}
          {formatPassTime(appointment.appointment_time)}
        </p>
        <p className="text-ink-muted mt-1 text-sm">
          {appointment.staff_name || "Any available stylist"}
        </p>
        <span className="border-ink/15 mt-4 flex min-h-11 items-center justify-center rounded-xl border text-sm font-semibold">
          {expanded ? "Hide booking pass" : "Show booking pass & QR"}
        </span>
      </summary>
      {expanded && (
        <div className="mt-5">
          <BookingPass appointment={appointment} />
        </div>
      )}
    </details>
  );
}
