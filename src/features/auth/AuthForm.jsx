import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import { useNavigate } from "react-router-dom";
import Icon from "../../Shared/ui/Icon";
import { internationalPhoneRules } from "../../Shared/lib/phoneValidation";
import AuthField from "./AuthField";
import AuthSubmitButton from "./AuthSubmitButton";
import { useAuthForm } from "./useAuthForm";
import { emailRules, newPasswordRules } from "./authValidation";
import { getSavedAccounts, removeSavedAccount } from "../../utils/deviceMemory";

export default function AuthForm({ role, mode, onModeChange }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const { submit, google, savedAccount, pending, error } = useAuthForm({
    role,
    isSignup,
    onModeChange,
  });
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      rememberMe: false,
    },
  });
  const [accounts, setAccounts] = useState(() => getSavedAccounts(role));
  return (
    <div className="auth-form mt-4 max-h-[52vh] overflow-y-auto pr-1 sm:max-h-[58vh] md:mt-8 md:max-h-[50vh] md:pr-3">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error.message}
        </p>
      )}
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit((values) => {
          if (!pending) {
            savedAccount.reset();
            google.reset();
            submit.mutate(values);
          }
        })}
      >
        <fieldset disabled={pending}>
          {isSignup && (
            <AuthField
              label={t("common.fullName")}
              placeholder={t("auth.enterYourFullName")}
              required
              iconName="user-profile"
              autoComplete="name"
              registration={register("fullName", {
                required: t("common.fullNameIsRequired"),
                validate: (value) =>
                  Boolean(value.trim()) || t("common.fullNameIsRequired"),
              })}
              error={errors.fullName}
            />
          )}
          <AuthField
            label={t("common.email")}
            required
            iconName="email-envelope"
            type="email"
            autoComplete="username"
            placeholder="you@lunara.com"
            registration={register("email", translateConfig(emailRules))}
            error={errors.email}
          />
          {isSignup && (
            <AuthField
              label={t("common.phoneNumber")}
              iconName="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+44 1234 567890"
              required
              registration={register(
                "phone",
                internationalPhoneRules(setValue),
              )}
              error={errors.phone}
            />
          )}
          <AuthField
            label={t("auth.password")}
            placeholder={isSignup ? t("auth.createAPassword") : t("auth.enterYourPassword")}
            required
            type="password"
            iconName="access-control-password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            registration={register(
              "password",
              isSignup
                ? translateConfig(newPasswordRules)
                : { required: t("auth.passwordIsRequired") },
            )}
            error={errors.password}
          />
          {!isSignup && (
            <div className="auth-options text-ink/60 mt-4 flex items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("rememberMe")} /> {t("auth.rememberAccount")} </label>
              <button
                type="button"
                className="underline"
                onClick={() => navigate(`/auth/${role}/reset-password`)}
              > {t("auth.forgotPassword")} </button>
            </div>
          )}
          <AuthSubmitButton pending={pending}>
            {isSignup ? t("auth.createAccount2") : t("common.logIn")}
          </AuthSubmitButton>
        </fieldset>
      </form>
      {!isSignup && accounts.length > 0 && (
        <div className="auth-saved-accounts mt-4 space-y-2">
          <p className="text-ink/50 text-xs">{t("auth.savedAccounts")}</p>
          {accounts.map((account) => (
            <div
              key={account.email}
              className="border-ink/20 flex rounded-lg border bg-white/60"
            >
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  submit.reset();
                  google.reset();
                  savedAccount.mutate(account, {
                    onError: () => {
                      setValue("email", account.email);
                      setValue("password", "");
                      setValue("rememberMe", true);
                      requestAnimationFrame(() => setFocus("password"));
                    },
                  });
                }}
                className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm"
              >
                <span className="block truncate">{account.email}</span>
                <span className="text-ink/50 mt-1 block text-xs">
                  {savedAccount.isPending &&
                  savedAccount.variables?.email === account.email
                    ? t("auth.openingAccount")
                    : t("auth.clickToOpenAccount")}
                </span>
              </button>
              <button
                type="button"
                disabled={pending}
                aria-label={t("auth.remove", { value1: account.email })}
                onClick={() => {
                  removeSavedAccount(account.email, role);
                  setAccounts(getSavedAccounts(role));
                }}
                className="px-3 text-xs underline"
              > {t("auth.remove2")} </button>
            </div>
          ))}
        </div>
      )}
      <p className="auth-signup text-ink/60 mt-4 text-center text-sm">
        {isSignup ? t("auth.alreadyHaveAnAccount") : t("auth.newToLunara")}{" "}
        <button
          type="button"
          disabled={pending}
          onClick={() => onModeChange(isSignup ? "login" : "signup")}
          className="text-ink underline"
        >
          {isSignup ? t("common.logIn") : t("auth.createAccount2")}
        </button>
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => google.mutate()}
        className="border-ink/30 text-ink hover:bg-ink hover:text-cream mt-4 mb-2 flex w-full items-center justify-center gap-3 border bg-white/90 py-3 text-sm font-semibold disabled:opacity-50"
      >
        <Icon name="google" size={20} aria-hidden="true" />
        {google.isPending ? t("auth.connecting") : t("auth.continueWithGoogle")}
      </button>
    </div>
  );
}
