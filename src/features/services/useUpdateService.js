import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService as updateServiceApi } from "../../services/apiServices";
import { servicesQueryKey } from "./useServices";
import { notify } from "../../Shared/lib/toast";

export const useUpdateService = (ownerId) => {
  useTranslation();
  const queryClient = useQueryClient();
  const { isPending: isUpdating, mutate: updateService } = useMutation({
    mutationFn: async ({ id, newServiceData }) => {
      const result = await updateServiceApi(id, newServiceData);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: () => {
      notify.success(translatedMessage("services.serviceUpdatedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: servicesQueryKey(ownerId) });
    },
    onError: (error) => {
      notify.error(
        error?.message || translatedMessage("services.anErrorOccurredWhileUpdatingTheService"),
      );
    },
  });
  return { isUpdating, updateService };
};
