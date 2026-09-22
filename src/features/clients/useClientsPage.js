import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { useCurrencyCode } from "../settings/useCurrencyCode";
import { useClients } from "./useClients";
import { mergeClients, slugifyClientName } from "./clientUtils";

export function useClientsPage() {
  const navigate = useNavigate();
  const { slug: ownerRouteSlug } = useParams();
  const {
    ownerId,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useOwnerId();
  const {
    clients,
    appointments,
    isLoading: isClientsLoading,
    error,
  } = useClients(ownerId);
  const { currencyCode, isLoading: isCurrencyLoading } =
    useCurrencyCode(ownerId);
  const isLoading = isOwnerLoading || isClientsLoading;
  const loadError =
    ownerError?.message ||
    error?.message ||
    (!isLoading && !ownerId ? "Please sign in to load clients." : "");
  const mergedClients = useMemo(
    () => mergeClients(clients, appointments),
    [clients, appointments],
  );
  const [showAddClient, setShowAddClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mergedClients.filter(
    (client) =>
      (client.full_name || client.name)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery),
  );

  const handleViewProfile = useCallback(
    (client) => {
      const clientSlug = slugifyClientName(client.full_name || client.name);
      const salonSlug = ownerRouteSlug || ownerId || "salon";

      navigate(
        `/owner/salon/${salonSlug}/clients/${clientSlug}?client=${encodeURIComponent(client.id)}`,
        {
          state: {
            clientId: client.id,
            clientName: client.full_name || client.name || "Unknown Client",
          },
        },
      );
    },
    [navigate, ownerId, ownerRouteSlug],
  );

  return {
    ownerId,
    currencyCode,
    isLoading,
    isCurrencyLoading,
    loadError,
    clients: mergedClients,
    filteredClients,
    searchQuery,
    setSearchQuery,
    showForm: showAddClient,
    openCreateForm: () => setShowAddClient(true),
    closeForm: () => setShowAddClient(false),
    viewProfile: handleViewProfile,
  };
}
