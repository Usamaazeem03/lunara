import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../Shared/lib/supabaseClient";
import { uploadAvatar } from "../services/avatarService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track last fetched user ID so we never fetch the same profile twice
  const lastFetchedUserId = useRef(null);

  // ─── Fetch profile (separate, non-blocking helper) ──────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId || lastFetchedUserId.current === userId) return;
    lastFetchedUserId.current = userId;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);

        // Don't wait for profile fetch — app renders with auth user immediately.
        // Profile loads in the background without blocking.
        setLoading(false);

        // Profile fetch is fire-and-forget (non-blocking)
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        lastFetchedUserId.current = null;
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── SIGN UP ──────────────────────────────────────────────────────────────────
  const signUp = useCallback(
    async ({ email, password, fullName, phone, role }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: fullName, phone, role },
        },
      });

      if (error) throw error;
      return data;
    },
    [],
  );

  // ── SIGN IN with role validation ─────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password, expectedRole }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    //  Role check uses user_metadata (in the auth session — always
    // accurate, no async DB call needed).
    if (expectedRole && data.user) {
      const userRole = data.user.user_metadata?.role;
      if (userRole && userRole !== expectedRole) {
        await supabase.auth.signOut();
        throw new Error(
          `This account was created as a ${userRole}. Please sign in from the ${userRole} login page.`,
        );
      }
    }

    return data;
  }, []);

  // ── SIGN OUT ─────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // ── GOOGLE OAUTH ─────────────────────────────────────────────────────────────
  //  Accepts intendedRole and embeds it in the redirect URL as a query
  // param. The /auth/callback page reads this and validates portal isolation.
  const signInWithGoogle = useCallback(async (intendedRole) => {
    const redirectUrl = new URL(`${window.location.origin}/auth/callback`);
    if (intendedRole) {
      redirectUrl.searchParams.set("role", intendedRole);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl.toString() },
    });

    if (error) throw error;
    return data;
  }, []);

  // ── UPDATE PROFILE ───────────────────────────────────────────────────────────
  // Retry logic: 1 retry with 800ms gap — gives DB trigger time to create row.
  const updateProfile = useCallback(async (userId, updates) => {
    if (!userId) throw new Error("User ID is required");

    const attempt = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select();

      if (error) throw error;

      // Keep local profile state in sync
      setProfile((prev) => (prev ? { ...prev, ...updates } : updates));
      lastFetchedUserId.current = userId; // prevent redundant re-fetch
      return data;
    };

    try {
      return await attempt();
    } catch {
      // One retry after 800ms
      await new Promise((r) => setTimeout(r, 800));
      return await attempt();
    }
  }, []);

  // ── RESET PASSWORD ───────────────────────────────────────────────────────────
  const resetPassword = useCallback(async ({ email, role = "client" }) => {
    const safeRole = role === "owner" || role === "client" ? role : "client";
    const publicUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${publicUrl}/auth/${safeRole}/reset-password`,
    });

    if (error) throw error;
    return data;
  }, []);

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updateProfile,
    resetPassword,
    uploadAvatar,
    isAuthenticated: !!user,

    //  user_metadata.role is embedded in the auth session and available
    // INSTANTLY after login — no async DB fetch needed. Falls back to
    // profile.role for cases where metadata wasn't set (e.g. old accounts).
    role: user?.user_metadata?.role ?? profile?.role,
  };
}
