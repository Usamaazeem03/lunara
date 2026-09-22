import { useCallback, useEffect, useRef, useState } from "react";
import { verifyBookingPass } from "../../../services/apiBookingPass.js";
import { formatCurrency } from "../../../utils/currency.js";
import {
  formatPassDate,
  formatPassTime,
  getBookingStatus,
} from "./bookingPassUtils.js";
import { readQrImage } from "./qrScanner.js";
import BookingCamera from "./BookingCamera.jsx";

export default function VerifyBookingDialog({
  ownerId,
  currencyCode,
  onClose,
  onViewDetails,
}) {
  const dialogRef = useRef(null);
  const mounted = useRef(false);
  const verifying = useRef(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    mounted.current = true;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      mounted.current = false;
      dialog.close();
    };
  }, []);

  const verify = useCallback(
    async (value) => {
      if (verifying.current) return;
      verifying.current = true;
      setCameraOpen(false);
      setBusy(true);
      setError("");
      setAppointment(null);
      try {
        const booking = await verifyBookingPass(value, ownerId);
        if (mounted.current) setAppointment(booking);
      } catch (cause) {
        if (mounted.current) setError(cause.message);
      } finally {
        verifying.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [ownerId],
  );

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || verifying.current) return;
    setCameraOpen(false);
    setError("");
    setAppointment(null);
    setBusy(true);
    verifying.current = true;
    try {
      const value = await readQrImage(file);
      if (!mounted.current) return;
      verifying.current = false;
      await verify(value);
    } catch (cause) {
      if (mounted.current) setError(cause.message);
    } finally {
      verifying.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  const status = appointment ? getBookingStatus(appointment.status) : null;
  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="verify-booking-title"
      className="border-ink/10 text-ink m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-3xl border bg-[#fffdf9] p-5 shadow-2xl backdrop:bg-black/45 sm:p-7"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-ink-muted text-[10px] tracking-[0.2em] uppercase">
            Lunara front desk
          </p>
          <h2 id="verify-booking-title" className="mt-2 text-2xl font-semibold">
            Verify a booking
          </h2>
          <p className="text-ink-muted mt-2 text-sm leading-6">
            Scan the client's pass to see the latest appointment details.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close verification"
          className="border-ink/15 h-11 w-11 shrink-0 rounded-full border text-xl"
        >
          &times;
        </button>
      </div>
      {cameraOpen ? (
        <BookingCamera onScan={verify} onStop={() => setCameraOpen(false)} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy || !ownerId}
            onClick={() => {
              setAppointment(null);
              setError("");
              setCameraOpen(true);
            }}
            className="bg-ink text-cream min-h-14 rounded-xl px-3 text-sm font-semibold disabled:opacity-50"
          >
            Scan with camera
          </button>
          <label
            className={`border-ink/15 flex min-h-14 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-semibold focus-within:outline-2 focus-within:outline-offset-2 ${busy || !ownerId ? "opacity-50" : ""}`}
          >
            Upload QR image
            <input
              type="file"
              accept="image/*"
              onChange={upload}
              disabled={busy || !ownerId}
              className="sr-only"
            />
          </label>
        </div>
      )}
      {!cameraOpen && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            verify(reference);
          }}
          className="mt-5 space-y-2"
        >
          <label
            htmlFor="booking-reference"
            className="text-ink-muted text-xs font-medium"
          >
            Or paste the booking reference
          </label>
          <div className="flex gap-2">
            <input
              id="booking-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="LUNARA:1:..."
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="border-ink/20 min-h-12 min-w-0 flex-1 rounded-xl border bg-white px-3 text-base"
            />
            <button
              type="submit"
              disabled={busy || !ownerId || !reference.trim()}
              className="border-ink min-h-12 rounded-xl border px-4 text-sm font-semibold disabled:opacity-40"
            >
              Verify
            </button>
          </div>
        </form>
      )}
      <div aria-live="polite" aria-busy={busy}>
        {busy && (
          <p role="status" className="bg-cream mt-5 rounded-xl p-4 text-sm">
            Checking the saved appointment...
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
          >
            {error}
          </p>
        )}
        {appointment && (
          <div className="border-ink/10 mt-5 space-y-4 rounded-2xl border bg-white p-4">
            <div>
              <p className="text-ink-muted text-xs font-semibold tracking-widest uppercase">
                Booking found in your salon
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${status.tone}`}
              >
                {status.label}
              </span>
            </div>
            <h3 className="text-xl font-semibold">
              {appointment.client_name || "Guest"}
            </h3>
            <p className="text-sm">{appointment.service_name}</p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Date", formatPassDate(appointment.appointment_date)],
                ["Time", formatPassTime(appointment.appointment_time)],
                ["Stylist", appointment.staff_name || "Any available stylist"],
                [
                  "Total",
                  currencyCode
                    ? formatCurrency(appointment.price, currencyCode)
                    : "Currency unavailable",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink-muted text-xs">{label}</dt>
                  <dd className="mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-ink-muted font-mono text-xs break-all">
              Appointment #{appointment.id}
            </p>
            <button
              type="button"
              onClick={() => onViewDetails(appointment)}
              className="bg-ink text-cream min-h-12 w-full rounded-xl px-4 text-sm font-semibold"
            >
              View Appointment Details
            </button>
            <p className="border-ink/10 text-ink-muted border-t pt-3 text-xs leading-5">
              {appointment.status === "Cancelled"
                ? "This booking is cancelled. Do not use it for a visit."
                : appointment.status === "Completed"
                  ? "This visit is already completed."
                  : appointment.status === "Pending"
                    ? "This request still needs confirmation in Appointments."
                    : "Compare these details with the arriving client and the scheduled date."}{" "}
              Scanning does not confirm, check in, or charge the booking.
            </p>
          </div>
        )}
      </div>
    </dialog>
  );
}
