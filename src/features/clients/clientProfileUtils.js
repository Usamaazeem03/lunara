import i18n from "../../i18n/i18n.js";
import { slugifyClientName } from "./clientUtils.js";
import { parseTimeToMinutes } from "../../utils/appointmentUtils.js";
import { formatCurrency } from "../../utils/currency.js";
import { isCompletedAppointment } from "../Appointments/appointmentStatsUtils.js";
import { getServiceSummary } from "../Appointments/appointmentFormatters.js";

export function selectClientProfile(clients, clientId, slug) {
  if (clientId) {
    return (
      clients.find((client) => String(client.id) === String(clientId)) ??
      clients.find(
        (client) => String(client.auth_id ?? "") === String(clientId),
      ) ??
      null
    );
  }
  const matches = clients.filter(
    (client) => slugifyClientName(client.full_name) === slug,
  );
  // Old name-only links must not silently open another client with the same name.
  return matches.length === 1 ? matches[0] : null;
}

function dateValue(value) {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

export function formatClientDate(value) {
  return (
    dateValue(value)?.toLocaleDateString(i18n.resolvedLanguage, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) ?? i18n.t("clients.noVisits")
  );
}

function appointmentTimestamp(appointment) {
  const date = dateValue(appointment.appointment_date);
  if (!date) return null;
  const minutes = parseTimeToMinutes(appointment.appointment_time);
  date.setMinutes(minutes ?? 0);
  return date.getTime();
}

const statusLabel = (status) => {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();
  return value ? value[0].toUpperCase() + value.slice(1) : i18n.t("common.unknown");
};

export function getClientProfileMetrics(client, now = new Date()) {
  const appointments = client?.appointments ?? [];
  const completed = appointments.filter(isCompletedAppointment);
  const totalSpent = completed.reduce((total, appointment) => {
    const amount = Number(appointment.price);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const upcoming = appointments
    .filter(
      (appointment) =>
        ["Pending", "Confirmed"].includes(statusLabel(appointment.status)) &&
        appointmentTimestamp(appointment) !== null &&
        appointmentTimestamp(appointment) >= now.getTime(),
    )
    .sort((a, b) => appointmentTimestamp(a) - appointmentTimestamp(b));
  return {
    appointmentCount: appointments.length,
    completedCount: completed.length,
    totalSpent,
    averageSpent: completed.length ? totalSpent / completed.length : 0,
    upcomingCount: upcoming.length,
    nextAppointment: upcoming[0] ?? null,
  };
}

export function buildClientAppointmentRows(client, currencyCode) {
  return [...(client?.appointments ?? [])]
    .sort(
      (a, b) =>
        (appointmentTimestamp(b) ?? -Infinity) -
        (appointmentTimestamp(a) ?? -Infinity),
    )
    .map((appointment) => {
      const minutes = parseTimeToMinutes(appointment.appointment_time);
      const timeLabel =
        minutes === null
          ? i18n.t("bookingPass.timeUnavailable")
          : `${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${minutes >= 720 ? i18n.t("common.pm") : i18n.t("common.am")}`;
      const amount =
        appointment.price == null || appointment.price === ""
          ? NaN
          : Number(appointment.price);
      const duration =
        appointment.duration_minutes == null ||
        appointment.duration_minutes === ""
          ? NaN
          : Number(appointment.duration_minutes);
      return {
        id: appointment.id,
        client_id: appointment.client_id ?? client.avatarProfileId ?? client.id,
        client: client.full_name,
        appointmentDate: appointment.appointment_date,
        dateLabel: dateValue(appointment.appointment_date)
          ? formatClientDate(appointment.appointment_date)
          : i18n.t("common.dateUnavailable"),
        timeLabel,
        service: appointment.service_name || i18n.t("clients.serviceNotRecorded"),
        serviceSummary: getServiceSummary(appointment.service_name),
        staff: appointment.staff_name || i18n.t("common.unassigned"),
        duration: Number.isFinite(duration)
          ? i18n.t("common.min", { value1: duration })
          : i18n.t("clients.notRecorded"),
        price:
          Number.isFinite(amount) && currencyCode
            ? formatCurrency(amount, currencyCode)
            : i18n.t("common.unavailable"),
        status: statusLabel(appointment.status),
        notes: appointment.notes || null,
        rewardDiscount: Number(appointment.reward_discount) > 0 && currencyCode
          ? formatCurrency(appointment.reward_discount, currencyCode) : null,
      };
    });
}

export function filterClientAppointments(rows, search, status) {
  const query = search.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (status === "All" || row.status === status) &&
      (!query ||
        [row.service, row.staff, row.dateLabel, row.status].some((value) =>
          value.toLowerCase().includes(query),
        )),
  );
}
