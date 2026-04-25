import { useEffect, useState } from "react";
import { supabase } from "../../Shared/lib/supabaseClient";

function StepDateTime({
  ownerId,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onDateSelect,
}) {
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch working hours and generate dates
  useEffect(() => {
    const fetchWorkingHours = async () => {
      const { data, error } = await supabase
        .from("working_hours")
        .select("*")
        .eq("owner_id", ownerId)
        .order("day_of_week", { ascending: true });

      if (error) {
        console.error("Error fetching working hours:", error);
        setLoading(false);
        return;
      }

      // Generate next 14 days based on working hours
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayOfWeek = date.getDay();
        const dayConfig = data?.find((d) => d.day_of_week === dayOfWeek);

        if (dayConfig?.is_open) {
          const month = date.toLocaleString("default", { month: "short" });
          const dayNum = date.getDate().toString().padStart(2, "0");

          dates.push({
            day: date.toLocaleString("default", { weekday: "short" }), // Short day name
            fullDay: date.toLocaleString("default", { weekday: "long" }),
            date: `${month} ${dayNum}`,
            fullDate: date.toISOString().split("T")[0],
            dayOfWeek: dayOfWeek,
            openTime: dayConfig.open_time,
            closeTime: dayConfig.close_time,
          });
        }
      }

      setAvailableDates(dates);

      // Generate time slots for first available date
      if (dates.length > 0) {
        generateTimeSlots(dates[0]);
        onDateSelect?.(dates[0]);
      }

      setLoading(false);
    };

    fetchWorkingHours();
  }, []);

  // Generate time slots when date changes
  useEffect(() => {
    if (availableDates[selectedDate]) {
      generateTimeSlots(availableDates[selectedDate]);
    }
  }, [selectedDate, availableDates]);

  const generateTimeSlots = (dateConfig) => {
    if (!dateConfig) return;

    const slots = [];
    const start = parseInt(dateConfig.openTime?.split(":")[0] || 9);
    const end = parseInt(dateConfig.closeTime?.split(":")[0] || 18);

    for (let hour = start; hour < end; hour++) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

      slots.push(`${displayHour.toString().padStart(2, "0")}:00 ${period}`);
      slots.push(`${displayHour.toString().padStart(2, "0")}:30 ${period}`);
    }

    setTimeSlots(slots);
  };

  if (loading) {
    return <div className="py-8 text-center">Loading available times...</div>;
  }

  if (availableDates.length === 0) {
    return (
      <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-4 text-center text-sm text-[#b0412e]">
        No available booking dates. Please check back later or contact the
        salon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* CHOOSE DATE */}
      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase">
          Choose Date
        </p>
        {/* FIXED: Use auto-fill with minmax for responsive filling */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
          {availableDates.map((option, index) => {
            const isSelected = index === selectedDate;
            return (
              <button
                key={`${option.fullDate}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedDate(index);
                  onDateSelect?.(option);
                }}
                className={`border-2 px-2 py-3 text-center transition ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white hover:border-[#2d2620]/50"
                }`}
              >
                <span className="block text-xs font-semibold tracking-wider uppercase">
                  {option.day}
                </span>
                <span className="mt-1 block text-[0.65rem] text-[#5f544b] uppercase">
                  {option.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHOOSE TIME */}
      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase">
          Choose Time
        </p>
        {/* FIXED: Use auto-fill with minmax for responsive filling */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {timeSlots.map((slot, index) => {
            const isSelected = index === selectedTime;
            return (
              <button
                key={`${slot}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedTime(index);
                  onDateSelect?.({
                    ...availableDates[selectedDate],
                    selectedTime: slot,
                  });
                }}
                className={`border-2 px-1 py-2.5 text-xs tracking-widest uppercase transition ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white hover:border-[#2d2620]/50"
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
