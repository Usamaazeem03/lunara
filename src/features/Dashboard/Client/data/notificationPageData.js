import bellIcon from "../../../../Shared/assets/icons/bell.svg";
import calendarIcon from "../../../../Shared/assets/icons/calendar.svg";
import creditCardIcon from "../../../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../../../Shared/assets/icons/gift-box-benefits.svg";

// Sample data for the client dashboard. These records are not fetched from the API.
export const notifications = [
  {
    id: "note-1",
    title: "Appointment Reminder",
    message: "Your appointment with Alex Johnson is tomorrow at 10:00 AM.",
    time: "2 hours ago",
    icon: calendarIcon,
    unread: true,
    category: "Appointments",
  },
  {
    id: "note-2",
    title: "Special Offer",
    message: "Get 20% off all spa treatments this week. Book now!",
    time: "1 day ago",
    icon: giftIcon,
    unread: true,
    category: "Offers",
  },
  {
    id: "note-3",
    title: "Rate Your Experience",
    message: "How was your recent visit? Share your feedback with us.",
    time: "3 days ago",
    icon: bellIcon,
    unread: false,
    category: "Feedback",
  },
  {
    id: "note-4",
    title: "Booking Confirmed",
    message:
      "Your appointment for Facial Treatment on Feb 15 at 2:00 PM is confirmed.",
    time: "5 days ago",
    icon: calendarIcon,
    unread: false,
    category: "Appointments",
  },
  {
    id: "note-5",
    title: "Payment Due",
    message: "Your invoice for Relax Massage is unpaid. Complete payment.",
    time: "6 days ago",
    icon: creditCardIcon,
    unread: false,
    category: "Bill Not Paid",
  },
];

export const filterTabs = [
  { key: "All", label: "All" },
  { key: "Appointments", label: "Appointments" },
  { key: "Bill Not Paid", label: "Bill Not Paid" },
];

export const channels = [
  { id: "email", label: "Email Notifications", enabled: true },
  { id: "sms", label: "SMS Notifications", enabled: false },
  { id: "push", label: "Push Notifications", enabled: true },
];

export const deliveryChecklist = [
  { label: "Quiet Hours", detail: "10 PM - 8 AM" },
  { label: "Reminders", detail: "24h before" },
  { label: "Digest", detail: "Weekly" },
];
