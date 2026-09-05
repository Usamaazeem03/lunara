import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteService as deleteServiceApi } from "../../services/apiServices";
import { notify } from "../../Shared/lib/toast";
import { servicesQueryKey } from "./useServices.js";

export function useDeleteService(OwnerId) {
  const queryClient = useQueryClient();
  const {
    isPending,
    variables: deletingServiceId,
    mutate: deleteService,
  } = useMutation({
    mutationFn: (serviceId) => deleteServiceApi(serviceId),
    onSuccess: () => {
      notify.success("Service deleted successfully.");
      queryClient.invalidateQueries({ queryKey: servicesQueryKey(OwnerId) });
    },
    onError: (error) => notify.error(error.message),
  });
  return { isPending, deletingServiceId, deleteService };
}
