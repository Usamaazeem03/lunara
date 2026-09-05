import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "../../Shared/Button.jsx";
import Icon from "../../Shared/ui/Icon.jsx";
import { SERVICE_CATEGORIES } from "../../Shared/lib/serviceCategories.js";
import { useCurrencyCode } from "../settings/useCurrencyCode.js";

import useCreateService from "./useCreateService.js";
import { useOwnerId } from "../../globalHooks/useOwnerId.js";
import { useUpdateService } from "./useUpdateService.js";

function CreateServiceForm({ formState, saveError, saveSuccess, onCloseForm }) {
  const { ownerId } = useOwnerId();
  const { isCreating, createService } = useCreateService(ownerId);
  const { isUpdating, updateService } = useUpdateService(ownerId);
  const { currencyCode } = useCurrencyCode();
  const { id: editId, ...editValues } = formState ?? {};
  const isEditSession = Boolean(editId);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: "",
      duration: "",
      isActive: true,
    },
  });
  const emptyFormValues = {
    name: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    isActive: true,
  };

  async function onSubmit(data, event) {
    event.preventDefault();
    const servicePayload = {
      name: data.name,
      category: data.category,
      description: data.description,
      price: data.price,
      duration_minutes: data.duration,
      is_active: data.isActive,
      owner_id: ownerId,
    };

    if (isEditSession) {
      updateService(
        { id: editId, newServiceData: servicePayload },
        {
          onSuccess: () => {
            reset(emptyFormValues);
            onCloseForm();
          },
        },
      );
      return;
    }

    createService(servicePayload, {
      onSuccess: () => {
        reset(emptyFormValues);
        onCloseForm();
      },
    });
  }
  useEffect(() => {
    reset({
      name: editValues.name ?? "",
      category: editValues.category ?? "",
      description: editValues.description ?? "",
      price: editValues.price ?? "",
      duration: editValues.duration ?? "",
      isActive: editValues.isActive ?? true,
    });
  }, [
    editValues.category,
    editValues.description,
    editValues.duration,
    editValues.isActive,
    editValues.name,
    editValues.price,
    reset,
  ]);

  const selectedCategory = watch("category");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-form-title"
      className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-6xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]"
    >
      <div className="bg-ink h-1 w-full" />

      <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
        <div>
          <p
            id="service-form-title"
            className="text-ink text-base leading-tight font-semibold"
          >
            {isEditSession ? "Edit Service" : "Add Service"}
          </p>
        </div>

        <button
          type="button"
          onClick={onCloseForm}
          className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
          aria-label="Close"
        >
          X
        </button>
      </div>

      <div className="overflow-y-auto p-4 sm:p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Service Name */}
            <label className="text-ink-muted text-xs tracking-widest uppercase">
              Service Name
              <input
                id="name"
                type="text"
                placeholder="e.g. Classic Haircut"
                className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                {...register("name", {
                  required: "Service name is required",
                  validate: (value) =>
                    value.trim() !== "" || "Service name is required",
                })}
              />
              {errors.name && (
                <p className="text-danger mt-1 text-xs">
                  {errors.name.message}
                </p>
              )}
            </label>

            {/* Category */}
            <label className="text-ink-muted text-xs tracking-widest uppercase">
              Category
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {SERVICE_CATEGORIES.map((option) => {
                  const isSelected = selectedCategory === option.key;
                  const isHovered = hoveredCategory === option.key;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onMouseEnter={() => setHoveredCategory(option.key)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() =>
                        setValue("category", option.key, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      aria-pressed={isSelected}
                      className={`flex cursor-pointer items-center gap-2 border-2 px-3 py-2 text-[0.65rem] tracking-widest uppercase transition-all duration-200 ease-out ${
                        isSelected || isHovered
                          ? "border-ink bg-cream text-ink shadow-sm"
                          : "border-ink/20 text-ink-muted"
                      }`}
                    >
                      <Icon
                        name={option.iconName}
                        size={16}
                        className={`transition-colors duration-200 ease-out ${
                          isSelected || isHovered ? "text-ink" : "text-ink/70"
                        }`}
                      />

                      {option.key}
                    </button>
                  );
                })}
              </div>
              <input
                id="category"
                type="text"
                placeholder="Or type a custom category"
                className="border-ink/20 text-ink focus:border-ink mt-3 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                {...register("category", {
                  required: "Category is required",
                  validate: (value) =>
                    value.trim() !== "" || "Category is required",
                })}
              />
              {errors.category && (
                <p className="text-danger mt-1 text-xs">
                  {errors.category.message}
                </p>
              )}
            </label>

            {/* Description */}
            <label className="text-ink-muted text-xs tracking-widest uppercase sm:col-span-2">
              Description
              <textarea
                id="description"
                rows={3}
                placeholder="Add a short description"
                className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                {...register("description")}
              />
            </label>

            {/* Price */}
            <label className="text-ink-muted text-xs tracking-widest uppercase">
              Price ({currencyCode})
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 45"
                className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                })}
              />
              {errors.price && (
                <p className="text-danger mt-1 text-xs">
                  {errors.price.message}
                </p>
              )}
            </label>

            {/* Duration */}
            <label className="text-ink-muted text-xs tracking-widest uppercase">
              Duration (minutes)
              <input
                id="duration"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 45"
                className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                {...register("duration", {
                  required: "Duration is required",
                  min: {
                    value: 1,
                    message: "Duration must be at least 1 minute",
                  },
                })}
              />
              {errors.duration && (
                <p className="text-danger mt-1 text-xs">
                  {errors.duration.message}
                </p>
              )}
            </label>

            {/* Active */}
            <label className="text-ink-muted flex items-center gap-2 text-xs tracking-widest uppercase">
              <input
                type="checkbox"
                className="border-ink/40 h-4 w-4 border-2"
                {...register("isActive")}
              />
              Active
            </label>
          </div>

          {(saveError || saveSuccess) && (
            <div
              className={`mt-4 border-2 p-3 text-sm ${
                saveError
                  ? "border-danger/40 bg-danger/10 text-danger"
                  : "border-ink/20 bg-cream text-ink"
              }`}
            >
              {saveError || saveSuccess}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              variant="primary"
              disabled={
                !isValid ||
                (isEditSession && !isDirty) ||
                isCreating ||
                isUpdating
              }
            >
              {isCreating || isUpdating
                ? isEditSession
                  ? "Updating Service..."
                  : "Saving Service..."
                : isEditSession
                  ? "Update Service"
                  : "Save Service"}
            </Button>

            <Button type="button" variant="secondary" onClick={onCloseForm}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateServiceForm;
