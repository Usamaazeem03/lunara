import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import ButtonSpinner from "../../Shared/ui/ButtonSpinner";
import i18n from "../../i18n/i18n.js";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import { useClientInformation } from "./useClientInformation";
import { internationalPhoneRules } from "../../Shared/lib/phoneValidation";
import { clientSettingsStyles as styles } from "./clientSettingsStyles";

const fields = [
  {
    name: "full_name",
    labelKey: "common.fullName",
    type: "text",
    autoComplete: "name",
    maxLength: 120,
  },
  {
    name: "phone",
    labelKey: "clients.contactPhone",
    type: "tel",
    autoComplete: "tel",
    placeholder: "+44 1234 567890",
  },
  {
    name: "email",
    labelKey: "clients.contactEmail",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
      i18n.t("common.enterAValidEmailAddress"),
  },
];

function ClientInformationForm({ client, save }) {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: Object.fromEntries(
      translateConfig(fields).map(({ name }) => [name, client[name] || ""]),
    ),
  });
  return (
    <form
      onSubmit={handleSubmit((values) =>
        save.mutate(values, {
          onSuccess: (data) =>
            reset(
              Object.fromEntries(
                translateConfig(fields).map(({ name }) => [name, data[name] || ""]),
              ),
            ),
        }),
      )}
      noValidate
    >
      <fieldset disabled={save.isPending} className="grid gap-5 sm:grid-cols-2">
        {translateConfig(fields).map(({ name, label, validate, ...input }) => (
          <label
            key={name}
            className={name === "full_name" ? "sm:col-span-2" : ""}
          >
            <span className={styles.label}>
              {label} <span aria-hidden="true">*</span>
            </span>
            <input
              {...input}
              {...register(
                name,
                name === "phone"
                  ? internationalPhoneRules(setValue)
                  : {
                      required: t("common.isRequired", { value1: label }),
                      validate:
                        validate ||
                        ((value) =>
                          Boolean(value.trim()) || t("common.isRequired", { value1: label })),
                    },
              )}
              aria-required="true"
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name] ? `client-${name}-error` : undefined
              }
              className={styles.input}
            />
            {errors[name] && (
              <span
                id={`client-${name}-error`}
                role="alert"
                className="text-danger mt-1 block text-xs"
              >
                {errors[name].message}
              </span>
            )}
          </label>
        ))}
      </fieldset>
      <p className="text-ink-muted mt-4 text-xs leading-5"> {t("clients.thisIsYourContactEmailYourSignInEmailStays")} </p>
      <div className="border-ink/10 mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-ink-muted text-xs" aria-live="polite">
          {isDirty ? t("clients.unsavedChanges") : t("clients.allChangesSaved")}
        </span>
        <div className="grid grid-cols-[auto_1fr] gap-2 sm:flex">
          <button
            type="button"
            disabled={!isDirty || save.isPending}
            onClick={() => reset()}
            className={styles.secondary}
          > {t("clients.reset")} </button>
          <button
            type="submit"
            disabled={!isDirty || !isValid || save.isPending}
            aria-busy={save.isPending}
            className={styles.primary}
          >
            {save.isPending ? <span className="inline-flex items-center gap-2"><ButtonSpinner />{t("common.saving")}</span> : t("clients.saveInformation")}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ClientInformation() {
  const { t } = useTranslation();
  const { data, isPending, error, refetch, save } = useClientInformation();
  return (
    <section className={styles.card}>
      <h2 className="text-lg font-semibold">{t("clients.personalInformation")}</h2>
      <p className="text-ink-muted mt-1 mb-6 text-sm leading-6"> {t("clients.keepYourNameAndContactDetailsUpToDate")} </p>
      {isPending ? (
        <p role="status">{t("clients.loadingYourInformation")}</p>
      ) : error ? (
        <div role="alert">
          <p>{t("clients.yourInformationCouldNotBeLoaded")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className={`${styles.secondary} mt-3`}
          > {t("common.tryAgain")} </button>
        </div>
      ) : (
        <ClientInformationForm key={data.id} client={data} save={save} />
      )}
    </section>
  );
}
