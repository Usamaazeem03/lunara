import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n.js";
import { useEffect, useMemo, useState } from "react";
import { useCurrencyCode } from "../../settings/useCurrencyCode.js";
import { useServices } from "../../services/useServices.js";
import { notify } from "../../../Shared/lib/toast.jsx";

export function useBookingServices(ownerId, urlServices = null) {
  const { t } = useTranslation();
  const [selectedServices, setSelectedServices] = useState([]);
  const [hasPreselectedServices, setHasPreselectedServices] = useState(null);
  const [serviceQuery, setServiceQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { currencyCode } = useCurrencyCode(ownerId);
  const {
    services: loadedServices,
    isLoading: servicesLoading,
    error: servicesQueryError,
  } = useServices(ownerId, currencyCode);
  const servicesError = servicesQueryError?.message ?? "";
  const services = useMemo(
    () =>
      loadedServices
        .filter((service) => service.isActive)
        .map((service) => ({
          ...service,
          description: service.description ?? "",
          price: service.priceLabel,
          duration: Number.isFinite(service.durationValue)
            ? t("common.min", { value1: service.durationValue })
            : "",
        })),
    [loadedServices, i18n.resolvedLanguage, t],
  );

  // Initialize once after the existing owner-scoped query resolves. Keep the
  // database ID types expected by toggles, summaries, and the booking wizard.
  // The layout remounts this state when the selected owner changes.
  if (
    hasPreselectedServices === null &&
    ownerId &&
    !servicesLoading &&
    !servicesQueryError
  ) {
    const requestedIds = new Set(
      (urlServices ?? "").split(",").map((id) => id.trim()).filter(Boolean),
    );
    const initialServices = services
      .filter((service) =>
        String(service.owner_id) === String(ownerId) &&
        requestedIds.has(String(service.id)),
      )
      .map((service) => service.id);

    setSelectedServices(initialServices);
    setHasPreselectedServices(initialServices.length > 0);
  }

  useEffect(() => {
    if (servicesError) notify.error(servicesError);
  }, [servicesError]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((service) => service.category).filter(Boolean),
    );

    return ["All", ...Array.from(uniqueCategories)];
  }, [services, i18n.resolvedLanguage, t]);

  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : "All";

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const selectedServiceList = services.filter((service) =>
    selectedServices.includes(service.id),
  );
  const safeSelectedServices = selectedServiceList.map((service) => service.id);

  const normalizedQuery = serviceQuery.trim().toLowerCase();
  const filteredServices = useMemo(
    () =>
      services
        .map((service) => ({ service }))
        .filter(({ service }) => {
          const matchesCategory =
            selectedCategory === "All" || service.category === selectedCategory;

          if (!matchesCategory) return false;
          if (!normalizedQuery) return true;

          return [service.title, service.description, service.category].some(
            (value) =>
              String(value ?? "")
                .toLowerCase()
                .includes(normalizedQuery),
          );
        }),
    [normalizedQuery, selectedCategory, services, i18n.resolvedLanguage, t],
  );

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((item) => item !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const emptyServicesMessage = servicesLoading
    ? t("booking.loadingServices")
    : servicesError
      ? t("booking.unableToLoadServicesPleaseTryAgain")
      : services.length === 0
        ? t("booking.noServicesAvailableYetAddServicesInTheOwnerDashboard")
        : t("booking.noServicesFoundTryADifferentSearch");

  return {
    currencyCode,
    categories,
    selectedCategory,
    handleCategoryChange,
    serviceQuery,
    setServiceQuery,
    filteredServices,
    safeSelectedServices,
    selectedServiceList,
    toggleService,
    emptyServicesMessage,
    hasPreselectedServices,
  };
}
