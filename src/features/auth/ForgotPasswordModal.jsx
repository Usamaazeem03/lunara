import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { notify } from "../../Shared/lib/toast.jsx";
import Icon from "../../Shared/ui/Icon";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  role = "client",
}) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);

  useEffect(() => {
    if (success) {
      notify.success(
        "Check your email for the reset link. It may take a few minutes to arrive.",
      );
    }
  }, [success]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getErrorType = (err) => {
    const message = err.message || "";
    const status = err.status;

    if (status === 429) return "rate-limit";
    if (message.includes("rate_limit")) return "rate-limit";
    if (message.includes("invalid") || message.includes("not found"))
      return "invalid-email";
    if (message.includes("network") || message.includes("fetch"))
      return "network";
    return "unknown";
  };

  const getErrorMessage = (errorType) => {
    switch (errorType) {
      case "rate-limit":
        return "We've sent too many reset emails recently. Please check your inbox and spam folder, or try again in a few minutes.";
      case "invalid-email":
        return "Email not found. Please check the address and try again.";
      case "network":
        return "Network error. Please check your connection and try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ email, role });
      setSuccess(true);
      setEmail("");
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorType = getErrorType(err);
      const message = getErrorMessage(errorType);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-ink text-lg font-semibold md:text-xl">
            Reset Password
          </h2>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink transition"
            aria-label="Close modal"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            ✅ Check your email for the reset link. It may take a few minutes to
            arrive.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <label className="text-ink/60 mb-2 block text-xs tracking-[0.2em] uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                  <Icon name="email-envelope" size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@lunara.com"
                  className="border-ink/20 text-ink placeholder:text-ink/40 focus:border-ink/60 focus:ring-ink/20 w-full rounded-xl border bg-white/90 px-4 py-2.5 pl-11 text-sm transition focus:ring-1 focus:outline-none focus:ring-inset"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-ink text-cream hover:bg-ink/90 w-full rounded-xl py-2.5 text-sm tracking-[0.3em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="border-ink/10 flex-1 border-t" />
              <span className="text-ink/40 text-xs">or</span>
              <div className="border-ink/10 flex-1 border-t" />
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="border-ink/30 text-ink hover:bg-ink/5 w-full rounded-xl border bg-white/90 py-2.5 text-sm tracking-[0.3em] uppercase transition"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
