import i18n from "../../i18n/i18n.js";
export const STAFF_ROLES = [
  { key: "Senior Stylist", iconName: "sparkles" },
  { key: "Barber", iconName: "razor-barber" },
  { key: "Spa Specialist", iconName: "skin-care" },
  { key: "Nail Technician", iconName: "finger-nail" },
  { key: "Receptionist", iconName: "bell-concierge" },
  { key: "Manager", iconName: "lead-management" },
];

export const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) =>
      typeof v === "string" ? v.replace(/"/g, "").trim() : v,
    );
  }

  if (typeof value === "string") {
    try {
      // Try parsing JSON first
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((v) =>
          typeof v === "string" ? v.replace(/"/g, "").trim() : v,
        );
      }
    } catch {
      // fallback if not JSON
    }

    return value
      .split(",")
      .map((s) => s.replace(/"/g, "").trim())
      .filter(Boolean);
  }

  return [];
};

export const mapStaffRow = (staff) => {
  return {
    id: staff.id,
    image: staff.image ?? null,
    name: staff.name ?? i18n.t("common.unknown"),
    role: staff.role ?? i18n.t("nav.staff"),
    phone: staff.phone ?? "",
    email: staff.email ?? "",
    schedule: staff.schedule ?? i18n.t("common.monFri"),
    isOnShift: staff.is_on_shift ?? false,
    rating: Number(staff.rating) || 0,
    ratingCount: Number(staff.rating_count) || 0,
    appointments: Number(staff.appointments_count) || 0,
    specialties: ensureArray(staff.specialties),
    createdAt: staff.created_at,
  };
};
