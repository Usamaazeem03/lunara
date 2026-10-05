import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsQueryKey } from "../../globalHooks/useAppointments";
import { confirmAppointment as confirmAppointmentApi } from "../../services/apiAppointment";
import { notify } from "../../Shared/lib/toast";

export const useConfirmAppointment = (ownerId) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: confirmAppointment, isPending: isConfirming } = useMutation({
    mutationFn: async (appointmentId) => {
      const { data, error } = await confirmAppointmentApi(appointmentId);
      if (error) {
        throw new Error(error.message || t("appointments.unableToConfirmAppointment"));
      }
      return data;
    },
    onSuccess: () => {
      if (ownerId) {
        queryClient.invalidateQueries({ queryKey: ["payments", ownerId] });
        queryClient.invalidateQueries({
          queryKey: appointmentsQueryKey(ownerId, true),
        });
        notify.success(translatedMessage("appointments.appointmentConfirmedSuccessfully"));
      }
    },
    onError: (error) => notify.error(error.message),
  });

  return { confirmAppointment, isConfirming };
};
