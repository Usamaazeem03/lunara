import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";
import { emailRules, newPasswordRules } from "./authValidation";
import { usePasswordRecovery } from "./usePasswordRecovery";

export function RequestResetForm({ request }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });
  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => {
        if (!request.isPending) request.mutate(values);
      })}
    >
      {request.isSuccess && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          If this email has an account, a reset link has been sent. Check your
          inbox.
        </p>
      )}
      {request.error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {request.error.message}
        </p>
      )}
      <AuthField
        label="Email"
        type="email"
        placeholder="you@lunara.com"
        iconName="email-envelope"
        autoComplete="email"
        registration={register("email", emailRules)}
        error={errors.email}
        disabled={request.isPending}
      />
      <AuthSubmitButton pending={request.isPending}>
        Send reset link
      </AuthSubmitButton>
    </form>
  );
}

function NewPasswordForm({ update }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { password: "", confirmPassword: "" } });
  return (
    <form
      noValidate
      onSubmit={handleSubmit(({ password }) => {
        if (!update.isPending) update.mutate({ password });
      })}
    >
      {update.error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {update.error.message}
        </p>
      )}
      <AuthField
        label="New password"
        type="password"
        iconName="access-control-password"
        autoComplete="new-password"
        registration={register("password", {
          ...newPasswordRules,
          deps: ["confirmPassword"],
        })}
        error={errors.password}
        disabled={update.isPending}
      />
      <AuthField
        label="Confirm password"
        type="password"
        iconName="access-control-password"
        autoComplete="new-password"
        registration={register("confirmPassword", {
          required: "Confirm your password.",
          validate: (value) =>
            value === getValues("password") || "Passwords do not match.",
        })}
        error={errors.confirmPassword}
        disabled={update.isPending}
      />
      <AuthSubmitButton pending={update.isPending}>
        Reset password
      </AuthSubmitButton>
    </form>
  );
}

export default function PasswordRecoveryForm({ role, onBackToLogin }) {
  const { loading, isRecoverySession, user } = useAuth();
  const { request, update } = usePasswordRecovery(role);
  return (
    <div className="auth-recovery mt-4">
      {update.isSuccess ? (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          Password updated. Sign in with your new password.
        </p>
      ) : loading ? (
        <p role="status">Preparing password recovery...</p>
      ) : isRecoverySession && user ? (
        <NewPasswordForm update={update} />
      ) : (
        <RequestResetForm request={request} />
      )}
      <button
        type="button"
        disabled={request.isPending || update.isPending}
        onClick={onBackToLogin}
        className="border-ink/30 text-ink hover:bg-ink/5 mt-3 w-full border bg-white/90 py-3 text-sm tracking-[0.3em] uppercase disabled:opacity-50"
      >
        Back to login
      </button>
    </div>
  );
}
