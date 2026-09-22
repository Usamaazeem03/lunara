import calendarIcon from "../../../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../../../Shared/assets/icons/credit-card.svg";

// Sample data for the client dashboard. These records are not fetched from the API.
export const statsPaymentHistory = [
  {
    title: "Total Spent",
    value: "GBP 530",
    subtitle: "All time",
    icon: creditCardIcon,
  },
  {
    title: "This Month",
    value: "GBP 114",
    subtitle: "February 2026",
    icon: calendarIcon,
  },
  {
    title: "Pending",
    value: "GBP 0",
    subtitle: "Outstanding balance",
    icon: clockIcon,
  },
];

export const transactions = [
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-104",
    date: "08/02/2026",
    service: "Classic Haircut",
    staff: "Alex Johnson",
    amount: "GBP 45",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-103",
    date: "01/18/2026",
    service: "Glow Facial",
    staff: "Ava Lee",
    amount: "GBP 75",
    method: "Card",
    status: "Paid",
  },
  {
    id: "TRX-102",
    date: "12/21/2025",
    service: "Relax Massage",
    staff: "No Preference",
    amount: "GBP 85",
    method: "Wallet",
    status: "Paid",
  },
];

export const paymentMethods = [
  {
    id: "card-4242",
    label: "**** **** **** 4242",
    meta: "Expires 12/26",
    status: "Default",
  },
];

export const filterTabs = [
  { key: "All", label: "All" },
  { key: "Paid", label: "Paid" },
  { key: "Pending", label: "Pending" },
  { key: "Refunded", label: "Refunded" },
];

export const spendingSummaryItems = [
  { label: "Hair Services", detail: "GBP 210" },
  { label: "Skin Treatments", detail: "GBP 175" },
  { label: "Massage", detail: "GBP 145" },
];
