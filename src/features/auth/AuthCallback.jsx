import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Shared/lib/supabaseClient";
import { notify } from "../../Shared/lib/toast.jsx";

/**
 * AuthCallback
 *
 * Handles the redirect after Google OAuth (and email verification links).
 *
 * For Google sign-in it does three things:
 *   1. Waits for Supabase to exchange the OAuth code for a session.
 *   2. Reads the intended portal role from the redirect URL (?role=owner|client)
 *      with localStorage as a fallback.
 *   3. Enforces portal isolation:
 *        - New Google user  → assigns the intended role and lets them through.
 *        - Existing user    → blocks if their saved role ≠ intended portal role.
 *
 * Place this component at the route: /auth/callback
 * Example (React Router v6):
 *   <Route path="/auth/callback" element={<AuthCallback />} />
 */
function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your account…");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // ── 1. Wait for Supabase to exchange the OAuth code ──────────────────
        // onAuthStateChange will have fired by now in most cases, but
        // getSession() gives us the definitive resolved session.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          // No session means the link was invalid or expired
          setStatus("Session not found. Redirecting…");
          notify.error("Session not found. Redirecting to login.");
          setTimeout(() => navigate("/auth/client/signin"), 2000);
          return;
        }

        const userId = session.user.id;

        // ── 2. Read the intended portal role ────────────────────────────────
        // Primary source: ?role= query param embedded in the redirect URL by
        //   signInWithGoogle(). This survives the OAuth round-trip reliably.
        // Fallback: localStorage.intendedRole set in handleGoogleSignIn().
        const urlParams = new URLSearchParams(window.location.search);
        const intendedRole =
          urlParams.get("role") || localStorage.getItem("intendedRole") || null;

        // Always clean up localStorage regardless of outcome
        localStorage.removeItem("intendedRole");

        // ── 3. Portal isolation check ────────────────────────────────────────
        if (intendedRole) {
          setStatus("Checking your account permissions…");

          // Fetch their stored role from the profiles table
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

          // Also check user_metadata as a reliable secondary source
          const actualRole =
            profileData?.role ?? session.user.user_metadata?.role ?? null;

          if (!actualRole) {
            // ── New Google user: no role assigned yet ───────────────────────
            // Assign the intended role in both places so future logins work.
            setStatus("Setting up your account…");

            // Update profiles table
            await supabase
              .from("profiles")
              .update({ role: intendedRole })
              .eq("id", userId);

            // Update user_metadata so role: user_metadata.role works instantly
            await supabase.auth.updateUser({
              data: { role: intendedRole },
            });

            // All good — proceed to dashboard
            notify.success("Google account linked successfully.");
            navigate("/dashboard", { replace: true });
            return;
          }

          if (actualRole !== intendedRole) {
            // ── Existing user trying the wrong portal ───────────────────────
            // Sign them out and redirect back with a clear error message.
            await supabase.auth.signOut();

            const errorMsg = encodeURIComponent(
              `This Google account is registered as a ${actualRole}. ` +
                `Please sign in from the ${actualRole} portal.`,
            );

            notify.error(
              `This Google account is registered as a ${actualRole}. Please sign in from the ${actualRole} portal.`,
            );
            navigate(`/auth/${intendedRole}/signin?error=${errorMsg}`, {
              replace: true,
            });
            return;
          }

          // ── Existing user, correct portal — let them through ────────────
        }

        // ── All checks passed — go to dashboard ──────────────────────────────
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("Something went wrong. Redirecting…");
        notify.error(
          err?.message || "Something went wrong. Redirecting to login.",
        );
        setTimeout(() => navigate("/auth/client/signin"), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  // ── Loading UI ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        {/* Spinner */}
        <div className="border-ink/20 border-t-ink h-10 w-10 animate-spin rounded-full border-4" />
        <p className="text-ink/60 text-sm tracking-[0.15em] uppercase">
          {status}
        </p>
      </div>
    </div>
  );
}

export default AuthCallback;
