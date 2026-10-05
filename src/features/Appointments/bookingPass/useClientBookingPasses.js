import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth.js";
import { getClientBookingPasses } from "../../../services/apiBookingPass.js";

export function useClientBookingPasses() {
  const { user, profile, loading } = useAuth();
  const query = useQuery({
    queryKey: ["client-booking-passes", user?.id],
    queryFn: getClientBookingPasses,
    enabled: Boolean(user?.id),
    refetchOnWindowFocus: true,
  });
  return {
    ...query,
    user,
    profile,
    isLoading: loading || query.isLoading,
    appointments: query.data ?? [],
  };
}
