import { useForm } from "react-hook-form";
import { useClientInformation } from "./useClientInformation";
import { internationalPhoneRules } from "../../Shared/lib/phoneValidation";
import { clientSettingsStyles as styles } from "./clientSettingsStyles";

const fields = [
  {
    name: "full_name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    maxLength: 120,
  },
  {
    name: "phone",
    label: "Contact phone",
    type: "tel",
    autoComplete: "tel",
    placeholder: "+44 1234 567890",
  },
  {
    name: "email",
    label: "Contact email",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
      "Enter a valid email address.",
  },
];

function ClientInformationForm({ client, save }) {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: Object.fromEntries(
      fields.map(({ name }) => [name, client[name] || ""]),
    ),
  });
  return (
    <form
      onSubmit={handleSubmit((values) =>
        save.mutate(values, {
          onSuccess: (data) =>
            reset(
              Object.fromEntries(
                fields.map(({ name }) => [name, data[name] || ""]),
              ),
            ),
        }),
      )}
      noValidate
    >
      <fieldset disabled={save.isPending} className="grid gap-5 sm:grid-cols-2">
        {fields.map(({ name, label, validate, ...input }) => (
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
                      required: `${label} is required.`,
                      validate:
                        validate ||
                        ((value) =>
                          Boolean(value.trim()) || `${label} is required.`),
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
      <p className="text-ink-muted mt-4 text-xs leading-5">
        This is your contact email. Your sign-in email stays the same.
      </p>
      <div className="border-ink/10 mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-ink-muted text-xs" aria-live="polite">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <div className="grid grid-cols-[auto_1fr] gap-2 sm:flex">
          <button
            type="button"
            disabled={!isDirty || save.isPending}
            onClick={() => reset()}
            className={styles.secondary}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isDirty || !isValid || save.isPending}
            className={styles.primary}
          >
            {save.isPending ? "Saving..." : "Save information"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ClientInformation() {
  const { data, isPending, error, refetch, save } = useClientInformation();
  return (
    <section className={styles.card}>
      <h2 className="text-lg font-semibold">Personal information</h2>
      <p className="text-ink-muted mt-1 mb-6 text-sm leading-6">
        Keep your name and contact details up to date.
      </p>
      {isPending ? (
        <p role="status">Loading your information...</p>
      ) : error ? (
        <div role="alert">
          <p>Your information could not be loaded.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className={`${styles.secondary} mt-3`}
          >
            Try again
          </button>
        </div>
      ) : (
        <ClientInformationForm key={data.id} client={data} save={save} />
      )}
    </section>
  );
}
