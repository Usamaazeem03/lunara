import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { formatCurrency } from "../../utils/currency";
import { formatPassDate } from "../Appointments/bookingPass/bookingPassUtils";
import { getPaymentMethod, paymentAmount, paymentStatus } from "./paymentUtils";
export default function PaymentRow({
  appointment,
  currencyCode,
  onDownloadInvoice,
}) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadInProgress = useRef(false);
  async function handleDownload() {
    if (downloadInProgress.current) return;
    downloadInProgress.current = true;
    setIsDownloading(true);
    try {
      await onDownloadInvoice(appointment);
    } finally {
      downloadInProgress.current = false;
      setIsDownloading(false);
    }
  }
  const status = paymentStatus(appointment);
  const tone =
    status === "completed"
      ? "border-ink bg-ink text-cream"
      : status === "cancelled"
        ? "border-danger/30 text-danger bg-danger/5"
        : "border-ink/20 bg-cream text-ink";
  return (
    <tr className="border-ink/10 hover:bg-cream/50 border-b text-sm">
      <td className="px-3 py-4 whitespace-nowrap">
        {formatPassDate(appointment.appointment_date)}
      </td>
      <td className="px-3 py-4 font-semibold">
        <p>{appointment.client_name || t("common.walkIn")}</p>
        {appointment.client_phone && (
          <p className="text-ink-muted mt-1 text-xs font-normal">
            {appointment.client_phone}
          </p>
        )}
        {appointment.client_email && (
          <p className="text-ink-muted mt-1 text-xs font-normal break-all">
            {appointment.client_email}
          </p>
        )}
      </td>
      <td className="max-w-60 px-3 py-4">
        {appointment.service_name || t("common.service")}
      </td>
      <td className="px-3 py-4 font-semibold whitespace-nowrap">
        {formatCurrency(paymentAmount(appointment), currencyCode)}
      </td>
      <td className="px-3 py-4">{getPaymentMethod(appointment)}</td>
      <td className="px-3 py-4">
        <span
          className={`inline-block rounded-full border px-3 py-1 text-[10px] tracking-widest uppercase ${tone}`}
        >
          {appointment.status || t("common.unknown")}
        </span>
      </td>
      <td className="px-3 py-4">
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            disabled={isDownloading}
            aria-busy={isDownloading}
            onClick={handleDownload}
            aria-label={t("payments.downloadInvoiceForBooking", { value1: appointment.client_name || t("common.walkIn"), value2: appointment.id })}
            className="border-ink bg-ink text-cream min-h-11 border-2 px-3 text-xs tracking-widest uppercase disabled:opacity-50"
          >
            {isDownloading ? t("payments.preparing") : t("payments.downloadInvoice")}
          </button>
        </div>
      </td>
    </tr>
  );
}
