import { useTranslation } from "react-i18next";
import { useUserAvatars } from "../../globalHooks/useUserAvatars";
import { AppointmentRow } from "./AppointmentRow.jsx";
import AppointmentsFilter from "./AppointmentsFilter.jsx";
import BottomActionBar from "../services/BottomActionBar.jsx";

const AppointmentsView = ({
  activeView,
  setActiveView,
  selectedDate,
  setSelectedDate,
  getTodayIsoDate,
  selectedStatus,
  setSelectedStatus,
  filteredAppointments,
  visibleAppointments,
  pageIsLoading,
  currentPage,
  totalPages,
  onPageChange,
  formatDateLabel,
  onSelectAppointment,
}) => {
  const { t } = useTranslation();
  const { avatars } = useUserAvatars(
    visibleAppointments.map((appointment) => appointment.client_id),
  );
  return (
    <div className="mt-5 grid gap-3">
      <AppointmentsFilter
        activeView={activeView}
        setActiveView={setActiveView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        getTodayIsoDate={getTodayIsoDate}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {activeView === "calendar" ? (
        <div className="border-ink/30 bg-cream-soft border-2 border-dashed p-6 text-center text-sm"> {t("appointments.calendarViewIsComingSoonYouCurrentlyHave")}{" "}
          <span className="font-semibold">{filteredAppointments.length}</span>{" "} {t("appointments.appointmentSFor")}{" "}
          <span className="font-semibold">
            {selectedDate
              ? formatDateLabel(selectedDate)
              : t("appointments.allSelectedDates")}
          </span>
          .
        </div>
      ) : (
        <div className="border-ink/20 relative flex min-h-0 flex-1 flex-col border-2 bg-white/90">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <div className="border-ink/10 bg-cream text-ink-muted hidden border-b-2 px-4 py-3 text-xs tracking-widest uppercase sm:grid sm:grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr]">
            <span>{t("common.dateTime")}</span>
            <span>{t("common.client")}</span>
            <span>{t("common.service")}</span>
            <span>{t("nav.staff")}</span>
            <span>{t("common.duration")}</span>
            <span>{t("common.price")}</span>
            <span>{t("common.status")}</span>
          </div>

          <div className="scrollbar-hidden flex-1 overflow-y-auto">
            {pageIsLoading && (
              <div className="text-ink-muted p-4 text-sm"> {t("appointments.loadingAppointments")} </div>
            )}

            {!pageIsLoading && filteredAppointments.length === 0 && (
              <div className="border-ink/30 bg-cream text-ink-muted m-4 border-2 border-dashed p-4 text-center text-sm"> {t("appointments.noAppointmentsFoundFor")}{" "}
                <span className="font-semibold">
                  {selectedDate
                    ? formatDateLabel(selectedDate)
                    : t("appointments.theSelectedRange")}
                </span>
                .
              </div>
            )}

            {!pageIsLoading &&
              visibleAppointments.map((appointment) => (
                <AppointmentRow
                  key={`${appointment.id}-${appointment.appointmentDate}-${appointment.timeLabel}`}
                  appointment={appointment}
                  avatarUrl={avatars[appointment.client_id]}
                  onSelect={(selected) =>
                    onSelectAppointment({
                      ...selected,
                      avatarUrl: avatars[selected.client_id],
                    })
                  }
                />
              ))}
          </div>
        </div>
      )}

      <BottomActionBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AppointmentsView;
