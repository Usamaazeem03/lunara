function StepDateTime({
  dateOptions,
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedTime,
  setSelectedTime,
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Choose Date
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-7">
          {dateOptions.map((option, index) => {
            const isSelected = index === selectedDate;
            return (
              <button
                key={`${option.day}-${option.date}`}
                type="button"
                onClick={() => setSelectedDate(index)}
                className={`border-2 px-3 py-3 text-center text-xs uppercase tracking-widest transition ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white"
                }`}
              >
                <div className="text-sm font-semibold">{option.day}</div>
                <div className="text-[0.65rem] text-[#5f544b]">
                  {option.date}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Choose Time
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {timeSlots.map((slot, index) => {
            const isSelected = index === selectedTime;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(index)}
                className={`border-2 px-3 py-2 text-xs uppercase tracking-widest transition ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white"
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
