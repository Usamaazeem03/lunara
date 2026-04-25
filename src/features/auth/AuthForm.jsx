import { forwardRef, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../../Shared/ui/Icon";
import {
  getSavedAccounts,
  saveAccount,
  removeSavedAccount,
} from "../../utils/deviceMemory";
import { generateSlugFromName } from "../../utils/slugGenerator";
import { supabase } from "../../Shared/lib/supabaseClient";
import { notify } from "../../Shared/lib/toast.jsx";

const INPUT_BASE =
  "w-full border border-ink/20 bg-white/90 px-4 py-2.5 md:py-3 text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:ring-1 focus:ring-inset focus:ring-ink/20 focus:outline-none transition";

// ─── Timeout helper ────────────────────────────────────────────────────────────
const withTimeout = (promise, ms = 12000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Request timed out. Check your connection and try again.",
            ),
          ),
        ms,
      ),
    ),
  ]);

const PhoneTextInput = forwardRef(function PhoneTextInput(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className="w-full bg-transparent focus:shadow-none focus:ring-0 focus:outline-none"
    />
  );
});
PhoneTextInput.displayName = "PhoneTextInput";

function AuthForm({ role, mode, onModeChange }) {
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // Track if the component is still mounted to avoid state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isSignup = mode === "signup";
  const fieldSpacing = isSignup ? "mt-4 md:mt-5" : "";

  useEffect(() => {
    if (!isSignup) {
      setSavedAccounts(getSavedAccounts(role));
    } else {
      setSavedAccounts([]);
    }
  }, [isSignup, role]);

  useEffect(() => {
    if (!error) return;

    if (error.toLowerCase().includes("account created!")) {
      notify.success(error.replace(/^[^A-Za-z0-9]+/, "").trim());
      return;
    }

    notify.error(error);
  }, [error]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleQuickLogin = async (savedAccount) => {
    setLoading(true);
    setError("");
    try {
      await withTimeout(
        signIn({
          email: savedAccount.email,
          password: savedAccount.password,
          expectedRole: role,
          rememberMe: true,
        }),
      );
      // navigate("/dashboard", { replace: true });
      const savedOwnerId = localStorage.getItem("owner_id");
      const destination = savedOwnerId
        ? `/dashboard?owner_id=${savedOwnerId}`
        : "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      if (isMounted.current) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const handleRemoveSavedAccount = (email, e) => {
    e.stopPropagation();
    removeSavedAccount(email, role);
    setSavedAccounts((prev) => prev.filter((acc) => acc.email !== email));
  };

  const handleSubmit = async () => {
    // ── Client-side validation first (no network needed) ──────────────────────
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    if (isSignup && !formData.fullName) {
      setError("Full name is required");
      return;
    }
    if (isSignup && formData.phone && !isValidPhoneNumber(formData.phone)) {
      setError("Invalid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        // ── SIGN UP ────────────────────────────────────────────────────────────
        await withTimeout(
          signUp({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
            role: role,
          }),
          15000,
        );

        // Get user — short timeout, usually instant after signUp
        const {
          data: { user },
        } = await withTimeout(supabase.auth.getUser(), 5000);

        if (!user?.id)
          throw new Error("Failed to retrieve user ID after signup");

        const profileUpdates = {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: role,
        };
        if (role === "owner") {
          profileUpdates.salon_slug = generateSlugFromName(formData.fullName);
        }

        // ✅ FIX: Await the profile update instead of fire-and-forget.
        // If the DB trigger creates the row with a default role (e.g. "client"),
        // this ensures the correct role is always written before we proceed.
        try {
          await withTimeout(updateProfile(user.id, profileUpdates), 8000);
        } catch (profileErr) {
          // Non-fatal — user account is created, but log the failure clearly
          console.warn("Profile update failed during signup:", profileErr);
        }

        if (isMounted.current) {
          setLoading(false); // ✅ FIX: reset loading so login button shows correctly
          setError(
            "✅ Account created! Please check your email to verify, then log in.",
          );
          setTimeout(() => {
            if (isMounted.current) onModeChange("login");
          }, 2000);
        }
      } else {
        // ── SIGN IN ────────────────────────────────────────────────────────────
        await withTimeout(
          signIn({
            email: formData.email,
            password: formData.password,
            expectedRole: role,
            rememberMe: rememberMe,
          }),
        );

        // Save account synchronously (localStorage — instant)
        if (rememberMe) {
          saveAccount(formData.email, formData.password, role);
        }

        // Navigate immediately — don't wait for anything else
        // navigate("/dashboard", { replace: true });
        const savedOwnerId = localStorage.getItem("owner_id");
        const destination = savedOwnerId
          ? `/dashboard?owner_id=${savedOwnerId}`
          : "/dashboard";
        navigate(destination, { replace: true });
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // ✅ FIX: Pass the current portal's role to signInWithGoogle.
      // It gets embedded in the OAuth redirect URL so the callback page
      // can validate portal isolation (owner vs client).
      localStorage.setItem("intendedRole", role); // backup fallback
      await signInWithGoogle(role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-4 max-h-[52vh] overflow-y-auto pr-1 sm:max-h-[58vh] md:mt-8 md:max-h-[50vh] md:pr-3">
      {/* Error/Success Message */}
      {error && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm ${
            error.includes("✅")
              ? "border border-green-200 bg-green-100 text-green-700"
              : "border border-red-200 bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      {/* Full Name - Signup only */}
      {isSignup && (
        <AuthTextField
          label="Full name"
          iconName="user-profile"
          type="text"
          placeholder="Full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          className={fieldSpacing}
        />
      )}

      {/* Email */}
      <AuthTextField
        label="Email"
        iconName="email-envelope"
        type="email"
        placeholder="you@lunara.com"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        className={fieldSpacing}
      />

      {/* Phone - Signup only */}
      {isSignup && (
        <PhoneNumberField
          value={formData.phone}
          onChange={(val) => handleInputChange("phone", val || "")}
        />
      )}

      {/* Password */}
      <PasswordField
        value={formData.password}
        onChange={(val) => handleInputChange("password", val)}
        isSignup={isSignup}
      />

      {/* Remember me - Login only */}
      {!isSignup && (
        <RememberRow
          checked={rememberMe}
          onChange={setRememberMe}
          onForgotPasswordClick={() => navigate(`/auth/${role}/reset-password`)}
        />
      )}

      {/* Submit Button */}
      <PrimaryButton
        label={
          loading ? "Please wait..." : isSignup ? "Create Account" : "Log in"
        }
        onClick={handleSubmit}
        disabled={loading}
      />

      {/* Saved Accounts - Login only */}
      {!isSignup && savedAccounts.length > 0 && (
        <SavedAccountsList
          accounts={savedAccounts}
          onSelectAccount={handleQuickLogin}
          onRemoveAccount={handleRemoveSavedAccount}
          loading={loading}
        />
      )}

      {/* Mode Switch */}
      <ModeSwitch isSignup={isSignup} onModeChange={onModeChange} />

      {/* Google Button */}
      <GoogleButton onClick={handleGoogleSignIn} disabled={loading} />
    </div>
  );
}

// ============== SUB-COMPONENTS ==============

function AuthTextField({
  label,
  iconName,
  type = "text",
  placeholder,
  className,
  value,
  onChange,
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative mt-2">
        <InputIcon name={iconName} />
        <input
          type={type}
          placeholder={placeholder}
          className={`${INPUT_BASE} rounded-xl pl-11`}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="text-ink/60 text-xs tracking-[0.2em] uppercase">
      {children}
    </label>
  );
}

function InputIcon({ name }) {
  return (
    <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
      <Icon name={name} size={18} />
    </span>
  );
}

function PhoneNumberField({ value, onChange }) {
  const isInvalid = value && !isValidPhoneNumber(value);
  return (
    <div className="mt-4 md:mt-5">
      <FieldLabel>Phone Number</FieldLabel>
      <PhoneInput
        placeholder="Enter phone number"
        international
        defaultCountry={undefined}
        countryCallingCodeEditable={true}
        value={value}
        onChange={onChange}
        inputComponent={PhoneTextInput}
        className={`mt-2 w-full overflow-hidden rounded-xl border bg-white/90 px-4 py-2.5 md:py-3 ${
          isInvalid ? "border-red-500" : "border-ink/20"
        } focus-within:border-ink/20 focus-within:ring-ink/60 focus-within:ring-1 focus-within:ring-inset`}
      />
      {isInvalid && (
        <p className="mt-1 text-xs text-red-500">
          Invalid phone number for this country
        </p>
      )}
    </div>
  );
}

function PasswordField({ value, onChange, isSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mt-4 md:mt-5">
      <FieldLabel>Password</FieldLabel>
      <div className="relative mt-2">
        <InputIcon name="access-control-password" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={isSignup ? "Create a password" : "Enter your password"}
          className={`${INPUT_BASE} h-12 rounded-xl pr-11 pl-11 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal md:h-12 ${
            showPassword ? "" : "font-semibold tracking-[0.2em]"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-ink/40 hover:text-ink absolute top-1/2 right-4 -translate-y-1/2 transition focus:outline-none"
          >
            <Icon name={showPassword ? "eye" : "eye-crossed"} size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function RememberRow({ checked, onChange, onForgotPasswordClick }) {
  return (
    <div className="text-ink/50 mt-3 flex items-center justify-between text-xs tracking-[0.2em] uppercase md:mt-4">
      <label className="flex cursor-pointer items-center gap-2 normal-case">
        <input
          type="checkbox"
          className="accent-ink h-4 w-4 cursor-pointer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        Remember me
      </label>
      <button
        type="button"
        onClick={onForgotPasswordClick}
        className="text-ink/70 decoration-ink/30 hover:text-ink underline"
      >
        Forgot password?
      </button>
    </div>
  );
}

function PrimaryButton({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className="bg-ink text-cream hover:bg-ink/90 mt-5 w-full py-2.5 text-sm tracking-[0.3em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50 md:mt-7 md:py-3"
    >
      {label}
    </button>
  );
}

function ModeSwitch({ isSignup, onModeChange }) {
  return (
    <p className="text-ink/60 mt-3 text-center text-sm md:mt-4">
      {isSignup ? "Already have an account?" : "New to Lunara?"}{" "}
      <button
        type="button"
        onClick={() => onModeChange(isSignup ? "login" : "signup")}
        className="text-ink hover:text-ink/80 cursor-pointer underline"
      >
        {isSignup ? "Log in" : "Create account"}
      </button>
    </p>
  );
}

function GoogleButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border-ink/30 text-ink hover:bg-ink hover:text-cream mt-4 mb-6 flex w-full items-center justify-center gap-3 border bg-white/90 py-2.5 text-sm font-semibold transition disabled:opacity-50 md:mt-6 md:mb-2 md:py-3"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="h-5 w-5"
      />
      Continue with Google
    </button>
  );
}

function SavedAccountsList({
  accounts,
  onSelectAccount,
  onRemoveAccount,
  loading,
}) {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-ink/50 text-xs tracking-[0.2em] uppercase">
        Other accounts:
      </p>
      {accounts.map((account) => (
        <button
          key={account.email}
          type="button"
          onClick={() => onSelectAccount(account)}
          disabled={loading}
          className="group border-ink/20 hover:border-ink/40 relative w-full rounded-lg border bg-white/60 px-4 py-3 text-left transition hover:bg-white disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <span className="text-ink flex-1 truncate text-sm">
              {account.email}
            </span>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onRemoveAccount(account.email, e);
              }}
              className="text-ink/40 hover:text-ink/80 ml-2 shrink-0 cursor-pointer opacity-0 transition group-hover:opacity-100"
              title="Remove this account"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRemoveAccount(account.email, e);
                }
              }}
            >
              <Icon name="close" size={16} />
            </div>
          </div>
          <p className="text-ink/40 mt-1 text-xs">Click to sign in</p>
        </button>
      ))}
    </div>
  );
}

export default AuthForm;
