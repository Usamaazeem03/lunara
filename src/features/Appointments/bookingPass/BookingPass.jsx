import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useCurrencyCode } from "../../settings/useCurrencyCode.js";
import { formatCurrency } from "../../../utils/currency.js";
import { notify } from "../../../Shared/lib/toast.jsx";
import {
  createBookingReference,
  formatPassDate,
  formatPassTime,
  getBookingStatus,
} from "./bookingPassUtils.js";
import { downloadBookingPass } from "./downloadBookingPass.js";

export default function BookingPass({ appointment }) {
  const qrRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currencyCode } = useCurrencyCode(appointment.owner_id);
  const priceLabel = currencyCode
    ? formatCurrency(appointment.price, currencyCode)
    : "Loading currency...";
  const reference = createBookingReference(appointment);
  const status = getBookingStatus(appointment.status);
  const details = [
    ["Guest", appointment.client_name || "Guest"],
    ["Services", appointment.service_name || "Appointment"],
    ["Stylist", appointment.staff_name || "Any available stylist"],
    ["Duration", `${appointment.duration_minutes || 0} minutes`],
    ["Payment preference", appointment.payment_option || "Ask the salon"],
    ...(Number(appointment.reward_discount) > 0 ? [["Reward discount", currencyCode ? formatCurrency(appointment.reward_discount, currencyCode) : "Loading…"]] : []),
  ];

  async function savePass() {
    setIsSaving(true);
    try {
      await downloadBookingPass(
        appointment,
        priceLabel,
        qrRef.current?.querySelector("svg"),
      );
    } catch (error) {
      notify.error(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      notify.success("Booking reference copied.");
    } catch {
      notify.error(
        "Could not copy. Select the reference below to copy it manually.",
      );
    }
  }

  return (
    <article className="border-ink/10 mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border bg-[#fffdf9] shadow-[0_16px_60px_rgba(45,38,32,0.08)]">
      <header className="bg-ink text-cream px-6 py-7 text-center">
        <p className="text-xs font-medium tracking-[0.35em]">LUNARA</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Your appointment pass
        </h2>
        <p className="text-cream/70 mt-2 text-sm">
          A little time, just for you.
        </p>
      </header>
      <div className="px-5 pt-6 text-center sm:px-7">
        <p className="mb-4 text-sm text-ink-muted">Pay in full at the salon using a method they accept. Online payments are coming soon; this booking does not collect payment.</p>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${status.tone}`}
        >
          {status.label}
        </span>
        <p className="text-ink-muted mx-auto mt-3 max-w-xs text-sm leading-6">
          {status.description}
        </p>
        <div
          ref={qrRef}
          className="border-ink/10 mx-auto my-5 w-fit rounded-2xl border bg-white p-3"
        >
          <QRCodeSVG
            value={reference}
            size={216}
            level="M"
            marginSize={4}
            bgColor="#ffffff"
            fgColor="#2d2620"
            title="Appointment QR code for salon verification"
            className="h-auto max-w-full"
          />
        </div>
        <p className="text-ink-muted text-xs">Show this QR when you arrive</p>
      </div>
      <div className="border-ink/20 relative my-6 border-t border-dashed">
        <span className="border-ink/10 bg-cream absolute -top-3 -left-3 h-6 w-6 rounded-full border" />
        <span className="border-ink/10 bg-cream absolute -top-3 -right-3 h-6 w-6 rounded-full border" />
      </div>
      <div className="space-y-5 px-5 pb-6 sm:px-7">
        <div className="bg-cream/70 grid grid-cols-2 gap-3 rounded-2xl p-4">
          <div>
            <p className="text-ink-muted text-[10px] tracking-widest uppercase">
              Your date
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatPassDate(appointment.appointment_date)}
            </p>
          </div>
          <div className="border-ink/10 border-l pl-4">
            <p className="text-ink-muted text-[10px] tracking-widest uppercase">
              Your time
            </p>
            <p className="mt-1 text-lg font-semibold">
              {formatPassTime(appointment.appointment_time)}
            </p>
          </div>
        </div>
        <dl className="space-y-3">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-5 text-sm">
              <dt className="text-ink-muted shrink-0">{label}</dt>
              <dd className="min-w-0 text-right font-medium break-words">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-ink/10 flex justify-between gap-4 border-t pt-4">
          <span className="font-medium">Booking total</span>
          <span className="text-xl font-semibold">{priceLabel}</span>
        </div>
        <p className="text-ink-muted text-xs leading-5">
          Your pass identifies your booking. Payment and appointment status are
          checked separately by the salon.
        </p>
        <button
          onClick={savePass}
          disabled={isSaving || !currencyCode}
          type="button"
          className="bg-ink text-cream min-h-12 w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {isSaving ? "Saving pass..." : "Save pass as image"}
        </button>
        <details className="text-center">
          <summary className="text-ink-muted cursor-pointer py-2 text-xs">
            Booking reference &amp; copy
          </summary>
          <p className="bg-cream mt-2 rounded-lg p-3 font-mono text-[10px] break-all select-all">
            {reference}
          </p>
          <button
            onClick={copyReference}
            type="button"
            className="min-h-11 px-4 text-sm underline underline-offset-4"
          >
            Copy reference
          </button>
        </details>
      </div>
    </article>
  );
}
