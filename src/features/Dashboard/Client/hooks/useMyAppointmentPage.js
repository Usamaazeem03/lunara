import {
  appointmentGroups,
  tabs,
  quickActions,
} from "../data/myAppointmentPageData.js";
import { useState } from "react";
import calendarIcon from "../../../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../../../Shared/assets/icons/credit-card.svg";
import bellIcon from "../../../../Shared/assets/icons/bell.svg";

// Demo dashboard data is kept here until these screens have API endpoints.
export function useMyAppointmentPage() {
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

  return {
    appointmentGroups,
    tabs,
    activeAppointments,
    activeTabMeta,
    nextAppointment,
    statsMyAppointment,
    quickActions,
    activeTab,
    setActiveTab,
  };
}
