import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useClientBookingPasses } from "../../../Appointments/bookingPass/useClientBookingPasses.js";
import { bookingPath, summarizeClientVisits } from "../clientDashboardUtils.js";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import ClientDataState from "../components/ClientDataState.jsx";
import ClientEmptyState from "../components/ClientEmptyState.jsx";
import NextVisitCard from "../components/NextVisitCard.jsx";
import VisitActivityChart from "../components/VisitActivityChart.jsx";
import { formatPassDate } from "../../../Appointments/bookingPass/bookingPassUtils.js";

export default function HomePage() {
  const { t } = useTranslation();
  const { appointments, profile, user, isLoading, error, refetch, isFetching } = useClientBookingPasses();
  const { completed, months, thisYear, groups } = summarizeClientVisits(appointments);
  const nextVisit = groups.Upcoming[0];
  const lastVisit = [...completed].sort((first, second) => second.appointment_date.localeCompare(first.appointment_date))[0];
  const firstName = (profile?.full_name || user?.user_metadata?.full_name || "").trim().split(/\s+/)[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("dashboard.goodMorning") : hour < 18 ? t("dashboard.goodAfternoon") : t("dashboard.goodEvening");
  const nextBookingPath = bookingPath(nextVisit?.owner_id || lastVisit?.owner_id || appointments[0]?.owner_id);
  const stats = [{ label: t("common.upcoming"), value: groups.Upcoming.length, detail: t("dashboard.visitsToLookForwardTo") }, { label: t("common.completed"), value: thisYear.length, detail: t("dashboard.visitsThisYear") }];

  return (
    <section className="mx-auto max-w-5xl">
      <ClientPageHeader eyebrow={t("dashboard.yourPersonalSpace")} title={`${greeting}${firstName ? `, ${firstName}` : ""}`} description={nextVisit ? t("dashboard.yourNextLittleMomentOfCareIsOnTheCalendar") : t("dashboard.makeRoomForALittleTimeForYourself")}/>
      <ClientDataState isLoading={isLoading} error={error} onRetry={refetch} isFetching={isFetching}/>
      {!isLoading && !error && <>
        <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            {nextVisit ? <NextVisitCard appointment={nextVisit}/> : <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-cream sm:p-8"><div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-cream/5"/><p className="text-[10px] uppercase tracking-[0.2em] text-cream/60">{t("dashboard.yourNextChapter")}</p><h2 className="relative mt-4 max-w-xs text-3xl font-semibold leading-tight">{t("dashboard.somethingLovelyToLookForwardTo")}</h2><p className="relative mt-3 max-w-xs text-sm leading-6 text-cream/70">{t("dashboard.findATimeThatWorksForYouWeWillKeep")}</p><Link to={nextBookingPath} className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-cream px-5 text-sm font-semibold text-ink">{lastVisit ? t("dashboard.planYourNextVisit") : t("dashboard.findASalonBook")} <span className="ml-3" aria-hidden="true">&rarr;</span></Link></div>}
            <div className="grid grid-cols-2 gap-3">{stats.map(stat => <div key={stat.label} className="rounded-2xl border border-ink/10 bg-white/70 p-4"><p className="text-xs text-ink-muted">{stat.label}</p><p className="mt-2 text-3xl font-semibold">{stat.value}</p><p className="mt-2 text-[11px] leading-5 text-ink-muted">{stat.detail}</p></div>)}</div>
          </div>
          <div className="space-y-5">
            <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 sm:p-6"><h2 className="text-lg font-semibold">{t("dashboard.whatWouldFeelGoodToday")}</h2><div className="mt-4 grid gap-3"><Link to={nextBookingPath} className="flex min-h-14 items-center justify-between rounded-xl bg-cream px-4 text-sm font-medium"><span>{t("dashboard.bookALittleMeTime")}</span><span aria-hidden="true">&rarr;</span></Link><Link to="/dashboard/my-appointment" className="flex min-h-14 items-center justify-between rounded-xl border border-ink/10 px-4 text-sm font-medium"><span>{t("dashboard.myVisitsQrPasses")}</span><span aria-hidden="true">&rarr;</span></Link></div></section>
            {lastVisit ? <section className="rounded-2xl border border-ink/10 bg-[#edf0e7] p-5 sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#566348]">{t("dashboard.fromYourLastVisit")}</p><h2 className="mt-3 text-xl font-semibold">{lastVisit.service_name}</h2><p className="mt-2 text-sm text-ink-muted">{formatPassDate(lastVisit.appointment_date)} {t("dashboard.with")} {lastVisit.staff_name || t("dashboard.yourSalon")}</p><Link to={bookingPath(lastVisit.owner_id)} className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline decoration-ink/25 underline-offset-4">{t("dashboard.visitThisSalonAgain")} <span aria-hidden="true">&rarr;</span></Link></section> : <section className="rounded-2xl border border-ink/10 bg-[#edf0e7] p-5 sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#566348]">{t("dashboard.aSmootherArrival")}</p><h2 className="mt-3 text-xl font-semibold">{t("dashboard.yourVisitInYourPocket")}</h2><p className="mt-2 text-sm leading-6 text-ink-muted">{t("dashboard.afterBookingSaveYourQrPassToYourPhoneShow")}</p></section>}
          </div>
        </div>
        <div className="mt-5"><VisitActivityChart months={months}/></div>
        {completed.length === 0 && appointments.length === 0 && <div className="mt-5"><ClientEmptyState icon="heart-love" title={t("dashboard.welcomeToYourOwnLittleSpace")} description={t("dashboard.onceYouBookYourUpcomingVisitsAndAppointmentHistoryWill")}/></div>}
      </>}
    </section>
  );
}
