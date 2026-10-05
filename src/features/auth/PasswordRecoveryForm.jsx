import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import { useAuth } from "../../hooks/useAuth";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";
import { emailRules, newPasswordRules } from "./authValidation";
import { usePasswordRecovery } from "./usePasswordRecovery";

export function RequestResetForm({ request }) {
  const { t } = useTranslation();
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
        > {t("auth.ifThisEmailHasAnAccountAResetLinkHas")} </p>
      )}
      {request.error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {request.error.message}
        </p>
      )}
      <AuthField
        label={t("common.email")}
        type="email"
        placeholder="you@lunara.com"
        iconName="email-envelope"
        autoComplete="email"
        registration={register("email", translateConfig(emailRules))}
        error={errors.email}
        disabled={request.isPending}
      />
      <AuthSubmitButton pending={request.isPending}> {t("auth.sendResetLink")} </AuthSubmitButton>
    </form>
  );
}

function NewPasswordForm({ update }) {
  const { t } = useTranslation();
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
        label={t("auth.newPassword")}
        type="password"
        iconName="access-control-password"
        autoComplete="new-password"
        registration={register("password", {
          ...translateConfig(newPasswordRules),
          deps: ["confirmPassword"],
        })}
        error={errors.password}
        disabled={update.isPending}
      />
      <AuthField
        label={t("auth.confirmPassword")}
        type="password"
        iconName="access-control-password"
        autoComplete="new-password"
        registration={register("confirmPassword", {
          required: t("auth.confirmYourPassword"),
          validate: (value) =>
            value === getValues("password") || t("auth.passwordsDoNotMatch"),
        })}
        error={errors.confirmPassword}
        disabled={update.isPending}
      />
      <AuthSubmitButton pending={update.isPending}> {t("auth.resetPassword2")} </AuthSubmitButton>
    </form>
  );
}

export default function PasswordRecoveryForm({ role, onBackToLogin }) {
  const { t } = useTranslation();
  const { loading, isRecoverySession, user } = useAuth();
  const { request, update } = usePasswordRecovery(role);
  return (
    <div className="auth-recovery mt-4">
      {update.isSuccess ? (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        > {t("auth.passwordUpdatedSignInWithYourNewPassword")} </p>
      ) : loading ? (
        <p role="status">{t("auth.preparingPasswordRecovery")}</p>
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
      > {t("auth.backToLogin")} </button>
    </div>
  );
}
