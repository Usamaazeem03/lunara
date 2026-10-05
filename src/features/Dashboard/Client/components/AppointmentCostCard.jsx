import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCurrencyCode } from "../../../settings/useCurrencyCode.js";
import { formatCurrency } from "../../../../utils/currency.js";
import { formatPassDate, getBookingStatus } from "../../../Appointments/bookingPass/bookingPassUtils.js";

export default function AppointmentCostCard({ appointment }) {
  const { t } = useTranslation();
  const { currencyCode, isLoading } = useCurrencyCode(appointment.owner_id);
  const status = getBookingStatus(appointment.status);
  return <article className="rounded-2xl border border-ink/10 bg-white/70 p-5"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs text-ink-muted">{formatPassDate(appointment.appointment_date)}</p><h2 className="mt-2 text-base font-semibold">{appointment.service_name}</h2></div><p className="shrink-0 text-base font-semibold">{currencyCode ? formatCurrency(appointment.price, currencyCode) : isLoading ? t("dashboard.loading") : t("bookingPass.currencyUnavailable")}</p></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className={`rounded-full px-3 py-1.5 text-xs font-medium ${status.tone}`}>{status.label}</span><span className="text-xs text-ink-muted">{appointment.payment_option || t("dashboard.paymentPreferenceNotSet")}</span></div><Link to={`/dashboard/my-appointment?appointment=${encodeURIComponent(appointment.id)}`} className="mt-4 flex min-h-11 items-center justify-between border-t border-ink/10 pt-3 text-sm font-medium">{t("clients.viewAppointment")} <span aria-hidden="true">&rarr;</span></Link></article>;
}
