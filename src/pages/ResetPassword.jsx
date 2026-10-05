import { Navigate, useLocation } from "react-router-dom";

// Compatibility entry point; the auth feature owns all recovery UI and logic.
export default function ResetPassword() {
  const { search, hash } = useLocation();
  return (
    <Navigate to={`/auth/client/reset-password${search}${hash}`} replace />
  );
}
