import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import {
  getSalonInformation,
  saveSalonInformation,
} from "../../services/apiSalonSettings";
import { notify } from "../../Shared/lib/toast";

export function useSalonInformation() {
  const { user, syncProfile } = useAuth();
  const client = useQueryClient();
  const queryKey = ["salon-information", user?.id];
  const query = useQuery({
    queryKey,
    queryFn: () => getSalonInformation(user.id),
    enabled: Boolean(user?.id),
  });
  const save = useMutation({
    mutationFn: (values) => saveSalonInformation(user.id, values),
    onSuccess: (data) => {
      client.setQueryData(queryKey, data);
      syncProfile(data);
      client.invalidateQueries({ queryKey: ["client-salons"] });
      notify.success("Salon information updated.");
    },
    onError: (error) => notify.error(error.message),
  });
  return { ...query, save };
}
