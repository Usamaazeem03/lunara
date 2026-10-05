import { translateConfig } from "../../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n.js";
import { useQuery } from "@tanstack/react-query";
import { getBookingStaff } from "../../../services/apiClientBooking.js";

const NO_PREFERENCE = {
  id: "no-preference",
  nameKey: "common.noPreference",
  roleKey: "common.anyAvailableStylist",
  ratingKey: "booking.anyRating",
  bookingsKey: "booking.fastestBooking",
  initials: "NP",
  isOnShift: false,
};

function mapStaff(staff) {
  const rating = Number(staff.rating);
  return {
    id: staff.id,
    image: staff.image ?? null,
    name: staff.name,
    role: staff.role,
    rating:
      staff.rating_count > 0 && Number.isFinite(rating)
        ? rating.toFixed(1)
        : i18n.t("common.noRatingsYet"),
    bookings: i18n.t("booking.bookings", { value1: staff.appointments_count || 0 }),
    initials:
      staff.name
        ?.trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??",
    isOnShift: staff.is_on_shift,
  };
}

export function useBookingStaff(ownerId) {
  const { t } = useTranslation();
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking-staff", ownerId],
    queryFn: () => getBookingStaff(ownerId),
    enabled: Boolean(ownerId),
  });
  return {
    staffMembers:
      error || !ownerId ? [] : [...data.map(mapStaff), translateConfig(NO_PREFERENCE)],
    loading: isLoading,
    error: error?.message || (!ownerId ? t("booking.pleaseSelectASalonFirst") : ""),
  };
}
