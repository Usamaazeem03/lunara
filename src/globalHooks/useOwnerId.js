import { useQuery } from "@tanstack/react-query";
import { getOwnerId } from "../services/apiOwnerId";

export function useOwnerId(ownerIdOverride = null) {
  const resolvedOwnerId = ownerIdOverride ?? null;

  const { isLoading, data, error } = useQuery({
    queryKey: ["ownerId", resolvedOwnerId ?? "authenticated-user"],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => getOwnerId(resolvedOwnerId),
    enabled: !resolvedOwnerId,
  });

  return {
    isLoading,
    ownerId: resolvedOwnerId ?? data ?? null,
    error,
  };
}
