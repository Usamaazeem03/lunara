import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rateStaffAppointment } from "../../services/apiStaffRatings";
import { notify } from "../../Shared/lib/toast";

export function useRateStaff(ownerId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rateStaffAppointment,
    onSuccess: () => {
      notify.success("Thank you for rating your visit.");
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["client-booking-passes"] }),
        queryClient.invalidateQueries({ queryKey: ["staff", ownerId] }),
        queryClient.invalidateQueries({ queryKey: ["booking-staff", ownerId] }),
      ]);
    },
  });
}
