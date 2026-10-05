import i18n from "./i18n.js";

// Translate only known application enum labels; preserve custom values.
const labelKeys = {
  "status": {
    "pending": "common.pending",
    "confirmed": "common.confirmed",
    "completed": "common.completed",
    "cancelled": "common.cancelled",
    "paid": "common.paid",
    "refunded": "dashboard.refunded",
    "active": "services.active",
    "inactive": "services.inactive",
    "upcoming": "common.upcoming",
    "past": "dashboard.past"
  },
  "payment": {
    "cash": "booking.cash",
    "card": "common.card",
    "wallet": "common.wallet",
    "credit card": "payments.creditCard",
    "debit card": "payments.debitCard",
    "online": "common.online",
    "pay at salon": "common.payAtSalon"
  },
  "category": {
    "hair": "services.hair",
    "grooming": "services.grooming",
    "skin": "services.skin",
    "spa": "common.spa",
    "nails": "services.nails",
    "kid's": "services.kidS",
    "general": "services.general"
  },
  "role": {
    "senior stylist": "staff.seniorStylist",
    "barber": "staff.barber",
    "spa specialist": "staff.spaSpecialist",
    "nail technician": "staff.nailTechnician",
    "receptionist": "staff.receptionist",
    "manager": "staff.manager"
  },
  "day": {
    "sunday": "appointments.sunday",
    "monday": "appointments.monday",
    "tuesday": "appointments.tuesday",
    "wednesday": "appointments.wednesday",
    "thursday": "appointments.thursday",
    "friday": "appointments.friday",
    "saturday": "appointments.saturday"
  },
  "range": {
    "last 30 days": "reports.last30Days",
    "last 90 days": "reports.last90Days",
    "this year": "reports.thisYear"
  }
};

export function fixedLabel(value, group) {
  const key = labelKeys[group]?.[String(value ?? "").trim().toLowerCase()];
  return key ? i18n.t(key) : value;
}
