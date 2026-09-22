import { useClientBookingPasses } from "../../../Appointments/bookingPass/useClientBookingPasses.js";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import ClientDataState from "../components/ClientDataState.jsx";
import ClientEmptyState from "../components/ClientEmptyState.jsx";
import AppointmentCostCard from "../components/AppointmentCostCard.jsx";

export default function PaymentHistoryPage() {
  const { appointments, isLoading, error, refetch, isFetching } = useClientBookingPasses();
  return <section className="mx-auto max-w-4xl"><ClientPageHeader eyebrow="Everything in one place" title="Booking costs" description="Review the amount and payment preference saved with each appointment."/><div className="mb-5 rounded-2xl border border-ink/10 bg-[#edf0e7] p-5"><h2 className="text-sm font-semibold">Pay in full at the salon</h2><p className="mt-2 text-sm leading-6 text-ink-muted">Online payments are coming soon. Pay in full at the salon using cash, card, or wallet where accepted. These booking amounts are not payment receipts. Please ask your salon to confirm payments, refunds, or the balance due.</p></div><ClientDataState isLoading={isLoading} error={error} onRetry={refetch} isFetching={isFetching}/>{!isLoading && !error && (appointments.length ? <div className="grid gap-4 md:grid-cols-2">{appointments.map(appointment => <AppointmentCostCard key={appointment.id} appointment={appointment}/>)}</div> : <ClientEmptyState icon="credit-card" title="Your booking costs will appear here" description="Once you book a visit, you can review the amount and payment preference here." to="/dashboard/book-appointment?choose_salon=1" actionLabel="Find a salon"/>)}</section>;
}
