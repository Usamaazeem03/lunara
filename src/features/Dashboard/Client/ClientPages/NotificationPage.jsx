import { translateConfig } from "../../../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useClientBookingPasses } from "../../../Appointments/bookingPass/useClientBookingPasses.js";
import { formatPassDate, formatPassTime, getBookingStatus } from "../../../Appointments/bookingPass/bookingPassUtils.js";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import ClientDataState from "../components/ClientDataState.jsx";
import ClientEmptyState from "../components/ClientEmptyState.jsx";

const STATUS_MESSAGES = { pending: { translationKey: "dashboard.yourRequestIsSavedAndWaitingForTheSalonTo" }, confirmed: { translationKey: "dashboard.yourSalonHasConfirmedThisAppointment" }, completed: { translationKey: "dashboard.thisVisitIsMarkedCompleteWeHopeYouEnjoyedYour" }, cancelled: { translationKey: "dashboard.thisAppointmentHasBeenCancelled" } };

export default function NotificationPage() {
  const { t } = useTranslation();
  const { appointments, isLoading, error, refetch, isFetching } = useClientBookingPasses();
  return <section className="mx-auto max-w-3xl"><ClientPageHeader eyebrow={t("dashboard.stayInTheKnow")} title={t("dashboard.visitUpdates")} description={t("dashboard.theLatestSavedStatusOfYourAppointments")}><button type="button" onClick={() => refetch()} disabled={isFetching} className="min-h-11 rounded-xl border border-ink/15 px-4 text-sm font-medium disabled:opacity-50">{isFetching ? t("dashboard.refreshing") : t("dashboard.refreshUpdates")}</button></ClientPageHeader><ClientDataState isLoading={isLoading} error={error} onRetry={refetch} isFetching={isFetching}/>{!isLoading && !error && (appointments.length ? <div className="space-y-3">{appointments.map(appointment => { const status = getBookingStatus(appointment.status); return <Link key={appointment.id} to={`/dashboard/my-appointment?appointment=${encodeURIComponent(appointment.id)}`} className="block rounded-2xl border border-ink/10 bg-white/70 p-5 transition hover:bg-white"><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${status.tone}`}>{status.label}</span><h2 className="mt-3 text-base font-semibold">{appointment.service_name}</h2><p className="mt-2 text-sm leading-6 text-ink-muted">{translateConfig(STATUS_MESSAGES)[appointment.status?.toLowerCase()] || t("dashboard.openYourPassToReviewThisAppointment")}</p><div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-xs text-ink-muted"><span>{formatPassDate(appointment.appointment_date)} {t("bookingPass.at")} {formatPassTime(appointment.appointment_time)}</span><span className="shrink-0 text-ink">{t("dashboard.viewPass")}</span></div></Link>; })}</div> : <ClientEmptyState icon="bell" title={t("dashboard.aQuietMoment")} description={t("dashboard.whenYouBookYouCanFollowYourAppointmentSStatus")} to="/dashboard/book-appointment?choose_salon=1" actionLabel={t("common.planVisit")}/>)}</section>;
}
