import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../Shared/DashboardHeader";
import StatCards from "../Client/StatCards";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Today's Appointments",
      value: "55",
      subtitle: "On schedule",
      icon: calendarIcon,
    },
    {
      title: "Total Clients",
      value: "120",
      subtitle: "Active profiles",
      icon: giftIcon,
    },
    {
      title: "This Month Revenue",
      value: "GBP 1,023",
      subtitle: "March 2026",
      icon: creditCardIcon,
    },
    {
      title: "Pending Payments",
      value: "GBP 244",
      subtitle: "Follow-ups needed",
      icon: clockIcon,
    },
  ];

  const recentAppointments = [
    {
      id: "APT-201",
      client: "Emily Parker",
      service: "Haircut & Style",
      staff: "Jessica M.",
      time: "10:00 AM",
      amount: "GBP 56",
      status: "Completed",
      initials: "EP",
    },
    {
      id: "APT-202",
      client: "Amelia Ross",
      service: "Glow Facial",
      staff: "Ava Lee",
      time: "11:30 AM",
      amount: "GBP 72",
      status: "Completed",
      initials: "AR",
    },
    {
      id: "APT-203",
      client: "Noah Lee",
      service: "Relax Massage",
      staff: "Mark M.",
      time: "01:00 PM",
      amount: "GBP 85",
      status: "Pending",
      initials: "NL",
    },
  ];

  const revenueHighlights = [
    { label: "Today Revenue", value: "GBP 1,025" },
    { label: "This Week", value: "GBP 8,650" },
  ];

  const monthlyRevenue = [
    4200, 5200, 4800, 6200, 5700, 5100, 8200, 6100, 6900, 7600, 7200, 8800,
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Dashboard"
        title="Welcome back!"
        description="Here's what's happening today."
      />

      <StatCards stats={stats} lgGridCols={4} />

      <section className="mt-5 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative flex min-h-0 flex-1 flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-ink/5"></div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Recent Appointments</h2>
              <p className="text-sm text-ink-muted">
                Latest bookings and status updates.
              </p>
            </div>
            <button
              type="button"
              className="border-2 border-ink px-3 py-1 text-[0.65rem] uppercase tracking-widest transition hover:bg-ink hover:text-cream"
            >
              View all
            </button>
          </div>

          <div className="scrollbar-hidden mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2">
            {recentAppointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {revenueHighlights.map((item) => (
              <div
                key={item.label}
                className="border-2 border-ink/20 bg-cream px-4 py-3 text-center"
              >
                <p className="text-xs uppercase tracking-widest text-ink-muted">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-ink/5"></div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Monthly Revenue</h2>
              <p className="text-sm text-ink-muted">
                Revenue trends for the past 12 months.
              </p>
            </div>
            <span className="rounded-full border-2 border-ink/30 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink">
              Updated today
            </span>
          </div>

          <div className="mt-4 flex-1">
            <RevenueChart data={monthlyRevenue} labels={months} />
          </div>
        </div>
      </section>
    </section>
  );
};

const AppointmentRow = ({ appointment }) => {
  const statusStyles = {
    Completed: "border-ink bg-ink text-cream",
    Pending: "border-ink/30 bg-cream text-ink",
    Confirmed: "border-ink text-ink",
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink/20 bg-white px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink/20 bg-cream text-xs font-semibold uppercase text-ink-muted">
          {appointment.initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{appointment.client}</p>
          <p className="text-xs text-ink-muted">
            {appointment.service} | {appointment.staff}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold">{appointment.amount}</p>
          <p className="text-xs text-ink-muted">{appointment.time}</p>
        </div>
        <span
          className={`rounded-full border-2 px-3 py-1 text-[0.65rem] uppercase tracking-widest ${
            statusStyles[appointment.status] ??
            "border-ink/30 text-ink-muted"
          }`}
        >
          {appointment.status}
        </span>
      </div>
    </div>
  );
};

const RevenueChart = ({ data, labels }) => {
  const chartWidth = 260;
  const chartHeight = 120;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = Math.max(maxValue - minValue, 1);
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-40 w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-full w-full"
          role="img"
          aria-label="Monthly revenue line chart"
        >
          {[0, 1, 2, 3, 4].map((index) => {
            const y = (chartHeight / 4) * index;
            return (
              <line
                key={y}
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(45, 38, 32, 0.12)"
                strokeWidth="1"
              />
            );
          })}
          <polygon
            points={areaPoints}
            fill="rgba(45, 38, 32, 0.08)"
            stroke="none"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#2d2620"
            strokeWidth="2"
          />
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - ((value - minValue) / range) * chartHeight;
            return (
              <circle
                key={`${value}-${index}`}
                cx={x}
                cy={y}
                r="2.5"
                fill="#2d2620"
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-6 gap-y-1 text-[0.6rem] uppercase tracking-widest text-ink-muted">
        {labels.map((label) => (
          <span key={label} className="text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
