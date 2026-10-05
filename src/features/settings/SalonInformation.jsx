import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import ButtonSpinner from "../../Shared/ui/ButtonSpinner";
import i18n from "../../i18n/i18n.js";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import { useSalonInformation } from "./useSalonInformation";
import { internationalPhoneRules } from "../../Shared/lib/phoneValidation";

const fields = [
  {
    name: "full_name",
    labelKey: "settings.salonName",
    type: "text",
    autoComplete: "organization",
    maxLength: 120,
  },
  {
    name: "address",
    labelKey: "settings.salonAddress",
    type: "text",
    autoComplete: "street-address",
    maxLength: 300,
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

function SalonInformationForm({ salon, save }) {
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
      translateConfig(fields).map(({ name }) => [name, salon[name] || ""]),
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
            className={
              name === "address" || name === "full_name" ? "sm:col-span-2" : ""
            }
          >
            <span className="text-ink-muted mb-2 block text-xs tracking-widest uppercase">
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
                errors[name] ? `salon-${name}-error` : undefined
              }
              className="border-ink/20 focus:border-ink min-h-11 w-full border-2 bg-white px-3 text-sm outline-none disabled:opacity-50"
            />
            {errors[name] && (
              <span
                id={`salon-${name}-error`}
                role="alert"
                className="text-danger mt-1 block text-xs"
              >
                {errors[name].message}
              </span>
            )}
          </label>
        ))}
      </fieldset>
      <p className="text-ink-muted mt-4 text-xs"> {t("settings.contactEmailIsShownToClientsYourSignInEmail")} </p>
      <div className="border-ink/10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <span className="text-ink-muted text-xs" aria-live="polite">
          {isDirty ? t("clients.unsavedChanges") : t("clients.allChangesSaved")}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!isDirty || save.isPending}
            onClick={() => reset()}
            className="border-ink/20 min-h-11 border-2 px-4 text-xs tracking-widest uppercase disabled:opacity-40"
          > {t("clients.reset")} </button>
          <button
            type="submit"
            disabled={!isDirty || !isValid || save.isPending}
            aria-busy={save.isPending}
            className="bg-ink min-h-11 px-4 text-xs tracking-widest text-white uppercase disabled:opacity-40"
          >
            {save.isPending ? <span className="inline-flex items-center gap-2"><ButtonSpinner />{t("common.saving")}</span> : t("settings.saveSalon")}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function SalonInformation() {
  const { t } = useTranslation();
  const { data, isPending, error, refetch, save } = useSalonInformation();
  return (
    <section className="border-ink/20 rounded-none border-2 bg-white/90 p-4 sm:p-5">
      <h2 className="text-lg font-semibold">{t("settings.salonInformation")}</h2>
      <p className="text-ink-muted mt-1 mb-6 text-sm"> {t("settings.keepYourSalonNameLocationAndClientContactDetailsUp")} </p>
      {isPending ? (
        <p role="status">{t("settings.loadingSalonInformation")}</p>
      ) : error ? (
        <div role="alert">
          <p>{t("settings.salonInformationCouldNotBeLoaded")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 underline"
          > {t("common.tryAgain")} </button>
        </div>
      ) : (
        <SalonInformationForm key={data.id} salon={data} save={save} />
      )}
    </section>
  );
}
