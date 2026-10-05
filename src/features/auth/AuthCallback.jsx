import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { completeAuthCallback } from "../../services/apiAuth";
import { useAuth } from "../../hooks/useAuth";

export default function AuthCallback() {
  const { t } = useTranslation();
  const { syncProfile } = useAuth();
  const [role] = useState(() =>
    new URLSearchParams(window.location.search).get("role"),
  );
  const { data, error } = useQuery({
    queryKey: ["auth-callback", role],
    queryFn: () => completeAuthCallback(role),
    retry: false,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (data?.profile) syncProfile(data.profile);
  }, [data, syncProfile]);
  if (data) return <Navigate to="/dashboard" replace />;
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="max-w-md text-center">
        {error ? (
          <>
            <p role="alert" className="text-red-600">
              {error.message}
            </p>
            <Link
              to={`/auth/${role === "owner" ? "owner" : "client"}/signin`}
              className="mt-4 inline-block underline"
            > {t("auth.backToLogin")} </Link>
          </>
        ) : (
          <>
            <div className="border-ink/20 border-t-ink mx-auto h-10 w-10 animate-spin rounded-full border-4" />
            <p role="status" className="mt-4 text-sm"> {t("auth.verifyingYourAccount")} </p>
          </>
        )}
      </div>
    </main>
  );
}
