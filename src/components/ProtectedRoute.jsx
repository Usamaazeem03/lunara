// Guards protected routes by auth state and keeps role-scoped dashboard URLs consistent.
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { role: routeRole } = useParams();
  const { isAuthenticated, role, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="border-ink mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-ink/60 mt-4 font-medium">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/auth/client/signin" replace state={{ from: location }} />
    );
  }

  const isRouteRoleScoped = routeRole === "owner" || routeRole === "client";
  const currentRole = role === "owner" || role === "client" ? role : "client";

  if (isRouteRoleScoped && routeRole !== currentRole) {
    const dashboardPath =
      currentRole === "owner" && profile?.salon_slug
        ? `/owner/salon/${profile.salon_slug}`
        : "/dashboard";

    return <Navigate to={dashboardPath} replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
