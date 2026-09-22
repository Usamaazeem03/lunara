import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../../services/apiAuth";
import { uploadAvatar } from "../../services/avatarService";
import { getAllSavedAccounts } from "../../utils/deviceMemory";
import {
  saveSession,
  clearSavedSessionsForUser,
} from "../../utils/savedAccountSessions";

export function useAuthState() {
  const client = useQueryClient();
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isRecoverySession, setIsRecoverySession] = useState(
    () =>
      new URLSearchParams(window.location.hash.slice(1)).get("type") ===
      "recovery",
  );
  const currentUserId = useRef(null);
  useEffect(() => {
    const unsubscribe = authApi.subscribeToAuthChanges((event, session) => {
      if (event === "SIGNED_OUT" && currentUserId.current)
        clearSavedSessionsForUser(currentUserId.current);
      if (session?.user?.email) {
        for (const account of getAllSavedAccounts()) {
          if (account.email.toLowerCase() === session.user.email.toLowerCase())
            saveSession(account.email, account.role, session);
        }
      }
      const nextId = session?.user?.id || null;
      if (currentUserId.current && currentUserId.current !== nextId)
        client.removeQueries();
      currentUserId.current = nextId;
      setUser(session?.user || null);
      setCheckingSession(false);
      if (event === "PASSWORD_RECOVERY") setIsRecoverySession(true);
      if (!session) setIsRecoverySession(false);
    });
    return unsubscribe;
  }, [client]);

  const profileQuery = useQuery({
    queryKey: ["auth-profile", user?.id],
    queryFn: () => authApi.getAuthProfile(user.id),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    retry: 1,
  });
  const syncProfile = useCallback(
    (profile) => {
      if (profile?.id === currentUserId.current) {
        const queryKey = ["auth-profile", profile.id];
        client.cancelQueries({ queryKey });
        client.setQueryData(queryKey, profile);
      }
    },
    [client],
  );
  const updateProfile = useCallback(
    async (id, updates) => {
      const profile = await authApi.updateAuthProfile(id, updates);
      syncProfile(profile);
      client.invalidateQueries({ queryKey: ["salon-information", id] });
      return profile;
    },
    [client, syncProfile],
  );
  useEffect(() => {
    const onAvatarUpdated = ({ detail }) => {
      if (detail?.userId !== currentUserId.current) return;
      client.setQueryData(["auth-profile", detail.userId], (profile) =>
        profile ? { ...profile, avatar_img: detail.url } : profile,
      );
    };
    window.addEventListener("lunara:avatar-updated", onAvatarUpdated);
    return () =>
      window.removeEventListener("lunara:avatar-updated", onAvatarUpdated);
  }, [client]);

  return {
    user,
    profile: profileQuery.data || null,
    loading: checkingSession || Boolean(user && profileQuery.isPending),
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch,
    isAuthenticated: Boolean(user),
    isRecoverySession,
    role: profileQuery.data?.role || user?.user_metadata?.role,
    signIn: authApi.signIn,
    signUp: authApi.signUp,
    signOut: authApi.signOut,
    signInWithGoogle: authApi.signInWithGoogle,
    resetPassword: authApi.requestPasswordReset,
    updateProfile,
    syncProfile,
    uploadAvatar,
  };
}
