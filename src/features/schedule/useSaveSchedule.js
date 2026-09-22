import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSchedule as saveScheduleApi } from "../../services/apiSchedule";
import { notify } from "../../Shared/lib/toast";
import { scheduleQueryKey } from "./useSchedule";
export function useSaveSchedule(ownerId) {
  const queryClient = useQueryClient();
  const {
    mutate: saveSchedule,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: (days) => saveScheduleApi(ownerId, days),
    onSuccess: (data) => {
      queryClient.setQueryData(scheduleQueryKey(ownerId), data);
      notify.success("Working hours saved successfully.");
      return queryClient.invalidateQueries({
        queryKey: ["booking-working-hours", ownerId],
      });
    },
    onError: (error) => notify.error(error.message),
  });
  return { saveSchedule, isSaving, error };
}
