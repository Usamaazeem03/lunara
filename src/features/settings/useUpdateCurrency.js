import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrency } from "../../services/apiSettings.js";
import { supabase } from "../../services/supabase.js";
import { notify } from "../../Shared/lib/toast.jsx";

export function useUpdateCurrency(ownerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currencyCodeOrOptions) => {
      const options =
        typeof currencyCodeOrOptions === "string"
          ? { currencyCode: currencyCodeOrOptions }
          : (currencyCodeOrOptions ?? {});

      const { currencyCode, explicitOwnerId } = options;
      const currentOwnerId = explicitOwnerId ?? ownerId;

      if (!currencyCode) {
        throw new Error("currency_code is required to update currency");
      }

      let resolvedOwnerId = currentOwnerId;

      if (!resolvedOwnerId) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        resolvedOwnerId = user?.id;
      }

      if (!resolvedOwnerId) {
        throw new Error("Authenticated owner could not be found");
      }

      return updateCurrency(resolvedOwnerId, currencyCode);
    },
    onSuccess: async (updatedCurrencyCode, variables) => {
      const resolvedOwnerId = variables?.explicitOwnerId ?? ownerId;
      const queryKey = [
        "currencyCode",
        resolvedOwnerId ?? "authenticated-user",
      ];

      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, updatedCurrencyCode);
      notify.success(`Currency updated to ${updatedCurrencyCode}.`);
    },
  });
}
