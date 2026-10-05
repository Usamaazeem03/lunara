import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAppointmentsByOwner } from "../services/apiAppointment";

const EMPTY_APPOINTMENTS = [];

export const appointmentsQueryKey = (ownerId, includeCancelled = false) => [
  "appointments",
  ownerId ?? "all",
  includeCancelled ? "all" : "service-stats",
];

export function useAppointments(ownerId, options = {}) {
  const { includeCancelled = false } = options;
  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: appointmentsQueryKey(ownerId, includeCancelled),
    queryFn: () => getAppointmentsByOwner(ownerId, includeCancelled),
    enabled: Boolean(ownerId),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  return {
    appointments: data ?? EMPTY_APPOINTMENTS,
    isLoading,
    isFetching,
    error,
    isError,
  };
}
