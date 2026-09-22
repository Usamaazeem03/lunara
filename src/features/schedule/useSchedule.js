import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../../services/apiSchedule";
export const scheduleQueryKey = (ownerId) => ["schedule", ownerId];
export function useSchedule(ownerId) {
  return useQuery({
    queryKey: scheduleQueryKey(ownerId),
    queryFn: () => getSchedule(ownerId),
    enabled: Boolean(ownerId),
  });
}
