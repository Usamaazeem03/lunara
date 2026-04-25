import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthCard from "../features/auth/AuthCard";
import AuthHeader from "../features/auth/AuthHeader";
import AuthHeroPanel from "../features/auth/AuthHeroPanel";
import AuthShell from "../features/auth/AuthShell";
import { ROLE_CONTENT, ROLE_IMAGES } from "../features/auth/authContent";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../Shared/lib/supabaseClient";
import { notify } from "../Shared/lib/toast.jsx";
import Icon from "../Shared/ui/Icon";

const VALID_ROLES = ["client", "owner"];
const INPUT_BASE =
  "w-full border border-ink/20 bg-white/90 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:ring-1 focus:ring-inset focus:ring-ink/20 focus:outline-none transition";

function EmailInput({ value, onChange, disabled }) {
  return (
    <div className="mt-4 md:mt-5">
      <label className="text-ink/60 block text-xs tracking-[0.2em] uppercase">
        Email
      </label>
      <div className="relative mt-2">
        <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
          <Icon name="email-envelope" size={18} />
        </span>
        <input
          type="email"
          value={value}
          onChange={onChange}
          placeholder="you@lunara.com"
          className={`${INPUT_BASE} h-12 rounded-xl pl-11`}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  isVisible,
  onToggleVisibility,
  placeholder,
  disabled,
}) {
  return (
    <div className="mt-4 md:mt-5">
      <label className="text-ink/60 block text-xs tracking-[0.2em] uppercase">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
          <Icon name="access-control-password" size={18} />
        </span>
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${INPUT_BASE} h-12 rounded-xl pr-11 pl-11 ${
            isVisible ? "" : "font-semibold tracking-[0.2em]"
          }`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="text-ink/40 hover:text-ink absolute top-1/2 right-4 -translate-y-1/2 transition"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          <Icon name={isVisible ? "eye" : "eye-crossed"} size={18} />
        </button>
      </div>
    </div>
  );
}

function ResetPassword() {
  const navigate = useNavigate();
  const { role: roleParam } = useParams();
  const { resetPassword } = useAuth();

  const role = VALID_ROLES.includes(roleParam) ? roleParam : "client";
  const roleLabel = role === "owner" ? "Owner" : "Client";
  const loginPath = `/auth/${role}/signin`;

  const [checkingSession, setCheckingSession] = useState(true);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);

  const [email, setEmail] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [error, setError] = useState("");

  const recoveryHint = useMemo(() => {
    const raw =
      `${window.location.hash}${window.location.search}`.toLowerCase();
    return (
      raw.includes("type=recovery") ||
      raw.includes("access_token") ||
      raw.includes("refresh_token")
    );
  }, []);

  useEffect(() => {
    if (roleParam && !VALID_ROLES.includes(roleParam)) {
      navigate("/auth/client/reset-password", { replace: true });
    }
  }, [navigate, roleParam]);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setIsRecoveryFlow(Boolean(session) && recoveryHint);
      setCheckingSession(false);
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [recoveryHint]);

  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);

  useEffect(() => {
    if (requestSuccess) {
      notify.success("Reset email sent. Please check your inbox.");
    }
  }, [requestSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      notify.success("Password reset successfully. Redirecting to login...");
    }
  }, [updateSuccess]);

  const handleBackToLogin = () => {
    navigate(loginPath, { replace: true });
  };

  const handleSendResetEmail = async (event) => {
    event.preventDefault();
    setError("");
    setRequestSuccess(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    setRequestLoading(true);

    try {
      await resetPassword({ email: trimmedEmail, role });
      setRequestSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const validateNewPassword = () => {
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleResetWithToken = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateNewPassword()) return;

    setUpdateLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setUpdateSuccess(true);

      setTimeout(() => {
        navigate(loginPath, { replace: true });
      }, 1700);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const heroContent = {
    ...ROLE_CONTENT[role],
    heroTitle: `${roleLabel} Reset Password`,
    heroBody: "Secure access to your Lunara account in a few steps.",
    steps: isRecoveryFlow
      ? ["Verify link", "Set password", "Sign in"]
      : ["Enter email", "Check inbox", "Create password"],
  };

  const headerSubhead = isRecoveryFlow
    ? "Enter and confirm your new password."
    : "Enter your account email and we will send you a reset link.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#c5ced6] px-4 py-6 md:px-10 md:py-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.65), rgba(197,206,214,0.15) 55%, rgba(197,206,214,0) 75%)",
        }}
      />
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <AuthShell>
        <AuthCard onClose={handleBackToLogin}>
          <AuthHeroPanel
            role={role}
            imageSrc={ROLE_IMAGES[role]}
            content={heroContent}
          />

          <div className="flex flex-col justify-start p-4 sm:p-6 md:justify-center md:bg-[#f7f5f0] md:p-12">
            <div className="mx-auto w-full max-w-md">
              <AuthHeader
                eyebrow={`${roleLabel} Reset Password`}
                headline="Reset Password"
                subhead={headerSubhead}
              />

              <div className="mt-6">
                {checkingSession && (
                  <div className="rounded-lg border border-black/10 bg-white/80 p-4 text-sm text-black/60">
                    Preparing reset flow...
                  </div>
                )}

                {!checkingSession && error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {!checkingSession && isRecoveryFlow && updateSuccess && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    Password reset successfully. Redirecting to login...
                  </div>
                )}

                {!checkingSession && !isRecoveryFlow && requestSuccess && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    Reset email sent. Please check your inbox.
                  </div>
                )}

                {!checkingSession && isRecoveryFlow && !updateSuccess && (
                  <form onSubmit={handleResetWithToken}>
                    <PasswordInput
                      label="New Password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      isVisible={showPassword}
                      onToggleVisibility={() =>
                        setShowPassword((prev) => !prev)
                      }
                      placeholder="Create a password"
                      disabled={updateLoading}
                    />

                    <PasswordInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setError("");
                      }}
                      isVisible={showConfirmPassword}
                      onToggleVisibility={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      placeholder="Confirm your password"
                      disabled={updateLoading}
                    />

                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="bg-ink text-cream hover:bg-ink/90 mt-6 w-full rounded-xl py-2.5 text-sm tracking-[0.3em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updateLoading ? "Resetting..." : "Reset Password"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="border-ink/30 text-ink hover:bg-ink/5 mt-3 w-full rounded-xl border bg-white/90 py-2.5 text-sm tracking-[0.3em] uppercase transition"
                    >
                      Back to Login
                    </button>
                  </form>
                )}

                {!checkingSession && !isRecoveryFlow && (
                  <form onSubmit={handleSendResetEmail}>
                    <EmailInput
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      disabled={requestLoading}
                    />

                    <button
                      type="submit"
                      disabled={requestLoading}
                      className="bg-ink text-cream hover:bg-ink/90 mt-6 w-full rounded-xl py-2.5 text-sm tracking-[0.3em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {requestLoading ? "Sending..." : "Send Email"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="border-ink/30 text-ink hover:bg-ink/5 mt-3 w-full rounded-xl border bg-white/90 py-2.5 text-sm tracking-[0.3em] uppercase transition"
                    >
                      Back to Login
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </AuthCard>
      </AuthShell>
    </div>
  );
}

export default ResetPassword;
