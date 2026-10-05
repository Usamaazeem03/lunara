import i18n from "../../i18n/i18n.js";
const getLocalIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isCompletedAppointment = (appointment) =>
  appointment.status?.trim().toLowerCase() === "completed";

const sumCompletedRevenue = (appointments) =>
  appointments
    .filter(isCompletedAppointment)
    .reduce((sum, appointment) => sum + getAppointmentAmount(appointment), 0);

const toStartOfDay = (isoDate) => {
  if (!isoDate || typeof isoDate !== "string") return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const getAppointmentDate = (appointment) =>
  appointment.appointmentDate ??
  appointment.appointment_date ??
  appointment.date ??
  appointment.booking_date ??
  appointment.scheduled_date ??
  appointment.starts_at ??
  "";

const getAppointmentAmount = (appointment) => {
  const rawAmount =
    appointment.price ??
    appointment.amount ??
    appointment.total_price ??
    appointment.total_amount ??
    appointment.service_price ??
    0;
  const numericAmount =
    typeof rawAmount === "number"
      ? rawAmount
      : Number(String(rawAmount).replace(/[^0-9.-]/g, ""));

  return Number.isFinite(numericAmount) ? numericAmount : 0;
};

export const getMonthlyRevenue = (
  appointments = [],
  year = new Date().getFullYear(),
) => {
  const revenue = Array.from({ length: 12 }, (_, month) => ({
    month: new Date(year, month, 1).toLocaleString(i18n.resolvedLanguage, {
      month: "short",
    }),
    revenue: 0,
  }));

  appointments.forEach((appointment) => {
    if (!isCompletedAppointment(appointment)) return;
    const dateValue = getAppointmentDate(appointment);
    const date = toStartOfDay(dateValue.split("T")[0]);
    if (!date || Number.isNaN(date.getTime()) || date.getFullYear() !== year)
      return;

    revenue[date.getMonth()].revenue += getAppointmentAmount(appointment);
  });

  return revenue;
};

export const getAppointmentStats = (appointments = [], now = new Date()) => {
  const todayIso = getLocalIsoDate(now);
  const startOfToday = toStartOfDay(todayIso);
  const endOfWeek = new Date(startOfToday ?? new Date());
  endOfWeek.setDate((startOfToday ?? new Date()).getDate() + 6);

  const todayCount = appointments.filter(
    (appointment) => getAppointmentDate(appointment).split("T")[0] === todayIso,
  ).length;

  const weekCount = appointments.filter((appointment) => {
    const date = toStartOfDay(getAppointmentDate(appointment).split("T")[0]);
    if (!date || !startOfToday) return false;
    return date >= startOfToday && date <= endOfWeek;
  }).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status?.toLowerCase() === "confirmed",
  ).length;
  const pendingCount = appointments.filter(
    (appointment) => appointment.status?.toLowerCase() === "pending",
  ).length;

  const todayAppointments = appointments.filter(
    (appointment) => getAppointmentDate(appointment).split("T")[0] === todayIso,
  );
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
  const currentWeekAppointments = appointments.filter((appointment) => {
    const date = toStartOfDay(getAppointmentDate(appointment).split("T")[0]);
    return date && date >= startOfWeek && date < startOfNextWeek;
  });
  const monthAppointments = appointments.filter((appointment) => {
    const date = toStartOfDay(getAppointmentDate(appointment).split("T")[0]);
    return (
      date &&
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  });
  const pendingAmount = appointments.reduce((sum, appointment) => {
    const status = appointment.status?.trim().toLowerCase();
    return (
      sum +
      (status === "pending" || status === "confirmed"
        ? getAppointmentAmount(appointment)
        : 0)
    );
  }, 0);

  return {
    todayCount,
    weekCount,
    confirmedCount,
    pendingCount,
    todayAppointments,
    todayRevenue: sumCompletedRevenue(todayAppointments),
    weekRevenue: sumCompletedRevenue(currentWeekAppointments),
    monthRevenue: sumCompletedRevenue(monthAppointments),
    pendingAmount,
  };
};
