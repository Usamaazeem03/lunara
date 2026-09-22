import { useQuery } from "@tanstack/react-query";
import { getBookingStaff } from "../../../services/apiClientBooking.js";

const NO_PREFERENCE = {
  id: "no-preference",
  name: "No Preference",
  role: "Any available stylist",
  rating: "Any rating",
  bookings: "Fastest booking",
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
        : "No ratings yet",
    bookings: `${staff.appointments_count || 0} bookings`,
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
      error || !ownerId ? [] : [...data.map(mapStaff), NO_PREFERENCE],
    loading: isLoading,
    error: error?.message || (!ownerId ? "Please select a salon first." : ""),
  };
}
