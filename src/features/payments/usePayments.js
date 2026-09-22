import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../../services/apiPayments";
const EMPTY = [];
export const paymentsQueryKey = (ownerId) => ["payments", ownerId];
export function usePayments(ownerId) {
  const query = useQuery({
    queryKey: paymentsQueryKey(ownerId),
    queryFn: () => getPayments(ownerId),
    enabled: Boolean(ownerId),
  });
  return { ...query, appointments: query.data ?? EMPTY };
}
