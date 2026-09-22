export function getAvailableDates(workingHours, today = new Date(), days = 14) {
  const dates = [];
  for (let offset = 0; offset < days; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const config = workingHours.find(
      (day) => Number(day.day_of_week) === date.getDay(),
    );
    if (!config?.is_open) continue;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    dates.push({
      day: date.toLocaleString("default", { weekday: "short" }),
      fullDay: date.toLocaleString("default", { weekday: "long" }),
      date: `${date.toLocaleString("default", { month: "short" })} ${day}`,
      fullDate: `${date.getFullYear()}-${month}-${day}`,
      dayOfWeek: date.getDay(),
      openTime: config.open_time,
      closeTime: config.close_time,
    });
  }
  return dates;
}

export function getTimeSlots(date) {
  if (!date?.openTime || !date?.closeTime) return [];
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const slots = [];
  const end = toMinutes(date.closeTime);
  for (let minute = toMinutes(date.openTime); minute < end; minute += 30) {
    const hour = Math.floor(minute / 60);
    slots.push(
      `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`,
    );
  }
  return slots;
}
