import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../Shared/lib/supabaseClient";
import { notify } from "../../Shared/lib/toast.jsx";
import Icon from "../../Shared/ui/Icon";
import AuthHeader from "./AuthHeader";
import AuthRoleToggle from "./AuthRoleToggle";

const INPUT_BASE =
  "w-full border border-ink/20 bg-white/90 px-4 py-2.5 md:py-3 text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:ring-1 focus:ring-inset focus:ring-ink/20 focus:outline-none transition";

const MAIN_PANEL_CLASSES = [
  "flex flex-col justify-start",
  "md:justify-center",
  "p-4 sm:p-6",
  "md:p-12 md:bg-[#f7f5f0]",
].join(" ");

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  disabled,
}) {
  return (
    <div className="mt-4 md:mt-5">
      <label className="text-ink/60 text-xs tracking-[0.2em] uppercase">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
          <Icon name="access-control-password" size={18} />
        </span>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${INPUT_BASE} h-12 rounded-xl pr-11 pl-11 ${
            visible ? "" : "font-semibold tracking-[0.2em]"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-ink/40 hover:text-ink absolute top-1/2 right-4 -translate-y-1/2 transition"
        >
          <Icon name={visible ? "eye" : "eye-crossed"} size={18} />
        </button>
      </div>
    </div>
  );
}

function AuthResetPanel({ role, roleOptions, onRoleChange, onBackToLogin }) {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

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

  const handleResetWithToken = async (event) => {
    event.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setUpdateLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setUpdateSuccess(true);
      setTimeout(() => {
        navigate(`/auth/${role}/signin`, { replace: true });
      }, 1700);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className={MAIN_PANEL_CLASSES}>
      <div className="mx-auto w-full max-w-md">
        <AuthHeader
          eyebrow={`${capitalize(role)} Reset Password`}
          headline="Reset Password"
          subhead={
            isRecoveryFlow
              ? "Enter and confirm your new password."
              : "Enter your email to receive a password reset link."
          }
        />

        <AuthRoleToggle
          value={role}
          options={roleOptions}
          onChange={onRoleChange}
        />

        <div className="mt-4">
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
              <PasswordField
                label="New Password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                placeholder="Create a password"
                disabled={updateLoading}
              />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
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
                onClick={onBackToLogin}
                className="border-ink/30 text-ink hover:bg-ink/5 mt-3 w-full rounded-xl border bg-white/90 py-2.5 text-sm tracking-[0.3em] uppercase transition"
              >
                Back to Login
              </button>
            </form>
          )}

          {!checkingSession && !isRecoveryFlow && (
            <form onSubmit={handleSendResetEmail}>
              <div className="mt-4 md:mt-5">
                <label className="text-ink/60 text-xs tracking-[0.2em] uppercase">
                  Email
                </label>
                <div className="relative mt-2">
                  <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                    <Icon name="email-envelope" size={18} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="you@lunara.com"
                    disabled={requestLoading}
                    className={`${INPUT_BASE} h-12 rounded-xl pl-11`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestLoading}
                className="bg-ink text-cream hover:bg-ink/90 mt-5 w-full py-2.5 text-sm tracking-[0.3em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50 md:mt-7 md:py-3"
              >
                {requestLoading ? "Sending..." : "Send Email"}
              </button>

              <div className="my-3 flex items-center">
                <div className="border-ink/30 flex-grow border-t"></div>
                <span className="text-ink/50 mx-2 text-xs tracking-[0.2em] uppercase">
                  OR
                </span>
                <div className="border-ink/30 flex-grow border-t"></div>
              </div>

              <button
                type="button"
                onClick={onBackToLogin}
                className="border-ink/30 text-ink hover:bg-ink/5 mt-3 w-full border bg-white/90 py-2.5 text-sm tracking-[0.3em] uppercase transition"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthResetPanel;
