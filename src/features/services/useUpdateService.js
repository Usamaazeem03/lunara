import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService as updateServiceApi } from "../../services/apiServices";
import { servicesQueryKey } from "./useServices";
import { notify } from "../../Shared/lib/toast";

export const useUpdateService = (ownerId) => {
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
      notify.success("Service updated successfully.");
      queryClient.invalidateQueries({ queryKey: servicesQueryKey(ownerId) });
    },
    onError: (error) => {
      notify.error(
        error?.message || "An error occurred while updating the service.",
      );
    },
  });
  return { isUpdating, updateService };
};
