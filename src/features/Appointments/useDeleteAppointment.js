import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsQueryKey } from "../../globalHooks/useAppointments";
import { deleteAppointment as deleteAppointmentApi } from "../../services/apiAppointment";
import { notify } from "../../Shared/lib/toast";

export function useDeleteAppointment(ownerId) {
  const queryClient = useQueryClient();

  const { mutate: deleteAppointment, isPending: isDeleting } = useMutation({
    mutationFn: async (appointmentId) => {
      const { data, error } = await deleteAppointmentApi(appointmentId);
      if (error) {
        throw new Error(error.message || "Unable to delete appointment.");
      }
      return data;
    },
    onSuccess: () => {
      if (ownerId) {
        queryClient.invalidateQueries({
          queryKey: appointmentsQueryKey(ownerId, true),
        });
      }
      notify.success("Appointment deleted.");
    },
    onError: (error) => notify.error(error.message),
  });

  return { deleteAppointment, isDeleting };
}
