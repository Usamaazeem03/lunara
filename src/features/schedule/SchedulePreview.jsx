import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import { getSchedulePreview } from "./scheduleUtils";

export default function SchedulePreview({ days, isDirty }) {
  const dates = getSchedulePreview(days);
  return (
    <aside className="border-ink/20 overflow-hidden border-2 bg-white/90 xl:sticky xl:top-5">
      <div className="p-5">
        <div className="text-ink-muted flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase">
          <img src={calendarIcon} alt="" className="h-4 w-4" />
          Booking preview
        </div>
        <h2 className="mt-3 text-xl font-semibold">Booking Availability</h2>
        <p className="text-ink-muted mt-2 text-sm leading-6">
          Open days in the next 14 days.
        </p>
        <div className="border-ink/10 mt-5 flex items-baseline justify-between border-t-2 pt-4">
          <span className="text-ink-muted text-xs">Open days</span>
          <span className="text-2xl font-semibold">
            {dates.length}
            <span className="text-ink-muted text-sm font-normal"> / 14</span>
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {dates.map((date) => {
            const value = new Date(date.key);
            return (
              <div
                key={date.key}
                title={date.label}
                className="border-ink/20 bg-cream/60 flex flex-col items-center border-2 px-1 py-3"
              >
                <span className="text-ink-muted text-[10px] tracking-wider uppercase">
                  {value.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span className="my-1 text-xl font-semibold">
                  {value.getDate()}
                </span>
                <span className="text-ink-muted text-[10px]">
                  {value.toLocaleDateString(undefined, { month: "short" })}
                </span>
              </div>
            );
          })}
        </div>
        {!dates.length && (
          <div className="border-ink/20 bg-cream mt-4 border-2 border-dashed p-5 text-center">
            <p className="text-sm font-semibold">No open days</p>
            <p className="text-ink-muted mt-2 text-xs leading-5">
              All days are closed. Turn on a day to make it available for
              bookings.
            </p>
          </div>
        )}
      </div>
      <div className="border-ink/10 bg-cream/60 border-t-2 px-5 py-4">
        <p className="text-ink text-xs font-semibold">
          {isDirty ? "Previewing your changes" : "Plan your availability"}
        </p>
        <p className="text-ink-muted mt-1 text-xs leading-5">
          Save your schedule to update booking hours. Available times also
          depend on existing appointments.
        </p>
      </div>
    </aside>
  );
}
