import { useEffect, useMemo, useState } from "react";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../Shared/assets/icons/hair-care.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import StatCards from "../Client/StatCards";
import Button from "../../Shared/Button";
import { supabase } from "../../Shared/lib/supabaseClient";
import Icon from "../../Shared/ui/Icon";
import { confirmToast, notify } from "../../Shared/lib/toast.jsx";
import {
  SERVICE_CATEGORIES,
  getCategoryLabel,
  getServiceIcon,
} from "../../Shared/lib/serviceCategories";

const CURRENCY_CODE = "GBP";

const formatNumber = (value) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(2);

const formatPriceLabel = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return `${CURRENCY_CODE} ${formatNumber(numeric)}`;
};

const formatDurationLabel = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return `${numeric} minutes`;
};

const mapServiceRow = (service) => {
  const priceValue = Number(service.price);
  const durationValue = Number(service.duration_minutes);
  const categoryLabel = getCategoryLabel(service.category);
  return {
    id: service.id ?? service.name,
    title: service.name ?? "Untitled Service",
    description: service.description ?? "",
    category: categoryLabel,
    iconName: getServiceIcon(categoryLabel),
    priceValue: Number.isFinite(priceValue) ? priceValue : 0,
    durationValue: Number.isFinite(durationValue) ? durationValue : 0,
    priceLabel: formatPriceLabel(service.price),
    durationLabel: formatDurationLabel(service.duration_minutes),
    isActive: service.is_active !== false,
  };
};

const ServicesPage = () => {
  const [serviceRows, setServiceRows] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    if (loadError) notify.error(loadError);
  }, [loadError]);

  useEffect(() => {
    if (saveError) notify.error(saveError);
  }, [saveError]);

  useEffect(() => {
    if (saveSuccess) notify.success(saveSuccess);
  }, [saveSuccess]);

  useEffect(() => {
    if (actionError) notify.error(actionError);
  }, [actionError]);

  useEffect(() => {
    if (actionSuccess) notify.success(actionSuccess);
  }, [actionSuccess]);

  useEffect(() => {
    const getOwnerId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setOwnerId(user.id);
      }
    };
    getOwnerId();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      if (!ownerId) return;

      setIsLoading(true);
      setLoadError("");
      const { data, error } = await supabase
        .from("services")
        .select(
          "id, name, description, category, price, duration_minutes, is_active, owner_id",
        )
        .eq("owner_id", ownerId)
        .order("name", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setLoadError(error.message || "Unable to load services.");
        setServiceRows([]);
        setIsLoading(false);
        return;
      }

      setServiceRows(data ?? []);
      setIsLoading(false);
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, [ownerId]);

  const services = useMemo(() => serviceRows.map(mapServiceRow), [serviceRows]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((service) => service.category).filter(Boolean),
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [services]);

  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : "All";

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") {
      return services;
    }
    return services.filter((service) => service.category === selectedCategory);
  }, [selectedCategory, services]);

  const stats = useMemo(() => {
    const totalServices = services.length;
    const avgPriceValue = totalServices
      ? services.reduce((sum, service) => sum + service.priceValue, 0) /
        totalServices
      : 0;
    const categoryCount = new Set(
      services.map((service) => service.category).filter(Boolean),
    ).size;
    const mostPopularLabel = totalServices ? services[0].title : "No data yet";

    return [
      {
        title: "Total Services",
        value: totalServices.toString(),
        subtitle: "Across all categories",
        icon: giftIcon,
      },
      {
        title: "Avg. Price",
        value: `${CURRENCY_CODE} ${formatNumber(avgPriceValue)}`,
        subtitle: "Based on catalog",
        icon: creditCardIcon,
      },
      {
        title: "Most Popular",
        value: mostPopularLabel,
        subtitle: "Needs booking data",
        icon: hairCareIcon,
      },
      {
        title: "Categories",
        value: categoryCount.toString(),
        subtitle: "Service groups",
        icon: calendarIcon,
      },
    ];
  }, [services]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormState({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      isActive: true,
    });
  };

  const handleOpenAddForm = () => {
    setEditingServiceId(null);
    resetForm();
    setShowForm(true);
    setSaveError("");
    setSaveSuccess("");
    setActionError("");
    setActionSuccess("");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingServiceId(null);
    resetForm();
    setSaveError("");
    setSaveSuccess("");
  };

  const startEditingService = (service) => {
    setEditingServiceId(service.id);
    setFormState({
      name: service.title ?? "",
      description: service.description ?? "",
      category: service.category ?? "",
      price: Number.isFinite(service.priceValue)
        ? service.priceValue.toString()
        : "",
      duration: Number.isFinite(service.durationValue)
        ? service.durationValue.toString()
        : "",
      isActive: service.isActive ?? true,
    });
    setShowForm(true);
    setSaveError("");
    setSaveSuccess("");
    setActionError("");
    setActionSuccess("");
  };

  const isEditing = Boolean(editingServiceId);

  const isFormValid =
    formState.name.trim() &&
    formState.category.trim() &&
    formState.price !== "" &&
    formState.duration !== "";

  const handleSubmitService = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess("");
    setActionError("");
    setActionSuccess("");

    const payload = {
      name: formState.name.trim(),
      description: formState.description.trim() || null,
      category: formState.category.trim(),
      price:
        formState.price === "" || Number.isNaN(Number(formState.price))
          ? null
          : Number(formState.price),
      duration_minutes:
        formState.duration === "" || Number.isNaN(Number(formState.duration))
          ? null
          : Number(formState.duration),
      is_active: formState.isActive,
      owner_id: ownerId,
    };

    if (isEditing) {
      const { data, error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", editingServiceId)
        .select(
          "id, name, description, category, price, duration_minutes, is_active, owner_id",
        )
        .single();

      if (error) {
        setSaveError(error.message || "Unable to update the service.");
        setIsSaving(false);
        return;
      }

      if (data) {
        setServiceRows((prev) =>
          prev.map((row) => (row.id === data.id ? data : row)),
        );
      }
      setSaveSuccess("Service updated.");
      setIsSaving(false);
      setShowForm(false);
      setEditingServiceId(null);
      resetForm();
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .insert([payload])
      .select(
        "id, name, description, category, price, duration_minutes, is_active, owner_id",
      )
      .single();

    if (error) {
      setSaveError(error.message || "Unable to save the service.");
      setIsSaving(false);
      return;
    }

    if (data) {
      setServiceRows((prev) => [data, ...prev]);
    }
    setSaveSuccess("Service added.");
    setIsSaving(false);
    setShowForm(false);
    resetForm();
  };

  const handleDeleteService = async (service) => {
    const confirmed = await confirmToast({
      title: `Delete "${service.title}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete service",
      cancelLabel: "Keep service",
      confirmTone: "danger",
    });
    if (!confirmed) return;

    setDeletingServiceId(service.id);
    setActionError("");
    setActionSuccess("");

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id);

    if (error) {
      setActionError(error.message || "Unable to delete the service.");
      setDeletingServiceId(null);
      return;
    }

    setServiceRows((prev) => prev.filter((row) => row.id !== service.id));
    setActionSuccess("Service deleted.");
    setDeletingServiceId(null);

    if (editingServiceId === service.id) {
      handleCancelForm();
    }
  };

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Services"
        title="Services"
        description="Manage your salon services and pricing."
      >
        <Button
          variant="primary"
          onClick={showForm ? handleCancelForm : handleOpenAddForm}
        >
          {showForm ? "Close" : "Add Service"}
        </Button>
      </DashboardHeader>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCancelForm}
          />

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
                  {isEditing ? "Edit Service" : "Add Service"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelForm}
                className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
                aria-label="Close"
              >
                X
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5">
              <form onSubmit={handleSubmitService} className="space-y-4">
                <p className="text-ink-muted text-xs tracking-widest uppercase">
                  {isEditing ? "Edit Service" : "Add Service"}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Service Name
                    <input
                      name="name"
                      value={formState.name}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="e.g. Classic Haircut"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Category
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {SERVICE_CATEGORIES.map((option) => {
                        const isSelected = formState.category === option.key;
                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() =>
                              setFormState((prev) => ({
                                ...prev,
                                category: option.key,
                              }))
                            }
                            aria-pressed={isSelected}
                            className={`flex items-center gap-2 border-2 px-3 py-2 text-[0.65rem] tracking-widest uppercase transition ${
                              isSelected
                                ? "border-ink bg-cream text-ink"
                                : "border-ink/20 text-ink-muted hover:border-ink bg-white"
                            }`}
                          >
                            <Icon
                              name={option.iconName}
                              size={16}
                              className="text-ink/70"
                            />
                            {option.key}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      name="category"
                      value={formState.category}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="Or type a custom category"
                      className="border-ink/20 text-ink focus:border-ink mt-3 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>
                  <label className="text-ink-muted text-xs tracking-widest uppercase sm:col-span-2">
                    Description
                    <textarea
                      name="description"
                      value={formState.description}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="Add a short description"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Price ({CURRENCY_CODE})
                    <input
                      name="price"
                      value={formState.price}
                      onChange={handleFormChange}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 45"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Duration (minutes)
                    <input
                      name="duration"
                      value={formState.duration}
                      onChange={handleFormChange}
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 45"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>
                  <label className="text-ink-muted flex items-center gap-2 text-xs tracking-widest uppercase">
                    <input
                      name="isActive"
                      checked={formState.isActive}
                      onChange={handleFormChange}
                      type="checkbox"
                      className="border-ink/40 h-4 w-4 border-2"
                    />
                    Active
                  </label>
                </div>

                {(saveError || saveSuccess) && (
                  <div
                    className={`mt-4 border-2 p-3 text-sm ${
                      saveError
                        ? "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]"
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
                    loading={isSaving}
                    disabled={!isFormValid || isSaving}
                  >
                    {isEditing ? "Update Service" : "Save Service"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 flex flex-col gap-4">
        <div className="border-ink/20 border-2 bg-white/90 p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === selectedCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
                    isActive
                      ? "border-ink bg-cream text-ink"
                      : "border-ink/20 text-ink-muted hover:border-ink bg-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {loadError && (
          <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
            {loadError}
          </div>
        )}

        {actionError && (
          <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
            {actionError}
          </div>
        )}

        {actionSuccess && (
          <div className="border-ink/20 bg-cream text-ink border-2 p-3 text-sm">
            {actionSuccess}
          </div>
        )}

        {isLoading && (
          <div className="border-ink/20 text-ink-muted border-2 bg-white/90 p-4 text-sm">
            Loading services...
          </div>
        )}

        {!isLoading && filteredServices.length === 0 && (
          <div className="border-ink/30 bg-cream text-ink-muted border-2 border-dashed p-4 text-center text-sm">
            No services available yet. Add your first service above.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={startEditingService}
              onDelete={handleDeleteService}
              isDeleting={deletingServiceId === service.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, onEdit, onDelete, isDeleting }) => {
  const iconName = service.iconName || getServiceIcon(service.category);
  return (
    <article className="border-ink/20 relative flex h-full flex-col border-2 bg-white/90 p-4 sm:p-5">
      <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div>
      <div className="flex items-start justify-between gap-3">
        <div className="border-ink/20 bg-cream flex h-12 w-12 items-center justify-center rounded-2xl border-2">
          <Icon name={iconName} size={24} className="text-ink/70" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="border-ink/20 bg-cream text-ink-muted rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
            {service.category}
          </span>
          {!service.isActive && (
            <span className="rounded-full border-2 border-[#b0412e]/40 bg-[#b0412e]/10 px-3 py-1 text-[0.6rem] tracking-widest text-[#b0412e] uppercase">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-ink-muted mt-1 text-sm">{service.description}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
            <Icon name="credit-card" size={16} className="text-ink/70" />
          </span>
          <span className="font-semibold">{service.priceLabel}</span>
        </div>
        <div className="text-ink-muted flex items-center gap-2">
          <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
            <Icon name="clock" size={16} className="text-ink/70" />
          </span>
          <span>{service.durationLabel}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(service)}
          disabled={isDeleting}
          className={`border-ink/20 bg-cream hover:border-ink flex-1 border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
            isDeleting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(service)}
          disabled={isDeleting}
          className={`flex-1 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 px-4 py-2 text-xs tracking-widest text-[#b0412e] uppercase transition hover:border-[#b0412e] ${
            isDeleting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default ServicesPage;
