import { fixedLabel } from "../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import { validateScheduleDay } from "./scheduleUtils";
export default function ScheduleDayRow({
  index,
  register,
  control,
  getValues,
  errors,
}) {
  const { t } = useTranslation();
  const day = useWatch({ control, name: `days.${index}` });
  const error = errors?.open_time || errors?.close_time;
  const isToday = day.day_of_week === new Date().getDay();
  return (
    <div
      className={`grid gap-3 py-4 transition-colors sm:grid-cols-[minmax(130px,1fr)_minmax(0,1.4fr)] sm:items-center sm:gap-4 ${day.is_open ? "" : "opacity-70"}`}
    >
      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            role="switch"
            aria-label={t("schedule.openOn", { value1: fixedLabel(day.day_name, "day") })}
            {...register(`days.${index}.is_open`)}
            className="peer sr-only"
          />
          <span className="bg-ink/15 peer-checked:bg-ink peer-focus-visible:outline-ink h-6 w-11 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4" />
          <span className="pointer-events-none absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
        </span>
        <span>
          <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {fixedLabel(day.day_name, "day")}
            {isToday && (
              <span className="border-ink/20 bg-cream text-ink-muted border px-1.5 py-0.5 text-[9px] tracking-wider uppercase"> {t("appointments.today")} </span>
            )}
          </span>
          <span className="text-ink-muted mt-0.5 block text-xs">
            {day.is_open ? t("schedule.openForBookings") : t("schedule.closedForTheDay")}
          </span>
        </span>
      </label>
      <div
        className={`grid min-w-0 grid-cols-2 gap-3 ${day.is_open ? "" : "opacity-50"}`}
      >
        {["open_time", "close_time"].map((field, position) => (
          <label key={field} className="min-w-0">
            <span className="text-ink-muted mb-1.5 block text-[10px] tracking-widest uppercase">
              {position === 0 ? t("schedule.opensAt") : t("schedule.closesAt")}
            </span>
            <input
              type="time"
              aria-label={t("schedule.time", { value1: fixedLabel(day.day_name, "day"), value2: position === 0 ? "opening" : "closing" })}
              readOnly={!day.is_open}
              tabIndex={day.is_open ? 0 : -1}
              aria-invalid={Boolean(error) && day.is_open}
              aria-describedby={
                error && day.is_open ? `schedule-error-${index}` : undefined
              }
              {...register(`days.${index}.${field}`, {
                validate: () => validateScheduleDay(getValues(`days.${index}`)),
              })}
              className="border-ink/20 text-ink focus:border-ink focus:ring-ink/10 min-h-11 w-full min-w-0 border-2 bg-white px-2 text-sm focus:ring-2 focus:outline-none sm:px-3"
            />
          </label>
        ))}
      </div>
      {error && day.is_open && (
        <p
          id={`schedule-error-${index}`}
          role="alert"
          className="text-danger text-xs sm:col-span-2"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
