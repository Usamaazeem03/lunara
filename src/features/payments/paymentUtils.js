import i18n from "../../i18n/i18n.js";
import { parseTimeToMinutes } from "../../utils/appointmentUtils.js";
import {
  getAppointmentStats,
  isCompletedAppointment,
} from "../Appointments/appointmentStatsUtils.js";

export const paymentStatus = (appointment) =>
  appointment.status?.trim().toLowerCase() || "unknown";
export const paymentAmount = (appointment) =>
  Number.isFinite(Number(appointment.price)) ? Number(appointment.price) : 0;
export const localDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function getPaymentMethod(appointment) {
  const raw =
    appointment.payment_method?.trim() || appointment.payment_option?.trim();
  if (!raw) return i18n.t("payments.notSpecified");
  const known = {
    cash: i18n.t("booking.cash"),
    card: i18n.t("common.card"),
    "credit card": i18n.t("payments.creditCard"),
    "debit card": i18n.t("payments.debitCard"),
    wallet: i18n.t("common.wallet"),
    upi: "UPI",
    online: i18n.t("common.online"),
    "pay at salon": i18n.t("common.payAtSalon"),
  };
  return known[raw.toLowerCase()] || raw;
}

export function getPaymentSummary(appointments, now = new Date()) {
  return {
    ...getAppointmentStats(appointments, now),
    pendingBookings: appointments.filter((appointment) =>
      ["pending", "confirmed"].includes(paymentStatus(appointment)),
    ).length,
  };
}

export function getPaymentCharts(
  appointments,
  weekOffset = 0,
  now = new Date(),
) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date: localDateKey(date),
      day: date.toLocaleDateString(i18n.resolvedLanguage, { weekday: "short" }),
      revenue: 0,
    };
  });
  const methods = new Map();
  for (const appointment of appointments) {
    if (!isCompletedAppointment(appointment)) continue;
    const day = days.find(
      (day) => day.date === appointment.appointment_date?.split("T")[0],
    );
    if (!day) continue;
    const amount = paymentAmount(appointment);
    day.revenue += amount;
    const method = getPaymentMethod(appointment);
    methods.set(method, (methods.get(method) || 0) + amount);
  }
  const total = days.reduce((sum, day) => sum + day.revenue, 0);
  return {
    days,
    total,
    start: days[0].date,
    end: days[6].date,
    methods: [...methods]
      .map(([name, value]) => ({
        name,
        value,
        share: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value),
  };
}

export function filterPayments(
  appointments,
  search,
  status,
  { date = "", time = "" } = {},
) {
  const query = search.trim().toLowerCase();
  return appointments
    .filter((appointment) => {
      if (date && appointment.appointment_date?.split("T")[0] !== date)
        return false;
      if (
        time &&
        parseTimeToMinutes(appointment.appointment_time) !==
          parseTimeToMinutes(time)
      )
        return false;
      const matchesStatus =
        status === "all" ||
        (status === "pending"
          ? ["pending", "confirmed"].includes(paymentStatus(appointment))
          : paymentStatus(appointment) === status);
      return (
        matchesStatus &&
        ([
          appointment.client_name,
          appointment.client_phone,
          appointment.client_email,
          appointment.service_name,
          appointment.id,
          getPaymentMethod(appointment),
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        ) ||
          (/^[+\d\s().-]+$/.test(query) &&
            query.replace(/\D/g, "").length > 0 &&
            String(appointment.client_phone ?? "")
              .replace(/\D/g, "")
              .includes(query.replace(/\D/g, ""))))
      );
    })
    .sort(
      (a, b) =>
        `${b.appointment_date ?? ""} ${b.appointment_time ?? ""}`.localeCompare(
          `${a.appointment_date ?? ""} ${a.appointment_time ?? ""}`,
        ) || String(b.id).localeCompare(String(a.id)),
    );
}

export function buildPaymentsCsv(appointments, currencyCode) {
  const cell = (value) => {
    const text = String(value ?? "");
    const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows = [
    [
      i18n.t("payments.appointmentId"),
      i18n.t("common.date"),
      i18n.t("common.client"),
      i18n.t("common.phone"),
      i18n.t("common.email"),
      i18n.t("common.service"),
      i18n.t("common.amount"),
      i18n.t("payments.currency"),
      i18n.t("common.method"),
      i18n.t("payments.bookingStatus2"),
    ],
    ...appointments.map((appointment) => [
      appointment.id,
      appointment.appointment_date,
      appointment.client_name,
      appointment.client_phone,
      appointment.client_email,
      appointment.service_name,
      paymentAmount(appointment),
      currencyCode,
      getPaymentMethod(appointment),
      appointment.status,
    ]),
  ];
  return rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
