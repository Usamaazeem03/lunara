import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAppointment as createAppointmentApi } from "../../services/apiAppointment";
import { notify } from "../../Shared/lib/toast";

export default function useCreateAppointment(
  defaultOwnerId = null,
  { notifyErrors = true } = {},
) {
  const queryClient = useQueryClient();

  const {
    isPending: isCreatingAppointment,
    mutate: createAppointment,
    mutateAsync: createAppointmentAsync,
  } = useMutation({
    mutationFn: async (payload) => {
      const ownerId = payload.owner_id ?? defaultOwnerId;

      const { data, error } = await createAppointmentApi({
        ...payload,
        owner_id: ownerId,
      });

      if (error) {
        const appointmentError = new Error(
          error.message || "Unable to save the appointment.",
        );

        Object.assign(appointmentError, error);

        throw appointmentError;
      }

      return data;
    },

    onSuccess: (_data, payload) => {
      const ownerId = payload.owner_id ?? defaultOwnerId;

      if (ownerId) {
        queryClient.invalidateQueries({
          queryKey: ["appointments", ownerId],
        });
      }
    },

    onError: (error) => {
      if (notifyErrors) {
        notify.error(
          error?.message || "An error occurred while creating the appointment.",
        );
      }
    },
  });

  return {
    isCreatingAppointment,
    createAppointment,
    createAppointmentAsync,
  };
}
