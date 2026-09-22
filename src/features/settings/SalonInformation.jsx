import { useForm } from "react-hook-form";
import { useSalonInformation } from "./useSalonInformation";
import { internationalPhoneRules } from "../../Shared/lib/phoneValidation";

const fields = [
  {
    name: "full_name",
    label: "Salon name",
    type: "text",
    autoComplete: "organization",
    maxLength: 120,
  },
  {
    name: "address",
    label: "Salon address",
    type: "text",
    autoComplete: "street-address",
    maxLength: 300,
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

function SalonInformationForm({ salon, save }) {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: Object.fromEntries(
      fields.map(({ name }) => [name, salon[name] || ""]),
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
      <p className="text-ink-muted mt-4 text-xs">
        Contact email is shown to clients. Your sign-in email stays the same.
      </p>
      <div className="border-ink/10 mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <span className="text-ink-muted text-xs" aria-live="polite">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!isDirty || save.isPending}
            onClick={() => reset()}
            className="border-ink/20 min-h-11 border-2 px-4 text-xs tracking-widest uppercase disabled:opacity-40"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isDirty || !isValid || save.isPending}
            className="bg-ink min-h-11 px-4 text-xs tracking-widest text-white uppercase disabled:opacity-40"
          >
            {save.isPending ? "Saving..." : "Save salon"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function SalonInformation() {
  const { data, isPending, error, refetch, save } = useSalonInformation();
  return (
    <section className="border-ink/20 border-2 bg-white/90 p-4 sm:p-5">
      <h2 className="text-lg font-semibold">Salon Information</h2>
      <p className="text-ink-muted mt-1 mb-6 text-sm">
        Keep your salon name, location and client contact details up to date.
      </p>
      {isPending ? (
        <p role="status">Loading salon information...</p>
      ) : error ? (
        <div role="alert">
          <p>Salon information could not be loaded.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <SalonInformationForm key={data.id} salon={data} save={save} />
      )}
    </section>
  );
}
