import StatCards from "../Dashboard/Client/StatCards";
import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import { useForm, useWatch } from "react-hook-form";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import { getDefaultSchedule, validateScheduleDay } from "./scheduleUtils";
import { useSaveSchedule } from "./useSaveSchedule";
import ScheduleDayRow from "./ScheduleDayRow";
import SchedulePreview from "./SchedulePreview";
import AppHeader from "../../AppLayout/AppHeader";
import Button from "../../Shared/Button";

export default function ScheduleForm({ ownerId, schedule }) {
  const {
    register,
    control,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { days: schedule } });
  const days = useWatch({ control, name: "days" });
  const { saveSchedule, isSaving, error } = useSaveSchedule(ownerId);
  const setAllOpen = (isOpen) =>
    days.forEach((_, index) =>
      setValue(`days.${index}.is_open`, isOpen, { shouldDirty: true }),
    );
  function onSubmit({ days }) {
    if (isSaving) return;
    saveSchedule(days, { onSuccess: (saved) => reset({ days: saved }) });
  }
  const openDays = days.filter((day) => day.is_open);
  const weeklyMinutes = openDays.reduce((total, day) => {
    if (validateScheduleDay(day) !== true) return total;
    const minutes = (time) => {
      const [hours, mins] = time.split(":").map(Number);
      return hours * 60 + mins;
    };
    return total + minutes(day.close_time) - minutes(day.open_time);
  }, 0);
  const hoursLabel = `${Math.floor(weeklyMinutes / 60)}h${weeklyMinutes % 60 ? ` ${weeklyMinutes % 60}m` : ""}`;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex h-full flex-col pb-6"
    >
      <AppHeader
        eyebrow="Schedule"
        title="Working Schedule"
        description="Manage your salon opening days and booking hours."
      >
        <Button
          type="submit"
          variant="primary"
          loading={isSaving}
          disabled={!ownerId}
          className="min-h-11"
        >
          Save Schedule
        </Button>
      </AppHeader>
      {error && (
        <p
          role="alert"
          className="border-danger/40 bg-danger/10 text-danger my-4 border-2 p-3 text-sm"
        >
          {error.message}
        </p>
      )}
      <StatCards
        lgGridCols={3}
        stats={[
          {
            title: "Open Days",
            value: `${openDays.length} / 7`,
            subtitle: "Weekly availability",
            icon: calendarIcon,
          },
          {
            title: "Weekly Hours",
            value: hoursLabel,
            subtitle: "Scheduled opening hours",
            icon: clockIcon,
          },
          {
            title: "Closed Days",
            value: String(7 - openDays.length),
            subtitle: "No bookings available",
            icon: calendarIcon,
          },
        ]}
      />
      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <fieldset
          disabled={isSaving}
          className="border-ink/20 min-w-0 overflow-hidden border-2 bg-white/90"
        >
          <div className="border-ink/10 flex flex-wrap items-center justify-between gap-4 border-b-2 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="border-ink/20 bg-cream flex h-11 w-11 items-center justify-center border-2">
                <img src={clockIcon} alt="" className="h-5 w-5 opacity-70" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Weekly Hours</h2>
                <p className="text-ink-muted mt-1 text-xs">
                  Switch days on and set your opening times.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-cream/50 border-ink/10 flex flex-wrap items-center gap-2 border-b-2 px-4 py-3 sm:px-5">
            <span className="text-ink-muted mr-1 text-[10px] tracking-widest uppercase">
              Quick set
            </span>
            {[
              ["Open all", () => setAllOpen(true)],
              ["Close all", () => setAllOpen(false)],
              [
                "Use default hours",
                () =>
                  setValue("days", getDefaultSchedule(), {
                    shouldDirty: true,
                    shouldValidate: true,
                  }),
              ],
            ].map(([label, action]) => (
              <button
                key={label}
                type="button"
                onClick={action}
                className="border-ink/30 hover:border-ink focus-visible:outline-ink min-h-10 border-2 bg-white px-3 text-xs tracking-widest uppercase transition disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="divide-ink/10 divide-y px-4 sm:px-5">
            {days.map((day, index) => (
              <ScheduleDayRow
                key={day.day_of_week}
                index={index}
                register={register}
                control={control}
                getValues={getValues}
                errors={errors.days?.[index]}
              />
            ))}
          </div>
          <div className="border-ink/10 bg-cream/40 flex flex-wrap items-center justify-between gap-3 border-t-2 px-4 py-4 sm:px-5">
            <p
              role="status"
              className="text-ink-muted flex items-center gap-2 text-xs"
            >
              <span
                className={`h-2 w-2 rounded-full ${isDirty ? "bg-amber-500" : "bg-ink/30"}`}
              />
              {isSaving
                ? "Saving schedule..."
                : isDirty
                  ? "You have unsaved changes"
                  : "Edit your hours, then save to publish"}
            </p>
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              disabled={!ownerId}
              className="min-h-11"
            >
              Save Schedule
            </Button>
          </div>
        </fieldset>
        <SchedulePreview days={days} isDirty={isDirty} />
      </div>
    </form>
  );
}
