import { useQueryClient, useMutation } from "@tanstack/react-query";

import { completeAppointment as completeAppointmentApi } from "../../services/apiAppointment";
import { appointmentsQueryKey } from "../../globalHooks/useAppointments";
import { notify } from "../../Shared/lib/toast";

export function useCompleteAppointment(ownerId) {
  const queryClient = useQueryClient();

  const { mutate: completeAppointment, isPending: isCompleting } =
    useMutation({
      mutationFn: async (appointmentId) => {
        const { data, error } = await completeAppointmentApi(appointmentId);
        if (error) {
          throw new Error(error.message || "Unable to complete appointment.");
        }
        return data;
      },
    onSuccess: () => {
        if (ownerId) {
          queryClient.invalidateQueries({
            queryKey: appointmentsQueryKey(ownerId, true),
          });
        }
        notify.success("Appointment marked as completed.");
      },
      onError: (error) => notify.error(error.message),
    });

  return { completeAppointment, isCompleting };
}
