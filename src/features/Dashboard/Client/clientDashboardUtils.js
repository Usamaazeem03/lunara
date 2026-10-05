import i18n from "../../../i18n/i18n.js";
export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function bookingPath(ownerId) {
  return ownerId
    ? `/dashboard/book-appointment?owner_id=${encodeURIComponent(ownerId)}`
    : "/dashboard/book-appointment?choose_salon=1";
}

export function groupClientAppointments(appointments, now = new Date()) {
  const today = localDateKey(now);
  const groups = { Upcoming: [], Past: [], Cancelled: [] };
  for (const appointment of appointments) {
    const status = appointment.status?.toLowerCase();
    if (status === "cancelled") groups.Cancelled.push(appointment);
    else if (status === "completed" || appointment.appointment_date < today) groups.Past.push(appointment);
    else groups.Upcoming.push(appointment);
  }
  const dateTime = (appointment) => `${appointment.appointment_date} ${appointment.appointment_time}`;
  groups.Upcoming.sort((first, second) => dateTime(first).localeCompare(dateTime(second)));
  groups.Past.sort((first, second) => dateTime(second).localeCompare(dateTime(first)));
  return groups;
}

export function summarizeClientVisits(appointments, now = new Date()) {
  const completed = appointments.filter((appointment) => appointment.status?.toLowerCase() === "completed");
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const key = localDateKey(date).slice(0, 7);
    return {
      key,
      label: date.toLocaleDateString(i18n.resolvedLanguage, { month: "short" }),
      fullLabel: date.toLocaleDateString(i18n.resolvedLanguage, { month: "long", year: "numeric" }),
      appointments: completed.filter((appointment) => appointment.appointment_date?.startsWith(key)),
    };
  });
  const thisYear = completed.filter((appointment) => appointment.appointment_date?.startsWith(String(now.getFullYear())));
  return { completed, months, thisYear, groups: groupClientAppointments(appointments, now) };
}
