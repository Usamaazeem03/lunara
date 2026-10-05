import { localizedError } from "../../i18n/localizedError.js";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getCurrency } from "../../services/apiSettings.js";
import { useOwnerId } from "../../globalHooks/useOwnerId.js";

export function useCurrencyCode(ownerId) {
  useTranslation();
  const { ownerId: resolvedOwnerId, isLoading: isOwnerLoading } =
    useOwnerId(ownerId);

  const { isLoading, data, error } = useQuery({
    queryKey: ["currencyCode", resolvedOwnerId ?? "authenticated-user"],
    staleTime: 0,
    queryFn: async () => {
      if (!resolvedOwnerId) {
        throw localizedError("settings.authenticatedOwnerCouldNotBeFound");
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
