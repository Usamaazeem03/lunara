import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  signIn,
  signUp,
  signInWithGoogle,
  getSignupCountry,
  resumeSavedAccount,
} from "../../services/apiAuth";
import { getCurrencyFromCountry } from "../../utils/currency";
import { saveAccount } from "../../utils/deviceMemory";
import { getSavedSession } from "../../utils/savedAccountSessions";
import { getAuthDestination } from "./authValidation";
import { notify } from "../../Shared/lib/toast";

export function useAuthForm({ role, isSignup, onModeChange }) {
  const navigate = useNavigate();
  const { syncProfile } = useAuth();
  const { data: country } = useQuery({
    queryKey: ["auth-signup-country"],
    queryFn: getSignupCountry,
    enabled: isSignup && role === "owner",
    staleTime: Infinity,
    retry: false,
  });
  const currencyCode = getCurrencyFromCountry(country);
  const openDashboard = (data) => {
    if (data.profile) syncProfile(data.profile);
    let ownerId;
    try {
      ownerId = localStorage.getItem("owner_id");
    } catch {
      /* Storage is optional. */
    }
    navigate(getAuthDestination(role, ownerId), { replace: true });
  };
  const submit = useMutation({
    mutationFn: (values) =>
      isSignup
        ? signUp({ ...values, role, currencyCode })
        : signIn({ ...values, expectedRole: role }),
    onSuccess: (data, values) => {
      if (data.profile) syncProfile(data.profile);
      if (isSignup && !data.session) {
        notify.success(
          "Account created. Check your email to confirm your account, then sign in.",
        );
        onModeChange("login");
        return;
      }
      if (values.rememberMe)
        saveAccount(values.email.trim(), role, data.session);
      openDashboard(data);
    },
    retry: false,
    gcTime: 0,
  });
  const google = useMutation({
    mutationFn: () => signInWithGoogle(role),
    retry: false,
    gcTime: 0,
  });
  const savedAccount = useMutation({
    mutationFn: ({ email }) =>
      resumeSavedAccount({
        email,
        expectedRole: role,
        savedSession: getSavedSession(email, role),
      }),
    onSuccess: (data, { email }) => {
      saveAccount(email, role, data.session);
      openDashboard(data);
    },
    retry: false,
    gcTime: 0,
  });
  return {
    submit,
    google,
    savedAccount,
    pending: submit.isPending || google.isPending || savedAccount.isPending,
    error: submit.error || google.error || savedAccount.error,
  };
}
