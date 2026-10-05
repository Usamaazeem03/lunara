import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { localizedError } from "../../i18n/localizedError.js";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateExternalWebsite } from "../../services/apiWebsite.js";
import { supabase } from "../../services/supabase.js";
import { notify } from "../../Shared/lib/toast.jsx";

export function useUpdateExternalWebsite(ownerId) {
  useTranslation();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (websiteUrlOrOptions) => {
      const options =
        typeof websiteUrlOrOptions === "string"
          ? { websiteUrl: websiteUrlOrOptions }
          : (websiteUrlOrOptions ?? {});

      const { websiteUrl = "", explicitOwnerId } = options;

      const currentOwnerId = explicitOwnerId ?? ownerId;

      let resolvedOwnerId = currentOwnerId;

      // If ownerId wasn't passed, get authenticated user
      if (!resolvedOwnerId) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        resolvedOwnerId = user?.id;
      }

      if (!resolvedOwnerId) {
        throw localizedError("settings.authenticatedOwnerCouldNotBeFound");
      }

      return updateExternalWebsite(resolvedOwnerId, websiteUrl);
    },

    onSuccess: async (updatedWebsiteUrl, variables) => {
      const resolvedOwnerId = variables?.explicitOwnerId ?? ownerId;

      const queryKey = [
        "externalWebsite",
        resolvedOwnerId ?? "authenticated-user",
      ];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, updatedWebsiteUrl);

      if (updatedWebsiteUrl) {
        notify.success(translatedMessage("settings.externalWebsiteUpdated"));
      } else {
        notify.success(translatedMessage("settings.externalWebsiteRemoved"));
      }
    },
  });
}
