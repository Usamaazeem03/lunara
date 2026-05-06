import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import StatCards from "../Client/StatCards";
import { supabase } from "../../Shared/lib/supabaseClient";
import {
  formatNumber,
  getInitials,
  parseTimeToMinutes,
} from "../../Shared/utils/appointmentUtils";

const normalizeComparableText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizePhoneText = (value) =>
  String(value ?? "").replace(/\D/g, "");

const slugifyClientName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "client";

const appointmentMatchesClient = (appointment, client) => {
  if (!appointment || !client) return false;

  if (
    appointment.client_id &&
    (String(appointment.client_id) === String(client.id) ||
      String(appointment.client_id) === String(client.auth_id ?? ""))
  ) {
    return true;
  }

  const appointmentName = normalizeComparableText(appointment.client_name);
  const clientName = normalizeComparableText(client.full_name);
  if (appointmentName && clientName && appointmentName === clientName) {
    return true;
  }

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

  return false;
};

const createAppointmentClientRecord = (appointment, fallbackIndex) => ({
  id:
    appointment.client_id ??
    appointment.id ??
    `appointment-client-${fallbackIndex + 1}`,
  auth_id: appointment.client_id ?? null,
  full_name: appointment.client_name ?? "Unknown Client",
  phone: appointment.client_phone ?? null,
  email: appointment.client_email ?? null,
});

const fillMissingClientDetails = (client, appointment) => ({
  ...client,
  auth_id: client.auth_id ?? appointment.client_id ?? null,
  full_name:
    client.full_name && client.full_name !== "Unknown Client"
      ? client.full_name
      : appointment.client_name ?? client.full_name,
  phone: client.phone ?? appointment.client_phone ?? null,
  email: client.email ?? appointment.client_email ?? null,
});

const toStartOfDay = (isoDate) => {
  if (!isoDate || typeof isoDate !== "string") return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatDateLabel = (isoDate) => {
  const date = toStartOfDay(isoDate);
  if (!date) return isoDate || "No date";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatMinutesToTimeLabel = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};

const formatTimeLabel = (value) => {
  const minutes = parseTimeToMinutes(value);
  if (minutes === null) return value || "N/A";
  return formatMinutesToTimeLabel(minutes);
};

const sortAppointments = (appointments) =>
  [...appointments].sort((a, b) => {
    const dateA =
      toStartOfDay(a.appointment_date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const dateB =
      toStartOfDay(b.appointment_date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (dateA !== dateB) return dateA - dateB;
    return (
      (parseTimeToMinutes(a.appointment_time) ?? 0) -
      (parseTimeToMinutes(b.appointment_time) ?? 0)
    );
  });

const getServiceSummary = (serviceName) => {
  if (!serviceName) return "Service";

  const list = String(serviceName)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (list.length <= 1) return list[0] ?? "Service";
  return `${list[0]} +${list.length - 1}`;
};

const mapAppointmentRow = (appointment) => {
  const priceValue = Number(appointment.price);
  const durationValue = Number(appointment.duration_minutes);

  return {
    id: appointment.id,
    appointmentDate: appointment.appointment_date ?? "",
    dateLabel: formatDateLabel(appointment.appointment_date),
    timeLabel: formatTimeLabel(appointment.appointment_time),
    service: appointment.service_name ?? "Service",
    serviceSummary: getServiceSummary(appointment.service_name),
    staff: appointment.staff_name ?? "Unassigned",
    duration: Number.isFinite(durationValue) ? `${durationValue} min` : "N/A",
    price: Number.isFinite(priceValue)
      ? `GBP ${formatNumber(priceValue)}`
      : "N/A",
    status: appointment.status ?? "Pending",
    notes: appointment.notes ?? null,
  };
};

const rowStatusStyles = {
  Confirmed: "border-ink bg-ink text-cream",
  Pending: "border-ink/30 bg-cream text-ink",
  Completed: "border-ink text-ink",
  Cancelled: "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]",
};

const mergeClientRows = (clientsData, appointmentsData) => {
  const profileClients = (clientsData ?? []).map((client) => ({
    id: client.id,
    auth_id: client.auth_id ?? null,
    full_name: client.full_name ?? "Unknown Client",
    phone: client.phone ?? null,
    email: client.email ?? null,
  }));

  const appointmentOnlyClients = [];

  (appointmentsData ?? []).forEach((appointment, index) => {
    const matchesProfileClient = profileClients.some((client) =>
      appointmentMatchesClient(appointment, client),
    );

    if (matchesProfileClient) {
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

  return allClientRecords.map((client) => {
    const clientAppointments = (appointmentsData ?? []).filter((appt) =>
      appointmentMatchesClient(appt, client),
    );

    let totalSpent = 0;
    let lastVisit = null;

    clientAppointments.forEach((appt) => {
      totalSpent += Number(appt.price) || 0;
      if (!lastVisit || new Date(appt.appointment_date) > new Date(lastVisit)) {
        lastVisit = appt.appointment_date;
      }
    });

    const fullName = client.full_name || client.name || "Unknown Client";

    return {
      id: client.id,
      auth_id: client.auth_id ?? null,
      full_name: fullName,
      initials: getInitials(fullName),
      phone: client.phone ?? null,
      email: client.email ?? null,
      lastVisit: lastVisit || "No visits",
      totalSpentValue: totalSpent,
      totalSpentLabel: `GBP ${totalSpent}`,
      appointments: clientAppointments,
      appointmentCount: clientAppointments.length,
      routeSlug: slugifyClientName(fullName),
    };
  });
};

const ClientProfilePage = () => {
  const location = useLocation();
  const { clientSlug } = useParams();

  const [ownerId, setOwnerId] = useState(null);
  const [clientsData, setClientsData] = useState([]);
  const [clientsAppointmentsData, setClientsAppointmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const getOwner = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setOwnerId(user.id);
    };

    getOwner();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!ownerId) return;

      setIsLoading(true);
      setLoadError("");

      const [clientsRes, appointmentsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, auth_id, full_name, phone, email, owner_id")
          .eq("role", "client")
          .eq("owner_id", ownerId)
          .order("full_name", { ascending: true }),
        supabase
          .from("appointments")
          .select(
            "id, client_id, client_name, client_phone, client_email, appointment_date, appointment_time, service_name, staff_name, duration_minutes, price, status, notes",
          )
          .eq("owner_id", ownerId),
      ]);

      if (clientsRes.error) {
        setLoadError(`Clients: ${clientsRes.error.message}`);
        setClientsData([]);
      } else {
        setClientsData(clientsRes.data ?? []);
      }

      if (appointmentsRes.error) {
        setLoadError((prev) =>
          prev
            ? `${prev} Appointments: ${appointmentsRes.error.message}`
            : `Appointments: ${appointmentsRes.error.message}`,
        );
        setClientsAppointmentsData([]);
      } else {
        setClientsAppointmentsData(appointmentsRes.data ?? []);
      }

      setIsLoading(false);
    };

    loadData();
  }, [ownerId]);

  const mergedClients = useMemo(
    () => mergeClientRows(clientsData, clientsAppointmentsData),
    [clientsData, clientsAppointmentsData],
  );

  const routeStateClientId = location.state?.clientId ?? null;
  const normalizedClientSlug = slugifyClientName(clientSlug);

  const selectedClient = useMemo(() => {
    if (mergedClients.length === 0) return null;

    return (
      mergedClients.find((client) => {
        if (routeStateClientId && String(client.id) === String(routeStateClientId)) {
          return true;
        }

        if (routeStateClientId && String(client.auth_id ?? "") === String(routeStateClientId)) {
          return true;
        }

        return normalizedClientSlug && client.routeSlug === normalizedClientSlug;
      }) ?? null
    );
  }, [mergedClients, normalizedClientSlug, routeStateClientId]);

  useEffect(() => {
    setSelectedAppointment(null);
  }, [clientSlug]);

  const appointmentRows = useMemo(
    () => {
      const clientName = selectedClient?.full_name || "Unknown Client";
      const initials = selectedClient?.initials || getInitials(clientName);

      return sortAppointments(selectedClient?.appointments ?? []).map(
        (appointment) => ({
          ...mapAppointmentRow(appointment),
          client: clientName,
          initials,
        }),
      );
    },
    [selectedClient],
  );

  const totalSpent = selectedClient?.totalSpentValue ?? 0;
  const appointmentCount = selectedClient?.appointmentCount ?? 0;
  const avgVisitValue =
    appointmentCount > 0 ? Math.round(totalSpent / appointmentCount) : 0;

  const stats = useMemo(
    () => [
      {
        title: "Total Appointments",
        value: appointmentCount,
        subtitle: "All visits",
        icon: calendarIcon,
      },
      {
        title: "Last Visit",
        value: selectedClient?.lastVisit || "No visits",
        subtitle: "Most recent booking",
        icon: clockIcon,
      },
      {
        title: "Total Spent",
        value: `GBP ${totalSpent}`,
        subtitle: "Across visits",
        icon: creditCardIcon,
      },
      {
        title: "Avg. Visit Value",
        value: `GBP ${avgVisitValue}`,
        subtitle: "Per appointment",
        icon: giftIcon,
      },
    ],
    [appointmentCount, avgVisitValue, selectedClient?.lastVisit, totalSpent],
  );

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Clients"
        title={selectedClient?.full_name || "Client Profile"}
        description={
          selectedClient
            ? "View this client's appointment history and contact details."
            : "Loading client profile..."
        }
      />

      {loadError && (
        <div className="mb-3 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className="border-ink/20 bg-white/90 p-6 text-sm text-gray-500">
          Loading client profile...
        </div>
      ) : !selectedClient ? (
        <div className="border-ink/30 bg-cream text-ink-muted border-2 border-dashed p-6 text-center text-sm">
          Client profile not found.
        </div>
      ) : (
        <>
          <StatCards stats={stats} lgGridCols={4} />

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.4fr]">
            <aside className="border-ink/20 flex flex-col gap-4 border-2 bg-white/90 p-5">
              <div className="flex items-center gap-4">
                <span className="border-ink/20 bg-cream text-ink-muted flex h-16 w-16 items-center justify-center rounded-full border text-lg font-semibold uppercase">
                  {selectedClient.initials}
                </span>
                <div>
                  <p className="text-ink text-xl leading-tight font-semibold">
                    {selectedClient.full_name}
                  </p>
                  <p className="text-ink-muted text-xs tracking-widest uppercase">
                    Client Profile
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="border-ink/10 bg-cream/60 border p-4">
                  <p className="text-ink-muted text-[0.6rem] tracking-widest uppercase">
                    Phone
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedClient.phone || "No phone provided"}
                  </p>
                </div>
                <div className="border-ink/10 bg-cream/60 border p-4">
                  <p className="text-ink-muted text-[0.6rem] tracking-widest uppercase">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold">
                    {selectedClient.email || "No email provided"}
                  </p>
                </div>
                <div className="border-ink/10 bg-cream/60 border p-4">
                  <p className="text-ink-muted text-[0.6rem] tracking-widest uppercase">
                    Appointments
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {appointmentCount} booking{appointmentCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="border-ink/10 bg-cream/60 border p-4">
                  <p className="text-ink-muted text-[0.6rem] tracking-widest uppercase">
                    Last Visit
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedClient.lastVisit}
                  </p>
                </div>
              </div>

              <div className="border-ink/10 bg-cream/50 border p-4">
                <p className="text-ink-muted text-[0.6rem] tracking-widest uppercase">
                  Total Spent
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  GBP {totalSpent}
                </p>
                <p className="text-ink-muted mt-1 text-xs">
                  Average visit value: GBP {avgVisitValue}
                </p>
              </div>

            </aside>

            <section className="border-ink/20 flex min-h-0 flex-col border-2 bg-white/90">
              <div className="border-ink/10 border-b-2 px-4 py-3 sm:px-5">
                <p className="text-ink text-base font-semibold">
                  Appointment History
                </p>
                <p className="text-ink-muted text-xs tracking-widest uppercase">
                  All bookings for this client in this salon
                </p>
              </div>

              <div className="border-ink/10 bg-cream text-ink-muted hidden border-b-2 px-4 py-3 text-xs tracking-widest uppercase sm:grid sm:grid-cols-[1.2fr_1.5fr_1fr_0.8fr_0.8fr_0.9fr]">
                <span>Date &amp; Time</span>
                <span>Service</span>
                <span>Staff</span>
                <span>Duration</span>
                <span>Price</span>
                <span>Status</span>
              </div>

              <div className="scrollbar-hidden flex-1 overflow-y-auto">
                {appointmentRows.length > 0 ? (
                  appointmentRows.map((appointment) => (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() => setSelectedAppointment(appointment)}
                      className="border-ink/10 hover:bg-cream/50 grid w-full gap-3 border-b px-4 py-3 text-left text-sm transition sm:grid-cols-[1.2fr_1.5fr_1fr_0.8fr_0.8fr_0.9fr] sm:items-center"
                    >
                      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
                        Date &amp; Time
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
                          <img
                            src={clockIcon}
                            alt=""
                            className="h-4 w-4 opacity-70"
                          />
                        </span>
                        <div>
                          <p className="font-semibold">
                            {appointment.timeLabel}
                          </p>
                          <p className="text-ink-muted text-xs">
                            {appointment.dateLabel}
                          </p>
                        </div>
                      </div>

                      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
                        Service
                      </p>
                      <span>{appointment.serviceSummary}</span>

                      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
                        Staff
                      </p>
                      <span>{appointment.staff}</span>

                      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
                        Duration
                      </p>
                      <span>{appointment.duration}</span>

                      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
                        Price
                      </p>
                      <span className="font-semibold">{appointment.price}</span>

                      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-fit rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase ${
                            rowStatusStyles[appointment.status] ??
                            "border-ink/30 text-ink-muted"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="border-ink/30 bg-cream text-ink-muted m-4 border-2 border-dashed p-4 text-center text-sm">
                    No appointments found for this client.
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        showActions={false}
      />
    </section>
  );
};

export default ClientProfilePage;
