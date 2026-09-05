import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByOwner } from "../services/apiServices";

export const appointmentsQueryKey = (ownerId) => [
  "appointments",
  ownerId ?? "all",
  "service-stats",
];

export function useAppointments(ownerId) {
  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: appointmentsQueryKey(ownerId),
    queryFn: () => getAppointmentsByOwner(ownerId),
    enabled: Boolean(ownerId),
  });

  return {
    appointments: data ?? [],
    isLoading,
    isFetching,
    error,
    isError,
  };
}
