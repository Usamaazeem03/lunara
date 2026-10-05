import { useQuery } from "@tanstack/react-query";
import { getBookingWorkingHours } from "../../../services/apiClientBooking.js";
import { getAvailableDates, getTimeSlots } from "./bookingDateUtils.js";

export function useBookingSchedule(ownerId, selectedDate) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking-working-hours", ownerId],
    queryFn: () => getBookingWorkingHours(ownerId),
    enabled: Boolean(ownerId),
  });
  const availableDates = getAvailableDates(data);
  return {
    availableDates,
    timeSlots: getTimeSlots(availableDates[selectedDate]),
    loading: isLoading,
    error: error?.message ?? "",
  };
}
