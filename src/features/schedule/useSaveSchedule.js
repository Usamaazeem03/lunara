import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSchedule as saveScheduleApi } from "../../services/apiSchedule";
import { notify } from "../../Shared/lib/toast";
import { scheduleQueryKey } from "./useSchedule";
export function useSaveSchedule(ownerId) {
  useTranslation();
  const queryClient = useQueryClient();
  const {
    mutate: saveSchedule,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: (days) => saveScheduleApi(ownerId, days),
    onSuccess: (data) => {
      queryClient.setQueryData(scheduleQueryKey(ownerId), data);
      notify.success(translatedMessage("schedule.workingHoursSavedSuccessfully"));
      return queryClient.invalidateQueries({
        queryKey: ["booking-working-hours", ownerId],
      });
    },
    onError: (error) => notify.error(error.message),
  });
  return { saveSchedule, isSaving, error };
}
