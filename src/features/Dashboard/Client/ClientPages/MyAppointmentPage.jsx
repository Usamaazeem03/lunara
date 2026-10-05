import { fixedLabel } from "../../../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
import StaffRatingForm from "../../../staff/StaffRatingForm.jsx";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import {
  groupClientAppointments,
  bookingPath,
} from "../clientDashboardUtils.js";
import { useClientBookingPasses } from "../../../Appointments/bookingPass/useClientBookingPasses.js";
import ClientBookingPassCard from "../../../Appointments/bookingPass/ClientBookingPassCard.jsx";

const TABS = ["Upcoming", "Past", "Cancelled"];

export default function MyAppointmentPage() {
  const { t } = useTranslation();
  const [selectedTab, setActiveTab] = useState(null);
  const [searchParams] = useSearchParams();
  const focusedId = searchParams.get("appointment");
  const { appointments, isLoading, error, refetch, isFetching } =
    useClientBookingPasses();
  const groups = groupClientAppointments(appointments);
  const focusedTab = TABS.find((tab) =>
    groups[tab].some((appointment) => String(appointment.id) === focusedId),
  );
  const activeTab = selectedTab ?? focusedTab ?? "Upcoming";
  return (
    <section className="mx-auto max-w-5xl pb-8">
      <ClientPageHeader
        eyebrow={t("dashboard.yourTimeBeautifullyPlanned")}
        title={t("dashboard.myAppointments")}
        description={t("dashboard.yourVisitsAndBookingPassesAllInOnePlace")}
      >
        <Link
          to={bookingPath(appointments[0]?.owner_id)}
          className="bg-ink text-cream flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold"
        > {t("dashboard.bookAVisit")} </Link>
      </ClientPageHeader>
      <div
        className="my-6 flex gap-2 overflow-x-auto pb-1"
        aria-label={t("dashboard.filterAppointments")}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`min-h-12 shrink-0 rounded-full border px-4 text-sm font-medium ${activeTab === tab ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink-muted bg-white"}`}
          >
            {fixedLabel(tab, "status")} <span className="ml-2 opacity-70">{groups[tab].length}</span>
          </button>
        ))}
      </div>
      {isLoading ? (
        <p
          role="status"
          className="text-ink-muted rounded-2xl bg-white/70 p-8 text-center text-sm"
        > {t("dashboard.loadingYourAppointments")} </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900"
        >
          <p>{error.message}</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            type="button"
            className="mt-3 min-h-11 underline"
          >
            {isFetching ? t("dashboard.retrying") : t("common.tryAgain")}
          </button>
        </div>
      ) : groups[activeTab].length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {groups[activeTab].map((appointment) => (
            <div
              key={`${appointment.id}-${focusedId === String(appointment.id)}`}
            >
              <ClientBookingPassCard
                appointment={appointment}
                initialOpen={focusedId === String(appointment.id)}
              />
              <StaffRatingForm appointment={appointment} />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-ink/20 rounded-2xl border border-dashed bg-white/60 p-8 text-center">
          <h2 className="text-xl font-semibold"> {t("dashboard.no")} {fixedLabel(activeTab, "status")} {t("dashboard.appointments")} </h2>
          <p className="text-ink-muted mt-3 text-sm leading-6">
            {activeTab === "Upcoming"
              ? t("dashboard.makeALittleTimeForYourselfYourNextBookingAnd")
              : t("dashboard.yourSavedVisitsWillAppearHere")}
          </p>
        </div>
      )}
    </section>
  );
}
