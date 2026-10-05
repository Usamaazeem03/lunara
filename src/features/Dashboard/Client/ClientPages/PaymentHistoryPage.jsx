import { useTranslation } from "react-i18next";
import { useClientBookingPasses } from "../../../Appointments/bookingPass/useClientBookingPasses.js";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import ClientDataState from "../components/ClientDataState.jsx";
import ClientEmptyState from "../components/ClientEmptyState.jsx";
import AppointmentCostCard from "../components/AppointmentCostCard.jsx";

export default function PaymentHistoryPage() {
  const { t } = useTranslation();
  const { appointments, isLoading, error, refetch, isFetching } = useClientBookingPasses();
  return <section className="mx-auto max-w-4xl"><ClientPageHeader eyebrow={t("dashboard.everythingInOnePlace")} title={t("dashboard.bookingCosts")} description={t("dashboard.reviewTheAmountAndPaymentPreferenceSavedWithEachAppointment")}/><div className="mb-5 rounded-2xl border border-ink/10 bg-[#edf0e7] p-5"><h2 className="text-sm font-semibold">{t("booking.payInFullAtTheSalon")}</h2><p className="mt-2 text-sm leading-6 text-ink-muted">{t("dashboard.onlinePaymentsAreComingSoonPayInFullAtThe")}</p></div><ClientDataState isLoading={isLoading} error={error} onRetry={refetch} isFetching={isFetching}/>{!isLoading && !error && (appointments.length ? <div className="grid gap-4 md:grid-cols-2">{appointments.map(appointment => <AppointmentCostCard key={appointment.id} appointment={appointment}/>)}</div> : <ClientEmptyState icon="credit-card" title={t("dashboard.yourBookingCostsWillAppearHere")} description={t("dashboard.onceYouBookAVisitYouCanReviewTheAmount")} to="/dashboard/book-appointment?choose_salon=1" actionLabel={t("common.findSalon")}/>)}</section>;
}
