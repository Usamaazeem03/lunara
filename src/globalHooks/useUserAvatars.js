import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { getUserAvatars } from "../services/apiUserAvatars";

// Call once per list, not once per row. Both lists share the same cached lookup.
export function useUserAvatars(userIds = []) {
  const { user } = useAuth();
  const ids = [...new Set(userIds.filter(Boolean).map(String))].sort();
  const query = useQuery({
    queryKey: ["user-avatars", user?.id, ids],
    queryFn: () => getUserAvatars(ids),
    enabled: Boolean(user?.id) && ids.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return {
    avatars: query.data ?? {},
    isLoading: query.isLoading,
    error: query.error,
  };
}
