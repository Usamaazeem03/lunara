import { translatedMessage } from "../../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const qrRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currencyCode } = useCurrencyCode(appointment.owner_id);
  const priceLabel = currencyCode
    ? formatCurrency(appointment.price, currencyCode)
    : t("bookingPass.loadingCurrency");
  const reference = createBookingReference(appointment);
  const status = getBookingStatus(appointment.status);
  const details = [
    [t("common.guest"), appointment.client_name || t("common.guest")],
    [t("nav.services"), appointment.service_name || t("common.appointment")],
    [t("common.stylist"), appointment.staff_name || t("common.anyAvailableStylist")],
    [t("common.duration"), t("bookingPass.minutes", { value1: appointment.duration_minutes || 0 })],
    [t("bookingPass.paymentPreference"), appointment.payment_option || t("bookingPass.askTheSalon")],
    ...(Number(appointment.reward_discount) > 0 ? [[t("bookingPass.rewardDiscount"), currencyCode ? formatCurrency(appointment.reward_discount, currencyCode) : t("bookingPass.loading")]] : []),
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
      notify.success(translatedMessage("bookingPass.bookingReferenceCopied"));
    } catch {
      notify.error(
        translatedMessage("bookingPass.couldNotCopySelectTheReferenceBelowToCopyIt"),
      );
    }
  }

  return (
    <article className="border-ink/10 mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border bg-[#fffdf9] shadow-[0_16px_60px_rgba(45,38,32,0.08)]">
      <header className="bg-ink text-cream px-6 py-7 text-center">
        <p className="text-xs font-medium tracking-[0.35em]">LUNARA</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight"> {t("bookingPass.yourAppointmentPass")} </h2>
        <p className="text-cream/70 mt-2 text-sm"> {t("bookingPass.aLittleTimeJustForYou")} </p>
      </header>
      <div className="px-5 pt-6 text-center sm:px-7">
        <p className="mb-4 text-sm text-ink-muted">{t("booking.payAtSalonNotice")}</p>
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
            title={t("bookingPass.appointmentQrCodeForSalonVerification")}
            className="h-auto max-w-full"
          />
        </div>
        <p className="text-ink-muted text-xs">{t("bookingPass.showThisQrWhenYouArrive")}</p>
      </div>
      <div className="border-ink/20 relative my-6 border-t border-dashed">
        <span className="border-ink/10 bg-cream absolute -top-3 -left-3 h-6 w-6 rounded-full border" />
        <span className="border-ink/10 bg-cream absolute -top-3 -right-3 h-6 w-6 rounded-full border" />
      </div>
      <div className="space-y-5 px-5 pb-6 sm:px-7">
        <div className="bg-cream/70 grid grid-cols-2 gap-3 rounded-2xl p-4">
          <div>
            <p className="text-ink-muted text-[10px] tracking-widest uppercase"> {t("bookingPass.yourDate")} </p>
            <p className="mt-1 text-sm font-semibold">
              {formatPassDate(appointment.appointment_date)}
            </p>
          </div>
          <div className="border-ink/10 border-l pl-4">
            <p className="text-ink-muted text-[10px] tracking-widest uppercase"> {t("bookingPass.yourTime")} </p>
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
          <span className="font-medium">{t("bookingPass.bookingTotal")}</span>
          <span className="text-xl font-semibold">{priceLabel}</span>
        </div>
        <p className="text-ink-muted text-xs leading-5"> {t("bookingPass.yourPassIdentifiesYourBookingPaymentAndAppointmentStatusAre")} </p>
        <button
          onClick={savePass}
          disabled={isSaving || !currencyCode}
          type="button"
          className="bg-ink text-cream min-h-12 w-full rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {isSaving ? t("bookingPass.savingPass") : t("bookingPass.savePassAsImage")}
        </button>
        <details className="text-center">
          <summary className="text-ink-muted cursor-pointer py-2 text-xs"> {t("bookingPass.bookingReferenceCopy")} </summary>
          <p className="bg-cream mt-2 rounded-lg p-3 font-mono text-[10px] break-all select-all">
            {reference}
          </p>
          <button
            onClick={copyReference}
            type="button"
            className="min-h-11 px-4 text-sm underline underline-offset-4"
          > {t("bookingPass.copyReference")} </button>
        </details>
      </div>
    </article>
  );
}
