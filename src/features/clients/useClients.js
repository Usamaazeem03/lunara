import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../services/apiClients";

const EMPTY_LIST = [];
export const clientsQueryKey = (ownerId) => ["clients", ownerId];

export function useClients(ownerId) {
  const query = useQuery({
    queryKey: clientsQueryKey(ownerId),
    queryFn: () => getClients(ownerId),
    enabled: Boolean(ownerId),
  });
  return {
    ...query,
    clients: query.data?.clients ?? EMPTY_LIST,
    appointments: query.data?.appointments ?? EMPTY_LIST,
  };
}
