import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { useUserAvatars } from "../../globalHooks/useUserAvatars";
import { useCurrencyCode } from "../settings/useCurrencyCode";
import { useClients } from "./useClients";
import { mergeClients } from "./clientUtils";
import {
  buildClientAppointmentRows,
  getClientProfileMetrics,
  selectClientProfile,
} from "./clientProfileUtils";

export function useClientProfile() {
  const { clientSlug, slug } = useParams();
  const location = useLocation();
  const { ownerId, isLoading: ownerLoading, error: ownerError } = useOwnerId();
  const query = useClients(ownerId);
  const currency = useCurrencyCode(ownerId);
  const clients = useMemo(
    () => mergeClients(query.clients, query.appointments),
    [query.clients, query.appointments],
  );
  const clientId =
    new URLSearchParams(location.search).get("client") ||
    location.state?.clientId;
  const client = selectClientProfile(clients, clientId, clientSlug);
  const { avatars, error: avatarError } = useUserAvatars([
    client?.avatarProfileId,
  ]);
  const avatarUrl =
    avatars[client?.avatarProfileId] || client?.avatar_img || null;
  const rows = useMemo(
    () => buildClientAppointmentRows(client, currency.currencyCode),
    [client, currency.currencyCode],
  );
  const isLoading = ownerLoading || query.isLoading;
  return {
    ownerId,
    client,
    avatarUrl,
    avatarError,
    rows,
    metrics: getClientProfileMetrics(client),
    currencyCode: currency.currencyCode,
    currencyLoading: currency.isLoading,
    currencyError: currency.error,
    isLoading,
    loadError:
      ownerError?.message ||
      query.error?.message ||
      (!isLoading && !ownerId ? "Please sign in to load this client." : ""),
    backPath: slug ? `/owner/salon/${slug}/clients` : "/dashboard/clients",
    retry: query.refetch,
  };
}
