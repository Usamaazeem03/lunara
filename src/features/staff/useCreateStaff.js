import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaff as createStaffApi } from "../../services/apiStaff";
import { notify } from "../../Shared/lib/toast";
import { staffQueryKey } from "./useStaff";

export default function useCreateStaff(ownerId) {
  useTranslation();
  const queryClient = useQueryClient();
  const {
    mutate: createStaff,
    isPending: isCreating,
    error,
    variables,
  } = useMutation({
    mutationFn: (payload) => createStaffApi({ ...payload, owner_id: ownerId }),
    onSuccess: () => {
      notify.success(translatedMessage("staff.staffMemberAddedSuccessfully"));
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: staffQueryKey(ownerId) }),
        queryClient.invalidateQueries({ queryKey: ["booking-staff", ownerId] }),
      ]);
    },
    onError: (error) => notify.error(error.message),
  });
  return { createStaff, isCreating, error, variables };
}
