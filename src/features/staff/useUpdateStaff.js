import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaff as updateStaffApi } from "../../services/apiStaff";
import { notify } from "../../Shared/lib/toast";
import { staffQueryKey } from "./useStaff";

export function useUpdateStaff(ownerId) {
  useTranslation();
  const queryClient = useQueryClient();
  const {
    mutate: updateStaff,
    isPending: isUpdating,
    error,
    variables,
  } = useMutation({
    mutationFn: ({ id, payload }) =>
      updateStaffApi(id, { ...payload, owner_id: ownerId }),
    onSuccess: () => {
      notify.success(translatedMessage("staff.staffMemberUpdatedSuccessfully"));
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: staffQueryKey(ownerId) }),
        queryClient.invalidateQueries({ queryKey: ["booking-staff", ownerId] }),
      ]);
    },
    onError: (error) => notify.error(error.message),
  });
  return { updateStaff, isUpdating, error, variables };
}
