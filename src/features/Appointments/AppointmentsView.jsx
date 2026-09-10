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
}) => (
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
      <div className="border-ink/30 bg-cream-soft border-2 border-dashed p-6 text-center text-sm">
        Calendar view is coming soon. You currently have{" "}
        <span className="font-semibold">{filteredAppointments.length}</span>{" "}
        appointment(s) for{" "}
        <span className="font-semibold">
          {selectedDate ? formatDateLabel(selectedDate) : "all selected dates"}
        </span>
        .
      </div>
    ) : (
      <div className="border-ink/20 relative flex min-h-0 flex-1 flex-col border-2 bg-white/90">
        <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
        <div className="border-ink/10 bg-cream text-ink-muted hidden border-b-2 px-4 py-3 text-xs tracking-widest uppercase sm:grid sm:grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr]">
          <span>Date & Time</span>
          <span>Client</span>
          <span>Service</span>
          <span>Staff</span>
          <span>Duration</span>
          <span>Price</span>
          <span>Status</span>
        </div>

        <div className="scrollbar-hidden flex-1 overflow-y-auto">
          {pageIsLoading && (
            <div className="text-ink-muted p-4 text-sm">
              Loading appointments...
            </div>
          )}

          {!pageIsLoading && filteredAppointments.length === 0 && (
            <div className="border-ink/30 bg-cream text-ink-muted m-4 border-2 border-dashed p-4 text-center text-sm">
              No appointments found for{" "}
              <span className="font-semibold">
                {selectedDate
                  ? formatDateLabel(selectedDate)
                  : "the selected range"}
              </span>
              .
            </div>
          )}

          {!pageIsLoading &&
            visibleAppointments.map((appointment) => (
              <AppointmentRow
                key={`${appointment.id}-${appointment.appointmentDate}-${appointment.timeLabel}`}
                appointment={appointment}
                onSelect={onSelectAppointment}
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

export default AppointmentsView;
