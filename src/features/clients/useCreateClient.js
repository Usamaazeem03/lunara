import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient as createClientApi } from "../../services/apiClients";
import { notify } from "../../Shared/lib/toast";
import { clientsQueryKey } from "./useClients";

export default function useCreateClient(ownerId) {
  useTranslation();
  const queryClient = useQueryClient();
  const {
    mutate: createClient,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: (payload) => createClientApi({ ...payload, owner_id: ownerId }),
    onSuccess: () => {
      notify.success(translatedMessage("clients.clientAddedSuccessfully"));
      return queryClient.invalidateQueries({
        queryKey: clientsQueryKey(ownerId),
      });
    },
    onError: (error) =>
      notify.error(error.message || translatedMessage("clients.unableToSaveTheClient")),
  });
  return { createClient, isCreating, error };
}
