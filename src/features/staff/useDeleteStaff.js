import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaff as deleteStaffApi } from "../../services/apiStaff";
import { notify } from "../../Shared/lib/toast";
import { staffQueryKey } from "./useStaff";

export function useDeleteStaff(ownerId) {
  const queryClient = useQueryClient();
  const {
    mutate: deleteStaff,
    isPending: isDeleting,
    error,
    variables,
  } = useMutation({
    mutationFn: (id) => deleteStaffApi(id, ownerId),
    onSuccess: () => {
      notify.success("Staff member deleted successfully.");
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: staffQueryKey(ownerId) }),
        queryClient.invalidateQueries({ queryKey: ["booking-staff", ownerId] }),
      ]);
    },
    onError: (error) => notify.error(error.message),
  });
  return { deleteStaff, isDeleting, error, variables };
}
