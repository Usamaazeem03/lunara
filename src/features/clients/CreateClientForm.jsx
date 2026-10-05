import { useTranslation } from "react-i18next";
import { internationalPhoneRules } from "../../Shared/lib/phoneValidation";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import Button from "../../Shared/Button";
import useCreateClient from "./useCreateClient";

export default function CreateClientForm({ ownerId, onCloseForm }) {
  const { t } = useTranslation();
  const { createClient, isCreating, error } = useCreateClient(ownerId);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: { full_name: "", phone: "", email: "" },
  });

  function onSubmit(values) {
    if (isCreating) return;
    createClient(values, { onSuccess: onCloseForm });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-form-title"
      className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-2xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]"
    >
      <div className="bg-ink h-1 w-full" />
      <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
        <h2 id="client-form-title" className="text-ink text-base font-semibold"> {t("clients.addNewClient")} </h2>
        <button
          type="button"
          onClick={onCloseForm}
          disabled={isCreating}
          aria-label={t("common.close")}
          className="border-ink/20 h-8 w-8 border-2"
        >
          X
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-5"
        noValidate
      >
        <fieldset disabled={isCreating} className="grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "full_name",
              label: t("clients.fullName"),
              type: "text",
              placeholder: t("clients.eGEmilyParker"),
              rules: {
                validate: (value) =>
                  Boolean(value.trim()) || t("common.fullNameIsRequired"),
              },
            },
            {
              name: "phone",
              label: t("clients.phone"),
              type: "tel",
              placeholder: "+44 1234 567890",
              rules: internationalPhoneRules(setValue),
            },
            {
              name: "email",
              label: t("clients.email"),
              type: "email",
              placeholder: "client@email.com",
              rules: {
                validate: (value) =>
                  !value.trim()
                    ? t("auth.emailIsRequired")
                    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
                      t("common.enterAValidEmailAddress"),
              },
            },
          ].map(({ name, label, type, placeholder, rules }) => (
            <label
              key={name}
              className="text-ink-muted text-xs tracking-widest uppercase"
            >
              {label}
              <input
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                aria-required="true"
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
              />
              {errors[name] && (
                <p id={`${name}-error`} className="text-danger mt-1 text-xs">
                  {errors[name].message}
                </p>
              )}
            </label>
          ))}
        </fieldset>
        {error && (
          <p role="alert" className="text-danger text-sm">
            {error.message}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            variant="primary"
            disabled={!ownerId || !isValid || isCreating}
          >
            {isCreating ? t("clients.savingClient") : t("clients.saveClient")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isCreating}
            onClick={onCloseForm}
          > {t("common.cancel")} </Button>
        </div>
      </form>
    </div>
  );
}
