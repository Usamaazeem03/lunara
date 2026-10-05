import { useQuery } from "@tanstack/react-query";
import { getPublicSalon } from "../../services/apiPublicSalon.js";

export const publicSalonQueryKey = (slug) => ["publicSalon", slug];

export function usePublicSalon(slug) {
  return useQuery({
    queryKey: publicSalonQueryKey(slug),
    queryFn: () => getPublicSalon(slug),
    enabled: Boolean(slug),
    // Keep the existing immediate error experience without repeated requests.
    retry: false,
  });
}
