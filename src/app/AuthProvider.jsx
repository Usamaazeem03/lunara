import { AuthContext } from "../hooks/authContext";
import { useAuthState } from "../features/auth/useAuthState";

export default function AuthProvider({ children }) {
  const auth = useAuthState();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
