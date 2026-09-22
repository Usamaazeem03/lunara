import { useEffect, useMemo, useState } from "react";
import { useCurrencyCode } from "../../settings/useCurrencyCode.js";
import { useServices } from "../../services/useServices.js";
import { notify } from "../../../Shared/lib/toast.jsx";

export function useBookingServices(ownerId) {
  const [selectedServices, setSelectedServices] = useState([]);
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
            ? `${service.durationValue} min`
            : "",
        })),
    [loadedServices],
  );

  useEffect(() => {
    if (servicesError) notify.error(servicesError);
  }, [servicesError]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((service) => service.category).filter(Boolean),
    );

    return ["All", ...Array.from(uniqueCategories)];
  }, [services]);

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
    [normalizedQuery, selectedCategory, services],
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
    ? "Loading services..."
    : servicesError
      ? "Unable to load services. Please try again."
      : services.length === 0
        ? "No services available yet. Add services in the owner dashboard."
        : "No services found. Try a different search.";

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
  };
}
