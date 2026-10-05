import { localizedError } from "../../i18n/localizedError.js";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getExternalWebsite } from "../../services/apiWebsite.js";
import { useOwnerId } from "../../globalHooks/useOwnerId.js";

export function useExternalWebsite(ownerId) {
  useTranslation();

  const { ownerId: resolvedOwnerId, isLoading: isOwnerLoading } =
    useOwnerId(ownerId);

  const { isLoading, data, error } = useQuery({
    queryKey: ["externalWebsite", resolvedOwnerId ?? "authenticated-user"],

    staleTime: 0,

    queryFn: async () => {
      if (!resolvedOwnerId) {
        throw localizedError("settings.authenticatedOwnerCouldNotBeFound");
      }

      return getExternalWebsite(resolvedOwnerId);
    },

    enabled: Boolean(resolvedOwnerId),
  });

  return {
    isLoading: isOwnerLoading || isLoading,
    externalWebsiteUrl: data ?? null,
    error,
  };
}
