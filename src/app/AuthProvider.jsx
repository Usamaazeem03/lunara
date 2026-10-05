import { Outlet, useMatch } from "react-router-dom";
import { AuthContext } from "../hooks/authContext";
import { useAuthState } from "../features/auth/useAuthState";

export default function AuthProvider({ children }) {
  // Public salon display data comes entirely from the public-salon endpoint.
  // Keep session tracking active, but defer the visitor's profile until needed.
  const isPublicSalon = Boolean(useMatch("/salon/:slug"));
  const auth = useAuthState({ loadProfile: !isPublicSalon });
  return (
    <AuthContext.Provider value={auth}>
      {children ?? <Outlet />}
    </AuthContext.Provider>
  );
}
