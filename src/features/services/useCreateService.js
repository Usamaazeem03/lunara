import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService as createServiceApi } from "../../services/apiServices";
import { servicesQueryKey } from "./useServices";
import { notify } from "../../Shared/lib/toast";

export default function useCreateService(ownerId) {
  useTranslation();
  const queryClient = useQueryClient();
  const { isPending: isCreating, mutate: createService } = useMutation({
    mutationFn: async (payload) => {
      const result = await createServiceApi({ ...payload, owner_id: ownerId });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: () => {
      notify.success(translatedMessage("services.serviceAddedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: servicesQueryKey(ownerId) });
    },
    onError: (error) => {
      notify.error(
        error?.message || translatedMessage("services.anErrorOccurredWhileCreatingTheService"),
      );
    },
  });
  return { isCreating, createService };
}
