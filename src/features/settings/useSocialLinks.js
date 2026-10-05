import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import {
  getSocialLinks,
  saveSocialLinks,
} from "../../services/apiSocialLinks.js";
import { notify } from "../../Shared/lib/toast.jsx";
import { translatedMessage } from "../../i18n/translatedMessage.jsx";

export function useSocialLinks() {
  const { user } = useAuth();
  const client = useQueryClient();
  const ownerId = user?.id;
  const queryKey = ["salon-social-links", ownerId];
  const query = useQuery({
    queryKey,
    queryFn: () => getSocialLinks(ownerId),
    enabled: Boolean(ownerId),
    retry: false,
  });
  const save = useMutation({
    mutationFn: (values) => saveSocialLinks(ownerId, values),
    onSuccess: (links) => {
      client.setQueryData(queryKey, links);
      client.invalidateQueries({ queryKey: ["publicSalon"] });
      notify.success(translatedMessage("settings.socialLinks.saved"));
    },
    onError: (error) => notify.error(error.message),
  });
  return { ...query, ownerId, save };
}
