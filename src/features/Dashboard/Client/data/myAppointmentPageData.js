import calendarIcon from "../../../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../../../Shared/assets/icons/clock.svg";
import giftIcon from "../../../../Shared/assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../../../Shared/assets/icons/hair-care.svg";

// Sample data for the client dashboard. These records are not fetched from the API.
export const appointmentGroups = {
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

export const tabs = [
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

export const quickActions = [
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
