import { fixedLabel } from "../../i18n/fixedLabels.js";
import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { validateInternationalPhone } from "../../Shared/lib/phoneValidation";
import { useLocalizedForm as useForm } from "../../i18n/useLocalizedForm.js";
import { useWatch } from "react-hook-form";
import Button from "../../Shared/Button.jsx";
import Icon from "../../Shared/ui/Icon.jsx";
import { STAFF_ROLES } from "./staffUtils";
import useCreateStaff from "./useCreateStaff";
import { useUpdateStaff } from "./useUpdateStaff";

import StaffImageField from "./StaffImageField";

const FIELDS = [
  {
    name: "name",
    labelKey: "clients.fullName",
    placeholderKey: "staff.eGJessicaMartinez",
    required: true,
  },
  {
    name: "role",
    labelKey: "staff.role",
    placeholderKey: "staff.orTypeACustomRole",
    required: true,
  },
  {
    name: "phone",
    labelKey: "clients.phone",
    type: "tel",
    placeholder: "+44 1234 567890",
    required: true,
  },
  {
    name: "email",
    labelKey: "clients.email",
    required: true,
    type: "email",
    placeholder: "name@salonpro.com",
  },
  { name: "schedule", labelKey: "staff.scheduleOptional", placeholderKey: "common.monFri" },
  {
    name: "specialties",
    labelKey: "staff.specialtiesOptionalCommaSeparated",
    placeholderKey: "staff.hairColoringHairStylingHairTreatment",
  },
];

export default function CreateStaffForm({ ownerId, member, onCloseForm }) {
  const { t } = useTranslation();
  const {
    createStaff,
    isCreating,
    error: createError,
  } = useCreateStaff(ownerId);
  const {
    updateStaff,
    isUpdating,
    error: updateError,
  } = useUpdateStaff(ownerId);
  const isEditing = Boolean(member?.id);
  const isSaving = isCreating || isUpdating;
  const saveError = (createError || updateError)?.message;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: member?.name ?? "",
      role: member?.role ?? "",
      phone: member?.phone ?? "",
      email: member?.email ?? "",
      schedule: member?.schedule ?? t("common.monFri"),
      specialties: member?.specialties?.join(", ") ?? "",
      isOnShift: member?.isOnShift ?? false,
    },
  });
  const selectedRole = useWatch({ control, name: "role" });
  const selectedImage = useWatch({ control, name: "image" });
  const requiredValues = useWatch({
    control,
    name: ["name", "role", "phone", "email"],
  });
  const hasRequiredFields = requiredValues.every((value) =>
    Boolean(value?.trim()),
  );

  function onSubmitStaff(values) {
    if (isSaving) return;
    const payload = {
      image: values.image?.[0] ?? null,
      name: values.name.trim(),
      role: values.role.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || null,
      schedule: values.schedule.trim(),
      is_on_shift: values.isOnShift,
      specialties: [
        ...new Set(
          values.specialties
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        ),
      ],
    };
    if (isEditing)
      updateStaff({ id: member.id, payload }, { onSuccess: onCloseForm });
    else createStaff(payload, { onSuccess: onCloseForm });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-form-title"
      className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-6xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]"
    >
      <div className="bg-ink h-1 w-full" />
      <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
        <h2 id="staff-form-title" className="text-ink text-base font-semibold">
          {isEditing ? t("staff.editStaffMember") : t("staff.addNewStaffMember")}
        </h2>
        <button
          type="button"
          onClick={onCloseForm}
          disabled={isSaving}
          aria-label={t("common.close")}
          className="border-ink/20 text-ink-muted hover:border-ink h-8 w-8 border-2"
        >
          X
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitStaff)}
        noValidate
        className="space-y-4 overflow-y-auto p-4 sm:p-5"
      >
        <p className="text-ink-muted text-sm"> {t("staff.nameRolePhoneAndEmailAreRequired")} </p>
        <fieldset disabled={isSaving} className="grid gap-3 sm:grid-cols-2">
          <StaffImageField
            register={register}
            control={control}
            error={errors.image}
            image={member?.image}
            name={member?.name}
          />
          {translateConfig(FIELDS).map(
            ({ name, label, type = "text", placeholder, required }) => (
              <div
                key={name}
                className={name === "specialties" ? "sm:col-span-2" : ""}
              >
                <label
                  htmlFor={`staff-${name}`}
                  className="text-ink-muted text-xs tracking-widest uppercase"
                >
                  {label}
                </label>
                {name === "role" && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {STAFF_ROLES.map((option) => (
                      <button
                        key={fixedLabel(option.key, "role")}
                        type="button"
                        onClick={() =>
                          setValue("role", option.key, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        aria-pressed={selectedRole === option.key}
                        className={`flex items-center gap-2 border-2 px-3 py-2 text-[0.65rem] tracking-widest uppercase transition ${selectedRole === option.key ? "border-ink bg-cream text-ink" : "border-ink/20 text-ink-muted hover:border-ink bg-white"}`}
                      >
                        <Icon
                          name={option.iconName}
                          size={16}
                          className="text-ink/70"
                        />
                        {option.key}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  id={`staff-${name}`}
                  type={type}
                  placeholder={placeholder}
                  aria-required={required || undefined}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={
                    errors[name] ? `staff-${name}-error` : undefined
                  }
                  className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                  {...register(name, {
                    validate: (value) => {
                      if (name === "phone")
                        return validateInternationalPhone(value);
                      if (required && !value.trim())
                        return t("staff.thisFieldIsRequired");
                      if (
                        name === "email" &&
                        value.trim() &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                      )
                        return t("common.enterAValidEmailAddress");
                      return true;
                    },
                  })}
                />
                {errors[name] && (
                  <p
                    id={`staff-${name}-error`}
                    className="text-danger mt-1 text-xs"
                  >
                    {errors[name].message}
                  </p>
                )}
              </div>
            ),
          )}
          <label className="text-ink-muted flex items-center gap-2 text-xs tracking-widest uppercase">
            <input
              type="checkbox"
              {...register("isOnShift")}
              className="border-ink/40 h-4 w-4 border-2"
            /> {t("staff.currentlyOnShift")} </label>
        </fieldset>
        {saveError && (
          <p
            role="alert"
            className="text-danger border-danger/40 bg-danger/10 border-2 p-3 text-sm"
          >
            {saveError}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={
              !ownerId ||
              !hasRequiredFields ||
              (isEditing && !isDirty && !selectedImage?.[0]) ||
              isSaving
            }
          >
            {isEditing ? t("staff.updateStaff") : t("staff.saveStaff")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCloseForm}
            disabled={isSaving}
          > {t("common.cancel")} </Button>
        </div>
      </form>
    </div>
  );
}
