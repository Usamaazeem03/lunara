import { isCompletedAppointment } from "../Appointments/appointmentStatsUtils.js";
import { getInitials } from "../../utils/appointmentUtils.js";

const normalizeComparableText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizePhoneText = (value) => String(value ?? "").replace(/\D/g, "");

export const slugifyClientName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "client";

const appointmentMatchesClient = (appointment, client) => {
  if (!appointment || !client) return false;
  if (appointment.reward_profile_id) {
    return String(appointment.reward_profile_id) === String(client.id);
  }

  if (
    appointment.client_id &&
    (String(appointment.client_id) === String(client.id) ||
      String(appointment.client_id) === String(client.auth_id ?? ""))
  ) {
    return true;
  }

  if (appointment.client_id && client.auth_id) return false;

  const appointmentPhone = normalizePhoneText(appointment.client_phone);
  const clientPhone = normalizePhoneText(client.phone);
  if (appointmentPhone && clientPhone && appointmentPhone === clientPhone) {
    return true;
  }

  const appointmentEmail = normalizeComparableText(appointment.client_email);
  const clientEmail = normalizeComparableText(client.email);
  if (appointmentEmail && clientEmail && appointmentEmail === clientEmail) {
    return true;
  }

  const appointmentName = normalizeComparableText(appointment.client_name);
  const clientName = normalizeComparableText(client.full_name);
  if (appointmentName && clientName && appointmentName === clientName) {
    return true;
  }

  return false;
};

const createAppointmentClientRecord = (appointment, fallbackIndex) => ({
  id:
    appointment.client_id ??
    appointment.id ??
    `appointment-client-${fallbackIndex + 1}`,
  auth_id: appointment.client_id ?? null,
  avatar_img: appointment.client_avatar_img ?? null,
  full_name: appointment.client_name ?? "Unknown Client",
  phone: appointment.client_phone ?? null,
  email: appointment.client_email ?? null,
});

const fillMissingClientDetails = (client, appointment) => ({
  ...client,
  avatar_img: client.avatar_img || appointment.client_avatar_img || null,
  auth_id: client.auth_id ?? appointment.client_id ?? null,
  full_name:
    client.full_name && client.full_name !== "Unknown Client"
      ? client.full_name
      : (appointment.client_name ?? client.full_name),
  phone: client.phone ?? appointment.client_phone ?? null,
  email: client.email ?? appointment.client_email ?? null,
});

export function mergeClients(clientsData, clientsAppointmentsData) {
  const profileClients = clientsData.map((client) => ({
    id: client.id,
    auth_id: client.auth_id ?? null,
    avatar_img: client.avatar_img ?? null,
    full_name: client.full_name ?? "Unknown Client",
    phone: client.phone ?? null,
    email: client.email ?? null,
  }));

  const appointmentOnlyClients = [];

  clientsAppointmentsData.forEach((appointment, index) => {
    const matchesProfileClient = profileClients.find((client) =>
      appointmentMatchesClient(appointment, client),
    );

    if (matchesProfileClient) {
      // Attach account photos only through explicit IDs, never name matching.
      if (
        appointment.client_id &&
        (String(appointment.client_id) === String(matchesProfileClient.id) ||
          String(appointment.client_id) ===
            String(matchesProfileClient.auth_id))
      ) {
        matchesProfileClient.avatar_img ||=
          appointment.client_avatar_img ?? null;
      }
      return;
    }

    const existingFallbackClient = appointmentOnlyClients.find((client) =>
      appointmentMatchesClient(appointment, client),
    );

    if (existingFallbackClient) {
      Object.assign(
        existingFallbackClient,
        fillMissingClientDetails(existingFallbackClient, appointment),
      );
      return;
    }

    appointmentOnlyClients.push(
      createAppointmentClientRecord(appointment, index),
    );
  });

  const allClientRecords = [...profileClients, ...appointmentOnlyClients].sort(
    (a, b) =>
      String(a.full_name ?? "").localeCompare(String(b.full_name ?? "")) ||
      String(a.id ?? "").localeCompare(String(b.id ?? "")),
  );

  const appointmentsByClient = new Map(
    allClientRecords.map((client) => [client, []]),
  );
  clientsAppointmentsData.forEach((appointment) => {
    const client =
      allClientRecords.find((record) => appointment.reward_profile_id && String(record.id) === String(appointment.reward_profile_id)) ??
      allClientRecords.find(
        (record) =>
          appointment.client_id &&
          (String(appointment.client_id) === String(record.id) ||
            String(appointment.client_id) === String(record.auth_id)),
      ) ??
      allClientRecords.find((record) =>
        appointmentMatchesClient(appointment, record),
      );
    if (client) appointmentsByClient.get(client).push(appointment);
  });

  const mergedClients = allClientRecords.map((client) => {
    const clientAppointments = appointmentsByClient.get(client);
    // A salon-created client can have a different ID from their account.
    // Keep the account ID from their visits for the shared avatar lookup,
    // without replacing the salon ID used by profile links and statistics.
    const appointmentAccountIds = [
      ...new Set(
        clientAppointments
          .map((appointment) => appointment.client_id)
          .filter((id) => id && String(id) !== String(client.id))
          .map(String),
      ),
    ];
    const avatarProfileId =
      client.auth_id ||
      (appointmentAccountIds.length === 1
        ? appointmentAccountIds[0]
        : client.id);
    const latestContact = [...clientAppointments].sort((a, b) =>
      String(b.appointment_date ?? "").localeCompare(
        String(a.appointment_date ?? ""),
      ),
    );
    let totalSpent = 0;
    let lastVisit = null;

    clientAppointments.filter(isCompletedAppointment).forEach((appt) => {
      const amount = Number(appt.price);
      totalSpent += Number.isFinite(amount) ? amount : 0;

      if (
        appt.appointment_date &&
        !Number.isNaN(new Date(appt.appointment_date).getTime()) &&
        (!lastVisit || new Date(appt.appointment_date) > new Date(lastVisit))
      ) {
        lastVisit = appt.appointment_date;
      }
    });
    return {
      id: client.id,
      auth_id: client.auth_id ?? null,
      avatarProfileId,
      avatar_img: client.avatar_img ?? null,
      full_name: client.full_name || client.name || "Unknown Client",
      nameFallbackKey: !client.full_name && !client.name || client.full_name === "Unknown Client" ? "common.unknownClient" : null,
      initials: getInitials(client.full_name || client.name),
      phone:
        client.phone ||
        latestContact.find((visit) => visit.client_phone)?.client_phone ||
        null,
      email:
        client.email ||
        latestContact.find((visit) => visit.client_email)?.client_email ||
        null,
      appointments: clientAppointments,
      lastVisit: lastVisit || "No visits",
      lastVisitFallbackKey: !lastVisit ? "clients.noVisits" : null,
      totalSpent,
    };
  });

  return mergedClients;
}
