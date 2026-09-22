import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { changeAccountPassword } from "../../services/apiSalonSettings";
import { notify } from "../../Shared/lib/toast";
import { clientSettingsStyles } from "./clientSettingsStyles";
import PasswordInput from "../../Shared/ui/PasswordInput";

export default function AccountSecurity({ variant = "owner" }) {
  const isClient = variant === "client";
  const { user } = useAuth();
  const googleOnly =
    user?.app_metadata?.provider === "google" &&
    !user?.app_metadata?.providers?.includes("email");
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const mutation = useMutation({
    mutationFn: changeAccountPassword,
    onSuccess: () => {
      reset();
      notify.success("Password changed successfully.");
    },
    onError: (error) => notify.error(error.message),
  });
  return (
    <section
      className={
        isClient
          ? clientSettingsStyles.card
          : "border-ink/20 border-2 bg-white/90 p-4 sm:p-5"
      }
    >
      <h2 className="text-lg font-semibold">Account Security</h2>
      <p className="text-ink-muted mt-1 text-sm">
        Manage the password for your account.
      </p>
      <p className="text-ink-muted mt-3 mb-5 text-sm break-all">
        Signed in as {user?.email}
      </p>
      {googleOnly ? (
        <p
          className={`border-ink/15 bg-cream border p-4 text-sm ${isClient ? "rounded-xl leading-6" : ""}`}
        >
          You sign in with Google. Manage your password in your Google account.
        </p>
      ) : (
        <form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <fieldset disabled={mutation.isPending} className="space-y-4">
            {[
              {
                name: "currentPassword",
                label: "Current password",
                autoComplete: "current-password",
                rules: { required: "Enter your current password." },
              },
              {
                name: "password",
                label: "New password",
                autoComplete: "new-password",
                rules: {
                  required: "Enter a new password.",
                  minLength: {
                    value: 8,
                    message: "Use at least 8 characters.",
                  },
                  validate: (value) =>
                    value !== getValues("currentPassword") ||
                    "Choose a different password.",
                  deps: ["confirmPassword"],
                },
              },
              {
                name: "confirmPassword",
                label: "Confirm new password",
                autoComplete: "new-password",
                rules: {
                  required: "Confirm your new password.",
                  validate: (value) =>
                    value === getValues("password") ||
                    "Passwords do not match.",
                },
              },
            ].map(({ name, label, autoComplete, rules }) => (
              <label key={name} className="block">
                <span
                  className={
                    isClient
                      ? clientSettingsStyles.label
                      : "text-ink-muted mb-2 block text-xs tracking-widest uppercase"
                  }
                >
                  {label}
                </span>
                <PasswordInput
                  type="password"
                  autoComplete={autoComplete}
                  {...register(name, rules)}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={
                    errors[name] ? `security-${name}` : undefined
                  }
                  className={
                    isClient
                      ? `autofill-input ${clientSettingsStyles.input}`
                      : "autofill-input border-ink/20 focus:border-ink min-h-11 w-full border-2 bg-white px-3 text-sm outline-none"
                  }
                />
                {errors[name] && (
                  <span
                    id={`security-${name}`}
                    role="alert"
                    className="text-danger mt-1 block text-xs"
                  >
                    {errors[name].message}
                  </span>
                )}
              </label>
            ))}
          </fieldset>
          <p className="text-ink-muted mt-3 text-xs leading-5">
            Use at least 8 characters and a password you do not use elsewhere.
          </p>
          <button
            type="submit"
            disabled={!isValid || mutation.isPending}
            className={
              isClient
                ? `${clientSettingsStyles.primary} mt-5 w-full sm:w-auto`
                : "bg-ink mt-5 min-h-11 px-4 text-xs tracking-widest text-white uppercase disabled:opacity-40"
            }
          >
            {mutation.isPending ? "Updating..." : "Change password"}
          </button>
        </form>
      )}
    </section>
  );
}
