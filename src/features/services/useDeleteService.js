import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteService as deleteServiceApi } from "../../services/apiServices";
import { notify } from "../../Shared/lib/toast";
import { servicesQueryKey } from "./useServices.js";

export function useDeleteService(OwnerId) {
  useTranslation();
  const queryClient = useQueryClient();
  const {
    isPending,
    variables: deletingServiceId,
    mutate: deleteService,
  } = useMutation({
    mutationFn: (serviceId) => deleteServiceApi(serviceId),
    onSuccess: () => {
      notify.success(translatedMessage("services.serviceDeletedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: servicesQueryKey(OwnerId) });
    },
    onError: (error) => notify.error(error.message),
  });
  return { isPending, deletingServiceId, deleteService };
}
