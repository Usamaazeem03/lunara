import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient as createClientApi } from "../../services/apiClients";
import { notify } from "../../Shared/lib/toast";
import { clientsQueryKey } from "./useClients";

export default function useCreateClient(ownerId) {
  const queryClient = useQueryClient();
  const {
    mutate: createClient,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: (payload) => createClientApi({ ...payload, owner_id: ownerId }),
    onSuccess: () => {
      notify.success("Client added successfully.");
      return queryClient.invalidateQueries({
        queryKey: clientsQueryKey(ownerId),
      });
    },
    onError: (error) =>
      notify.error(error.message || "Unable to save the client."),
  });
  return { createClient, isCreating, error };
}
