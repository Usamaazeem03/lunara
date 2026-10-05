import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import {
  getClientInformation,
  saveClientInformation,
} from "../../services/apiClientSettings";
import { notify } from "../../Shared/lib/toast";

export function useClientInformation() {
  useTranslation();
  const { user, syncProfile } = useAuth();
  const client = useQueryClient();
  const queryKey = ["client-information", user?.id];
  const query = useQuery({
    queryKey,
    queryFn: () => getClientInformation(user.id),
    enabled: Boolean(user?.id),
  });
  const save = useMutation({
    mutationFn: (values) => saveClientInformation(user.id, values),
    onSuccess: (data) => {
      client.setQueryData(queryKey, data);
      syncProfile(data);
      notify.success(translatedMessage("clients.personalInformationUpdated"));
    },
    onError: (error) => notify.error(error.message),
  });
  return { ...query, save };
}
