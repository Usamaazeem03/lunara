import { useState } from "react";

import calendarIcon from "../../../assets/icons/calendar.svg";
import clockIcon from "../../../assets/icons/clock.svg";
import creditCardIcon from "../../../assets/icons/credit-card.svg";
import bellIcon from "../../../assets/icons/bell.svg";
import giftIcon from "../../../assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../../assets/icons/hair-care.svg";
import DashboardHeader from "../../Shared/DashboardHeader";
import Button from "../../Shared/Button";
import InfoCard from "../InfoCard";
import StatCards from "../StatCards";
import AppointmentCard from "../AppointmentCard";
import QuickActions from "../../../components/QuickActions";
import Note from "../../../components/Note";

const MyAppointmentPage = ({ onBook }) => {
  const appointmentGroups = {
    upcoming: [
      {
        id: "APT-102",
        service: "Classic Haircut",
        description: "Signature finish with a styling consult.",
        date: "March 12, 2026",
        time: "10:00 AM",
        staff: "Mark Martinez",
        location: "Lunara - Main Street",
        amount: "GBP 45",
        duration: "40 min",
        status: "Confirmed",
        payment: "Paid",
        notes: "Arrive 10 minutes early to settle in.",
        actions: [
          { label: "Reschedule", variant: "primary" },
          { label: "Cancel", variant: "danger" },
        ],
      },
      {
        id: "APT-103",
        service: "Color Refresh",
        description: "Toner + gloss update.",
        date: "March 18, 2026",
        time: "1:30 PM",
        staff: "Nina Patel",
        location: "Lunara - Main Street",
        amount: "GBP 75",
        duration: "60 min",
        status: "Confirmed",
        payment: "Paid",
        notes: "Bring a reference photo if you have one.",
        actions: [
          { label: "Reschedule", variant: "primary" },
          { label: "Cancel", variant: "danger" },
        ],
      },
    ],
    past: [],
    cancelled: [],
  };

  const tabs = [
    {
      key: "upcoming",
      label: "Upcoming",
      emptyTitle: "No Upcoming Appointments",
      emptyDescription: "Ready for a refresh? Book your next visit in seconds.",
      emptyIcon: calendarIcon,
    },
    {
      key: "past",
      label: "Past",
      emptyTitle: "No Past Appointments",
      emptyDescription: "Your appointment history will appear here.",
      emptyIcon: clockIcon,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      emptyTitle: "No Cancelled Appointments",
      emptyDescription: "You have not cancelled any appointments.",
      emptyIcon: null,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const activeAppointments = appointmentGroups[activeTab] ?? [];
  const activeTabMeta = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const nextAppointment = appointmentGroups.upcoming[0];

  const statsMyAppointment = [
    {
      title: "Upcoming",
      value: `${appointmentGroups.upcoming.length}`,
      subtitle: "Next 30 days",
      icon: calendarIcon,
    },
    {
      title: "Past Visits",
      value: `${appointmentGroups.past.length}`,
      subtitle: "All time",
      icon: clockIcon,
    },
    {
      title: "Cancelled",
      value: `${appointmentGroups.cancelled.length}`,
      subtitle: "Last 6 months",
      icon: bellIcon,
    },
    {
      title: "Total Spend",
      value: "GBP 530",
      subtitle: "Year to date",
      icon: creditCardIcon,
    },
  ];

  const quickActions = [
    {
      title: "Reschedule visit",
      description: "Move your next slot",
      icon: calendarIcon,
    },
    {
      title: "Add services",
      description: "Boost your appointment",
      icon: hairCareIcon,
    },
    {
      title: "Redeem points",
      description: "Use loyalty rewards",
      icon: giftIcon,
    },
  ];

  return (
    <section className="flex h-full flex-col">
      {/* <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-[#e9e1d8] px-4 py-1 text-xs uppercase tracking-widest text-[#5f544b]">
            My Appointments
          </span>
          <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl">
            My Appointments
          </h1>
          <p className="max-w-2xl text-sm text-[#5f544b]">
            View and manage your appointments, payments, and visit details.
          </p>
        </div>
        {onBook && (
          <button
            type="button"
            onClick={onBook}
            className="border-2 border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]"
          >
            Book Appointment
          </button>
        )}
      </header> */}
      <DashboardHeader
        eyebrow={"My Appointments"}
        title={"My Appointments"}
        description={`View and manage your appointments, payments, and visit details.`}
      >
        <Button onClick={onBook} variant="primary">
          Book Appointment
        </Button>
      </DashboardHeader>

      {nextAppointment && (
        <InfoCard
          layout="inline"
          title={`${nextAppointment.date} at ${nextAppointment.time}`}
          label="Next Visit"
          meta={`with ${nextAppointment.staff}`}
          padding="px-3 py-1.5"
          className="mt-3 border-2 border-[#2d2620] bg-[#f3efe9]"
        />
      )}

      {/* <section className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statsMyAppointment.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section> */}
      <StatCards stats={statsMyAppointment} />

      <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid w-full grid-cols-1 overflow-hidden border-2 border-[#2d2620]/20 text-xs uppercase tracking-widest sm:grid-cols-3">
            {tabs.map((tab, index) => {
              const isActive = tab.key === activeTab;
              const isLast = index === tabs.length - 1;
              const count = appointmentGroups[tab.key]?.length ?? 0;
              return (
                <Button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  variant="custom"
                  unstyled
                  className={`flex items-center justify-center gap-2 px-3 py-2 text-center transition ${
                    isActive ? "bg-[#f3efe9]" : "bg-white"
                  } ${
                    !isLast
                      ? "border-b-2 border-[#2d2620]/20 sm:border-b-0 sm:border-r-2"
                      : ""
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{tab.label}</span>
                  <span className="rounded-full border border-[#2d2620]/40 px-2 py-0.5 text-[0.65rem]">
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="relative mt-3 flex min-h-0 flex-1 flex-col border-2 border-[#2d2620]/20 bg-white/90 p-3 sm:p-4">
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#2d2620]/5"></div>
            {activeAppointments.length === 0 ? (
              <EmptyState
                title={activeTabMeta.emptyTitle}
                description={activeTabMeta.emptyDescription}
                icon={activeTabMeta.emptyIcon}
                actionLabel={
                  activeTab === "upcoming" ? "Book Appointment" : null
                }
                onAction={activeTab === "upcoming" ? onBook : null}
              />
            ) : (
              <div className="scrollbar-hidden  mt-5 flex min-h-0 flex-1 flex-col max-h-[50vh] min-h-[50vh] overflow-y-auto pr-3 md:min-h-0">
                <div className="grid gap-3">
                  {activeAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <div className="bg-[#2d2620] p-3 text-[#f3efe9]">
            <p className="text-xs uppercase tracking-widest text-[#f3efe9]/70">
              Loyalty Status
            </p>
            <p className="mt-2 text-2xl font-semibold">120 pts</p>
            <p className="mt-2 text-xs text-[#f3efe9]/80">
              Redeem a glow boost on your next visit.
            </p>
            <button className="mt-3 w-full border border-[#f3efe9] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#f3efe9] hover:text-[#2d2620] sm:text-xs">
              Redeem Points
            </button>
          </div>

          {/* <div className="border-2 border-[#2d2620]/20 bg-white/80 p-3">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Quick Actions
            </p>
            <div className="mt-2 space-y-3">
              {quickActions.map((action) => (
                <QuickAction key={action.title} {...action} />
              ))}
            </div>
          </div> */}
          <QuickActions quickActions={quickActions} />
          <Note
            title={"Need Support?"}
            primaryText={"Chat with the front desk for changes."}
            secondaryText={"We are happy to help with timing or add-ons."}
          />

          {/* <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-3 text-sm">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Need Support?
            </p>
            <p className="mt-2 font-semibold">
              Chat with the front desk for changes.
            </p>
            <p className="text-xs text-[#5f544b]">
              We are happy to help with timing or add-ons.
            </p>
          </div> */}
        </aside>
      </div>
    </section>
  );
};

const EmptyState = ({ title, description, icon, actionLabel, onAction }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9]">
        {icon ? (
          <img src={icon} alt="" className="h-6 w-6 opacity-70" />
        ) : (
          <span className="text-2xl font-semibold text-[#2d2620]/70">X</span>
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-[#5f544b]">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="border-2 border-[#2d2620] px-4 py-1.5 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// const AppointmentCard = ({ appointment }) => {
//   const statusStyles = {
//     Confirmed: "border-[#2d2620] text-[#2d2620]",
//     Completed: "border-[#2d2620] bg-[#2d2620] text-[#f3efe9]",
//     Cancelled: "border-[#b0412e] text-[#b0412e]",
//   };
//   const actionStyles = {
//     primary: "border-[#2d2620] hover:bg-[#2d2620] hover:text-[#f3efe9]",
//     ghost:
//       "border-[#2d2620]/30 bg-white/70 hover:border-[#2d2620] hover:text-[#2d2620]",
//     danger:
//       "border-[#b0412e] text-[#b0412e] hover:bg-[#b0412e] hover:text-white",
//   };

//   return (
//     <article className="relative overflow-hidden border-2 border-[#2d2620] bg-white p-3 sm:p-4">
//       <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#2d2620]/5"></div>
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//             Appointment {appointment.id}
//           </p>
//           <h3 className="mt-1 text-base font-semibold">
//             {appointment.service}
//           </h3>
//           <p className="text-xs text-[#5f544b]">{appointment.description}</p>
//         </div>
//         <div className="flex flex-wrap items-center gap-2">
//           <span
//             className={`rounded-full border-2 px-3 py-1 text-[0.65rem] uppercase tracking-widest ${
//               statusStyles[appointment.status] ??
//               "border-[#2d2620]/40 text-[#5f544b]"
//             }`}
//           >
//             {appointment.status}
//           </span>
//           {appointment.payment && (
//             <span className="rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#2d2620]">
//               {appointment.payment}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//         <InfoTile label="Date" value={appointment.date} icon={calendarIcon} />
//         <InfoTile label="Time" value={appointment.time} icon={clockIcon} />
//         <InfoTile label="Staff" value={appointment.staff} icon={hairCareIcon} />
//         <InfoTile
//           label="Amount"
//           value={appointment.amount}
//           icon={creditCardIcon}
//         />
//       </div>

//       <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#2d2620]/10 pt-3">
//         <div>
//           <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//             Location & Notes
//           </p>
//           <p className="text-sm font-semibold">{appointment.location}</p>
//           <p className="text-xs text-[#5f544b]">{appointment.notes}</p>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {appointment.actions?.map((action) => (
//             <button
//               key={action.label}
//               type="button"
//               className={`border-2 px-3 py-1.5 text-xs uppercase tracking-widest transition ${
//                 actionStyles[action.variant] ?? actionStyles.ghost
//               }`}
//             >
//               {action.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </article>
//   );
// };
// {
//   /* <AppointmentCard appointment={appointment}/>; */
// }

// const InfoTile = ({ label, value, icon }) => {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
//         <img src={icon} alt="" className="h-4 w-4 opacity-70" />
//       </div>
//       <div>
//         <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//           {label}
//         </p>
//         <p className="text-sm font-semibold">{value}</p>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, subtitle, icon }) => {
//   return (
//     <div className="relative overflow-hidden border-2 border-[#2d2620]/20 bg-white/70 p-4">
//       <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#2d2620]/5"></div>
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//             {title}
//           </p>
//           <p className="mt-2 text-xl font-semibold">{value}</p>
//           {subtitle && (
//             <p className="mt-1 text-xs text-[#5f544b]">{subtitle}</p>
//           )}
//         </div>
//         <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
//           <img src={icon} alt="" className="h-5 w-5 opacity-70" />
//         </div>
//       </div>
//     </div>
//   );
// };

// const QuickAction = ({ icon, title, description }) => {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
//         <img src={icon} alt="" className="h-4 w-4 opacity-70" />
//       </div>
//       <div>
//         <p className="text-sm font-semibold">{title}</p>
//         <p className="text-xs text-[#5f544b]">{description}</p>
//       </div>
//     </div>
//   );
// };

export default MyAppointmentPage;
