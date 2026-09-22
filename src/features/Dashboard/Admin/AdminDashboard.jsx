import { useUserAvatars } from "../../../globalHooks/useUserAvatars";
import UserAvatar from "../../../Shared/ui/UserAvatar";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppHeader from "../../../AppLayout/AppHeader";

import StatCards from "../Client/StatCards";
import {
  getAppointmentStats,
  getMonthlyRevenue,
} from "../../Appointments/appointmentStatsUtils";
import { getServiceSummary } from "../../Appointments/appointmentFormatters.js";
import { useOwnerId } from "../../../globalHooks/useOwnerId";
import { useAppointments } from "../../../globalHooks/useAppointments";
import { useCurrencyCode } from "../../settings/useCurrencyCode";
import { formatCurrency } from "../../../utils/currency";

import { useClients } from "../../clients/useClients";
import { mergeClients } from "../../clients/clientUtils";

import AppointmentDetails from "../../Appointments/AppointmentDetails.jsx";
import {
  formatPassDate,
  formatPassTime,
} from "../../Appointments/bookingPass/bookingPassUtils.js";
import Icon from "../../../Shared/ui/Icon.jsx";

const AdminDashboard = () => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    ownerId,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useOwnerId();
  const { currencyCode } = useCurrencyCode(ownerId);
  const {
    clients,
    appointments: clientAppointments,
    isLoading: isClientsLoading,
    error: clientsError,
  } = useClients(ownerId);
  const totalClients = useMemo(
    () => mergeClients(clients, clientAppointments).length,
    [clients, clientAppointments],
  );
  const clientsLoading = isOwnerLoading || isClientsLoading;
  const clientsUnavailable = Boolean(
    ownerError || clientsError || (!clientsLoading && !ownerId),
  );
  const { appointments } = useAppointments(ownerId, { includeCancelled: true });
  const {
    todayAppointments,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    pendingAmount,
  } = useMemo(() => getAppointmentStats(appointments), [appointments]);

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
      subtitle: "On schedule",

      icon: <Icon name="calendar" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "Total Clients",
      value: clientsLoading
        ? "..."
        : clientsUnavailable
          ? "Unavailable"
          : totalClients.toString(),
      subtitle: clientsLoading
        ? "Loading clients"
        : clientsUnavailable
          ? "Could not load clients"
          : "All clients",
      icon: <Icon name="users" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "This Month Revenue",
      value: formatCurrency(monthRevenue, currencyCode),
      subtitle: "Completed appointments this month",
      icon: (
        <Icon name="credit-card-alt" size={20} className="text-ink-muted/70" />
      ),
    },
    {
      title: "Pending Amount",
      value: formatCurrency(pendingAmount, currencyCode),
      subtitle: "Pending and confirmed bookings",
      icon: <Icon name="pending" size={20} className="text-ink-muted/70" />,
    },
  ];

  const recentAppointments = useMemo(
    () =>
      todayAppointments.map((appointment) => ({
        id: appointment.id,
        client_id: appointment.client_id ?? null,
        fullService:
          appointment.service_name ??
          appointment.service_title ??
          appointment.service ??
          "Service",
        dateLabel: formatPassDate(
          appointment.appointment_date ?? appointment.date,
        ),
        timeLabel: formatPassTime(
          appointment.appointment_time ??
            appointment.time ??
            appointment.start_time,
        ),
        duration:
          appointment.duration_minutes != null
            ? `${appointment.duration_minutes} min`
            : "N/A",
        price: formatCurrency(
          appointment.price ?? appointment.amount,
          currencyCode,
        ),
        notes: appointment.notes ?? null,
        client:
          appointment.client_name ??
          appointment.customer_name ??
          appointment.client ??
          "Walk-in",
        service: getServiceSummary(
          appointment.service_name ??
            appointment.service_title ??
            appointment.service ??
            "Service",
        ),
        staff: appointment.staff_name ?? "Unassigned",
        time:
          appointment.appointment_time ??
          appointment.time ??
          appointment.start_time ??
          "N/A",
        amount: appointment.price ?? appointment.amount ?? "N/A",
        status: appointment.status ?? "Pending",
        initials: (appointment.client_name ?? "Walk-in")
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      })),
    [todayAppointments, currencyCode],
  );

  const { avatars } = useUserAvatars(
    recentAppointments.map((appointment) => appointment.client_id),
  );
  const selectedRow = recentAppointments.find(
    (appointment) => appointment.id === selectedAppointmentId,
  );
  const selectedAppointment = selectedRow
    ? {
        ...selectedRow,
        service: selectedRow.fullService,
        avatarUrl: avatars[selectedRow.client_id],
      }
    : null;
  const closeDetails = () => setSelectedAppointmentId(null);

  const revenueHighlights = [
    {
      label: "Today Revenue",
      value: formatCurrency(todayRevenue, currencyCode),
    },
    {
      label: "This Week Revenue",
      value: formatCurrency(weekRevenue, currencyCode),
    },
  ];

  const monthlyRevenue = useMemo(
    () => getMonthlyRevenue(appointments),
    [appointments],
  );

  return (
    <section className="flex h-full flex-col">
      <AppHeader
        eyebrow="Dashboard"
        title="Welcome back!"
        description="Here's what's happening today."
      />

      <StatCards stats={stats} lgGridCols={4} />

      <section className="mt-5 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="border-ink/20 relative flex min-h-0 flex-1 flex-col border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Recent Appointments</h2>
                <span className="border-ink/20 bg-cream text-ink-muted rounded-full border px-2 py-0.5 text-[0.6rem] tracking-widest uppercase">
                  {todayAppointments.length} today
                </span>
              </div>
              <p className="text-ink-muted text-sm">
                Latest bookings and status updates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (slug) navigate(`/owner/salon/${slug}/appointments`);
              }}
              className="border-ink hover:bg-ink hover:text-cream border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase transition"
            >
              View all
            </button>
          </div>

          <div
            className="scrollbar-hidden mt-4 flex max-h-64 min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto overscroll-contain pr-2"
            aria-label={`${todayAppointments.length} appointments today`}
          >
            {recentAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="sticky top-0 snap-start"
                style={{ zIndex: index + 1 }}
              >
                <AppointmentRow
                  appointment={appointment}
                  avatarUrl={avatars[appointment.client_id]}
                  onSelect={() => setSelectedAppointmentId(appointment.id)}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {revenueHighlights.map((item) => (
              <div
                key={item.label}
                className="border-ink/20 bg-cream border-2 px-4 py-3 text-center"
              >
                <p className="text-ink-muted text-xs tracking-widest uppercase">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-ink/20 relative flex flex-col border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Monthly Revenue</h2>
              <p className="text-ink-muted text-sm">
                Completed appointment revenue this year.
              </p>
            </div>
            <span className="border-ink/30 bg-cream text-ink rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
              Updated today
            </span>
          </div>

          <div className="mt-4 flex-1">
            <RevenueChart data={monthlyRevenue} currencyCode={currencyCode} />
          </div>
        </div>
      </section>
      <AppointmentDetails
        appointment={selectedAppointment}
        onClose={closeDetails}
        onAppointmentUpdated={closeDetails}
        onAppointmentDeleted={closeDetails}
      />
    </section>
  );
};

const AppointmentRow = ({ appointment, onSelect, avatarUrl }) => {
  const statusStyles = {
    Completed: "border-ink bg-ink text-cream",
    Pending: "border-ink/30 bg-cream text-ink",
    Confirmed: "border-ink text-ink",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`View appointment details for ${appointment.client}`}
      className="border-ink/20 hover:border-ink focus-visible:outline-ink flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 border-2 bg-white px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-xs font-semibold uppercase">
          <UserAvatar
            src={avatarUrl}
            alt={`${appointment.client || "Client"} profile`}
          />
        </span>
        <span>
          <span className="block text-sm font-semibold">
            {appointment.client}
          </span>
          <span className="text-ink-muted block text-xs">
            {appointment.service} | {appointment.staff}
          </span>
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-3">
        <span className="text-right">
          <span className="block text-sm font-semibold">
            {appointment.amount}
          </span>
          <span className="text-ink-muted block text-xs">
            {appointment.time}
          </span>
        </span>
        <span
          className={`rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase ${
            statusStyles[appointment.status] ?? "border-ink/30 text-ink-muted"
          }`}
        >
          {appointment.status}
        </span>
      </span>
    </button>
  );
};

const RevenueChart = ({ data, currencyCode }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(45, 38, 32, 0.12)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8a8179", fontSize: 9, letterSpacing: 1 }}
              tickMargin={8}
            />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              formatter={(value) => [
                formatCurrency(value, currencyCode),
                "Revenue",
              ]}
              contentStyle={{
                border: "1px solid rgba(45, 38, 32, 0.2)",
                background: "#fff",
                fontSize: 12,
              }}
              labelStyle={{ color: "#2d2620" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2d2620"
              strokeWidth={2}
              fill="rgba(45, 38, 32, 0.08)"
              dot={{ r: 2.5, fill: "#2d2620", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#2d2620" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
