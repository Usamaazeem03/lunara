import { useTranslation } from "react-i18next";
function StepDateTime({
  availableDates,
  timeSlots,
  loading,
  error,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) {
  const { t } = useTranslation();
  if (error) {
    return (
      <p role="alert" className="py-8 text-center"> {t("booking.unableToLoadAvailableDatesPleaseTryAgain")} </p>
    );
  }
  if (loading) {
    return <div className="py-8 text-center">{t("booking.loadingAvailableTimes")}</div>;
  }

  if (availableDates.length === 0) {
    return (
      <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-4 text-center text-sm text-[#b0412e]"> {t("booking.noAvailableBookingDatesPleaseCheckBackLaterOrContact")} </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* CHOOSE DATE */}
      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase"> {t("booking.chooseADateSwipeForMore")} </p>

        <div className="flex snap-x gap-2 overflow-x-auto pb-3 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {availableDates.map((option, index) => {
            const isSelected = index === selectedDate;
            return (
              <button
                key={`${option.fullDate}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedDate(index);
                  setSelectedTime(0);
                }}
                aria-pressed={isSelected}
                className={`focus-visible:outline-ink min-h-20 min-w-20 shrink-0 snap-start rounded-xl border px-3 py-3 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isSelected
                    ? "border-[#2d2620] bg-[#2d2620] text-[#f3efe9]"
                    : "border-[#2d2620]/15 bg-white hover:border-[#2d2620]/50"
                }`}
              >
                <span className="block text-xs font-semibold tracking-wider uppercase">
                  {option.day}
                </span>
                <span className="mt-1 block text-xs opacity-75">
                  {option.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHOOSE TIME */}
      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase"> {t("booking.chooseTime")} </p>

        {timeSlots.length === 0 && (
          <p className="text-ink-muted mb-3 text-sm"> {t("booking.noTimesAvailableOnThisDatePleaseChooseAnotherDay")} </p>
        )}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {timeSlots.map((slot, index) => {
            const isSelected = index === selectedTime;
            return (
              <button
                key={`${slot}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedTime(index);
                }}
                aria-pressed={isSelected}
                className={`focus-visible:outline-ink min-h-12 rounded-xl border px-1 py-3 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isSelected
                    ? "border-[#2d2620] bg-[#2d2620] text-[#f3efe9]"
                    : "border-[#2d2620]/15 bg-white hover:border-[#2d2620]/50"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StepDateTime;
