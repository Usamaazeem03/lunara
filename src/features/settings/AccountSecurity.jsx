import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { changeAccountPassword } from "../../services/apiSalonSettings";
import { notify } from "../../Shared/lib/toast";
import { clientSettingsStyles } from "./clientSettingsStyles";
import PasswordInput from "../../Shared/ui/PasswordInput";
import ButtonSpinner from "../../Shared/ui/ButtonSpinner";

export default function AccountSecurity({ variant = "owner" }) {
  const { t } = useTranslation();
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
      notify.success(translatedMessage("settings.passwordChangedSuccessfully"));
    },
    onError: (error) => notify.error(error.message),
  });
  return (
    <section
      className={
        isClient
          ? clientSettingsStyles.card
          : "border-ink/20 rounded-none border-2 bg-white/90 p-4 sm:p-5"
      }
    >
      <h2 className="text-lg font-semibold">{t("settings.accountSecurity")}</h2>
      <p className="text-ink-muted mt-1 text-sm"> {t("settings.manageThePasswordForYourAccount")} </p>
      <p className="text-ink-muted mt-3 mb-5 text-sm break-all"> {t("settings.signedInAs")} {user?.email}
      </p>
      {googleOnly ? (
        <p
          className={`border-ink/15 bg-cream border p-4 text-sm ${isClient ? "rounded-xl leading-6" : ""}`}
        > {t("settings.youSignInWithGoogleManageYourPasswordInYour")} </p>
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
                label: t("settings.currentPassword"),
                autoComplete: "current-password",
                rules: { required: t("settings.enterYourCurrentPassword") },
              },
              {
                name: "password",
                label: t("auth.newPassword"),
                autoComplete: "new-password",
                rules: {
                  required: t("settings.enterANewPassword"),
                  minLength: {
                    value: 8,
                    message: t("auth.useAtLeast8Characters"),
                  },
                  validate: (value) =>
                    value !== getValues("currentPassword") ||
                    t("settings.chooseADifferentPassword"),
                  deps: ["confirmPassword"],
                },
              },
              {
                name: "confirmPassword",
                label: t("settings.confirmNewPassword"),
                autoComplete: "new-password",
                rules: {
                  required: t("settings.confirmYourNewPassword"),
                  validate: (value) =>
                    value === getValues("password") ||
                    t("auth.passwordsDoNotMatch"),
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
          <p className="text-ink-muted mt-3 text-xs leading-5"> {t("settings.useAtLeast8CharactersAndAPasswordYouDo")} </p>
          <button
            type="submit"
            disabled={!isValid || mutation.isPending}
            aria-busy={mutation.isPending}
            className={
              isClient
                ? `${clientSettingsStyles.primary} mt-5 w-full sm:w-auto`
                : "bg-ink mt-5 min-h-11 px-4 text-xs tracking-widest text-white uppercase disabled:opacity-40"
            }
          >
            {mutation.isPending ? <span className="inline-flex items-center gap-2"><ButtonSpinner />{t("settings.updating")}</span> : t("settings.changePassword")}
          </button>
        </form>
      )}
    </section>
  );
}
