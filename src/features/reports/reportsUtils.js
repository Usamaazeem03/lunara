import i18n from "../../i18n/i18n.js";
const toStartOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const getDateRangeConfig = (label) => {
  const today = toStartOfDay(new Date());
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  if (label === "This Year") {
    const start = new Date(today.getFullYear(), 0, 1);
    const previousStart = new Date(today.getFullYear() - 1, 0, 1);
    const previousEnd = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    return { start, end, previousStart, previousEnd };
  }

  const days = label === "Last 90 Days" ? 90 : 30;
  const start = addDays(today, -(days - 1));
  const previousEnd = addDays(start, -1);
  previousEnd.setHours(23, 59, 59, 999);
  const previousStart = toStartOfDay(addDays(previousEnd, -(days - 1)));

  return { start, end, previousStart, previousEnd };
};

export const getAppointmentDateValue = (appointment) =>
  appointment.appointment_date ??
  appointment.appointmentDate ??
  appointment.date ??
  appointment.booking_date ??
  appointment.scheduled_date ??
  appointment.starts_at ??
  "";

export const getAppointmentDate = (appointment) => {
  const value = getAppointmentDateValue(appointment);
  if (!value) return null;

  const date = new Date(
    typeof value === "string" && !value.includes("T")
      ? `${value}T00:00:00`
      : value,
  );

  return Number.isNaN(date.getTime()) ? null : date;
};

export const getAppointmentAmount = (appointment) => {
  const rawAmount =
    appointment.price ??
    appointment.amount ??
    appointment.total_price ??
    appointment.total_amount ??
    appointment.service_price ??
    0;
  const amount =
    typeof rawAmount === "number"
      ? rawAmount
      : Number(String(rawAmount).replace(/[^0-9.-]/g, ""));

  return Number.isFinite(amount) ? amount : 0;
};

export const isCancelledAppointment = (appointment) =>
  String(appointment.status ?? "")
    .trim()
    .toLowerCase() === "cancelled";

export const isInRange = (appointment, start, end) => {
  const date = getAppointmentDate(appointment);
  return Boolean(date && date >= start && date <= end);
};

export const formatDelta = (current, previous) => {
  if (!previous && !current) return "0%";
  if (!previous) return "+100%";

  const value = ((current - previous) / previous) * 100;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

export const getClientKey = (appointment) =>
  String(
    appointment.client_id ??
      appointment.client_email ??
      appointment.client_phone ??
      appointment.client_name ??
      appointment.id,
  )
    .trim()
    .toLowerCase();

export const getServiceLabels = (appointment, servicesById) => {
  const service = servicesById.get(String(appointment.service_id ?? ""));

  if (service) {
    return [service.category || service.title || service.name || i18n.t("common.service")];
  }

  const serviceName =
    appointment.service_name ??
    appointment.service_title ??
    appointment.service ??
    i18n.t("common.service");

  return String(serviceName)
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
};

export const getPaymentLabel = (appointment) => {
  const method = String(appointment.payment_method ?? "").toLowerCase();
  const option = String(appointment.payment_option ?? "").toLowerCase();
  const source = `${method} ${option}`;

  if (source.includes("upi")) return "UPI";
  if (source.includes("wallet")) return i18n.t("common.wallet");
  if (source.includes("card")) return i18n.t("common.card");
  if (source.includes("online")) return i18n.t("common.online");
  if (source.includes("salon") || source.includes("cash"))
    return i18n.t("common.payAtSalon");

  return i18n.t("reports.unspecified");
};

export const normalizeStaffKey = (appointment) =>
  String(appointment.staff_id ?? appointment.staff_name ?? i18n.t("common.unassigned"));

export const getStaffName = (appointment) =>
  appointment.staff_name || i18n.t("common.unassigned");
