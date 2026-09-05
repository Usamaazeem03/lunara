import { useQuery } from "@tanstack/react-query";
import { getCurrency } from "../../services/apiSettings.js";
import { useOwnerId } from "../../globalHooks/useOwnerId.js";

export function useCurrencyCode(ownerId) {
  const { ownerId: resolvedOwnerId, isLoading: isOwnerLoading } =
    useOwnerId(ownerId);

  const { isLoading, data, error } = useQuery({
    queryKey: ["currencyCode", resolvedOwnerId ?? "authenticated-user"],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      if (!resolvedOwnerId) {
        throw new Error("Authenticated owner could not be found");
      }

      return getCurrency(resolvedOwnerId);
    },
    enabled: Boolean(resolvedOwnerId),
  });

  return {
    isLoading: isOwnerLoading || isLoading,
    currencyCode: data ?? null,
    error,
  };
}
