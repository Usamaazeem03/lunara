import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "../../Shared/lib/toast";

// Share mutation lifecycle behavior; the booking flow supplies its service entry.
export default function useCreateAppointment(
  createAppointmentApi,
  defaultOwnerId = null,
  { notifyErrors = true } = {},
) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    isPending: isCreatingAppointment,
    mutate: createAppointment,
    mutateAsync: createAppointmentAsync,
  } = useMutation({
    mutationFn: async (payload) => {
      const { verification, ...appointmentPayload } = payload;
      const ownerId = appointmentPayload.owner_id ?? defaultOwnerId;

      const { data, error } = await createAppointmentApi({
        ...appointmentPayload,
        owner_id: ownerId,
      }, verification);

      if (error) {
        const appointmentError = new Error(
          error.message || t("appointments.unableToSaveTheAppointment"),
        );

        Object.assign(appointmentError, error);

        throw appointmentError;
      }

      return data;
    },

    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["client-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["client-booking-passes"] });
      const ownerId = payload.owner_id ?? defaultOwnerId;

      if (ownerId) {
        queryClient.invalidateQueries({ queryKey: ["payments", ownerId] });
        queryClient.invalidateQueries({ queryKey: ["clients", ownerId] });
        queryClient.invalidateQueries({ queryKey: ["staff", ownerId] });
        queryClient.invalidateQueries({
          queryKey: ["appointments", ownerId],
        });
      }
    },

    onError: (error) => {
      if (notifyErrors) {
        notify.error(
          error?.message || translatedMessage("appointments.anErrorOccurredWhileCreatingTheAppointment"),
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
