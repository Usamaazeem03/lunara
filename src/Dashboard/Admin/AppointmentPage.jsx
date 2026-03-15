import { useState } from "react";

import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../Shared/DashboardHeader";
import StatCards from "../Client/StatCards";
import Button from "../Shared/Button";

const AppointmentPage = () => {
  const stats = [
    {
      title: "Today's Appointments",
      value: "24",
      subtitle: "On the calendar",
      icon: calendarIcon,
    },
    {
      title: "This Week",
      value: "142",
      subtitle: "Upcoming visits",
      icon: clockIcon,
    },
    {
      title: "Confirmed",
      value: "17",
      subtitle: "Ready to start",
      icon: giftIcon,
    },
    {
      title: "Pending",
      value: "7",
      subtitle: "Needs review",
      icon: creditCardIcon,
    },
  ];

  const viewTabs = [
    { key: "list", label: "List View" },
    { key: "calendar", label: "Calendar View" },
  ];

  const appointments = [
    {
      id: "APT-301",
      time: "09:00 AM",
      client: "Emily Parker",
      initials: "EP",
      service: "Haircut & Style",
      staff: "Jessica M.",
      duration: "60 min",
      price: "GBP 85",
      status: "Confirmed",
    },
    {
      id: "APT-302",
      time: "10:00 AM",
      client: "Michael Chen",
      initials: "MC",
      service: "Beard Trim",
      staff: "David R.",
      duration: "30 min",
      price: "GBP 35",
      status: "Confirmed",
    },
    {
      id: "APT-303",
      time: "10:30 AM",
      client: "Sarah Williams",
      initials: "SW",
      service: "Hair Coloring",
      staff: "Jessica M.",
      duration: "120 min",
      price: "GBP 150",
      status: "Confirmed",
    },
    {
      id: "APT-304",
      time: "11:00 AM",
      client: "James Brown",
      initials: "JB",
      service: "Relax Massage",
      staff: "Maria L.",
      duration: "60 min",
      price: "GBP 90",
      status: "Pending",
    },
    {
      id: "APT-305",
      time: "11:30 AM",
      client: "Nora Davis",
      initials: "ND",
      service: "Glow Facial",
      staff: "Ava Lee",
      duration: "50 min",
      price: "GBP 75",
      status: "Confirmed",
    },
  ];

  const [activeView, setActiveView] = useState(viewTabs[0].key);
  const [selectedDate, setSelectedDate] = useState("2026-01-21");

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Appointments"
        title="Appointments"
        description="Manage your appointment schedule."
      >
        <Button variant="primary">New Appointment</Button>
      </DashboardHeader>

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink/20 bg-white/90 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            {viewTabs.map((tab, index) => {
              const isActive = tab.key === activeView;
              const isLast = index === viewTabs.length - 1;
              return (
                <Button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveView(tab.key)}
                  variant="custom"
                  unstyled
                  className={`flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition ${
                    isActive ? "bg-cream" : "bg-white"
                  } ${
                    !isLast ? "border-r-2 border-ink/20" : ""
                  } border-2 border-ink/20`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 border-2 border-ink/30 bg-white px-3 py-2 text-xs uppercase tracking-widest">
              <img src={calendarIcon} alt="" className="h-4 w-4 opacity-70" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="bg-transparent text-xs uppercase tracking-widest text-ink focus:outline-none"
              />
            </label>
            <button className="border-2 border-ink/30 bg-white px-4 py-2 text-xs uppercase tracking-widest transition hover:border-ink">
              Filter
            </button>
          </div>
        </div>

        {activeView === "calendar" ? (
          <div className="border-2 border-dashed border-ink/30 bg-cream-soft p-6 text-center text-sm text-ink-muted">
            Calendar view coming soon. Switch back to list view for details.
          </div>
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col border-2 border-ink/20 bg-white/90">
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
            <div className="hidden border-b-2 border-ink/10 bg-cream px-4 py-3 text-xs uppercase tracking-widest text-ink-muted sm:grid sm:grid-cols-[0.8fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr]">
              <span>Time</span>
              <span>Client</span>
              <span>Service</span>
              <span>Staff</span>
              <span>Duration</span>
              <span>Price</span>
              <span>Status</span>
            </div>

            <div className="scrollbar-hidden flex-1 overflow-y-auto">
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const AppointmentRow = ({ appointment }) => {
  const statusStyles = {
    Confirmed: "border-ink bg-ink text-cream",
    Pending: "border-ink/30 bg-cream text-ink",
    Completed: "border-ink text-ink",
  };

  return (
    <div className="grid gap-3 border-b border-ink/10 px-4 py-3 text-sm transition hover:bg-cream/50 sm:grid-cols-[0.8fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr] sm:items-center">
      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Time
      </p>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-cream">
          <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
        </span>
        <span className="font-semibold">{appointment.time}</span>
      </div>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Client
      </p>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 bg-cream text-xs font-semibold uppercase text-ink-muted">
          {appointment.initials}
        </span>
        <span className="font-semibold">{appointment.client}</span>
      </div>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Service
      </p>
      <span>{appointment.service}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Staff
      </p>
      <span>{appointment.staff}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Duration
      </p>
      <span>{appointment.duration}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Price
      </p>
      <span className="font-semibold">{appointment.price}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Status
      </p>
      <span
        className={`w-fit rounded-full border-2 px-3 py-1 text-[0.65rem] uppercase tracking-widest ${
          statusStyles[appointment.status] ?? "border-ink/30 text-ink-muted"
        }`}
      >
        {appointment.status}
      </span>
    </div>
  );
};

export default AppointmentPage;
