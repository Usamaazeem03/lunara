import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rateStaffAppointment } from "../../services/apiStaffRatings";
import { notify } from "../../Shared/lib/toast";

export function useRateStaff(ownerId) {
  useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rateStaffAppointment,
    onSuccess: () => {
      notify.success(translatedMessage("staff.thankYouForRatingYourVisit"));
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["client-booking-passes"] }),
        queryClient.invalidateQueries({ queryKey: ["staff", ownerId] }),
        queryClient.invalidateQueries({ queryKey: ["booking-staff", ownerId] }),
      ]);
    },
  });
}
