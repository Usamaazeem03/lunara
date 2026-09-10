const getTodayIsoDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

export const getMonthlyRevenue = (appointments = [], year = new Date().getFullYear()) => {
  const revenue = Array.from({ length: 12 }, (_, month) => ({
    month: new Date(year, month, 1).toLocaleString("en-US", {
      month: "short",
    }),
    revenue: 0,
  }));

  appointments.forEach((appointment) => {
    const dateValue = getAppointmentDate(appointment);
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime()) || date.getFullYear() !== year) return;

    revenue[date.getMonth()].revenue += getAppointmentAmount(appointment);
  });

  return revenue;
};

export const getAppointmentStats = (appointments = []) => {
  const todayIso = getTodayIsoDate();
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
  const weekAppointments = appointments.filter((appointment) => {
    const date = toStartOfDay(getAppointmentDate(appointment).split("T")[0]);
    if (!date || !startOfToday) return false;
    return date >= startOfToday && date <= endOfWeek;
  });

  return {
    todayCount,
    weekCount,
    confirmedCount,
    pendingCount,
    todayAppointments,
    todayRevenue: todayAppointments.reduce(
      (total, appointment) => total + getAppointmentAmount(appointment),
      0,
    ),
    weekRevenue: weekAppointments.reduce(
      (total, appointment) => total + getAppointmentAmount(appointment),
      0,
    ),
  };
};
