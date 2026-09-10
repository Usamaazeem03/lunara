import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../services/apiServices";
import {
  getCategoryLabel,
  getServiceIcon,
} from "../../Shared/lib/serviceCategories.js";
import { formatCurrency } from "../../utils/currency.js";

const EMPTY_SERVICES = [];

const mapService = (service, currencyCode) => {
  const priceValue = Number(service.price);
  const durationValue = Number(service.duration_minutes);
  const category = getCategoryLabel(service.category);

  return {
    ...service,
    title: service.name ?? "Untitled Service",
    category,
    iconName: getServiceIcon(category),
    priceValue: Number.isFinite(priceValue) ? priceValue : 0,
    durationValue: Number.isFinite(durationValue) ? durationValue : 0,
    priceLabel: Number.isFinite(priceValue)
      ? formatCurrency(priceValue, currencyCode)
      : "N/A",
    durationLabel: Number.isFinite(durationValue)
      ? `${durationValue} minutes`
      : "N/A",
    isActive: service.is_active !== false,
  };
};

export const servicesQueryKey = (ownerId) => ["services", ownerId ?? "all"];

export function useServices(ownerId, currencyCode) {
  const { isLoading, isFetching, data, error, isError } = useQuery({
    queryKey: servicesQueryKey(ownerId),
    queryFn: () => getServices(ownerId),
    enabled: Boolean(ownerId),
  });

  return {
    isLoading,
    isFetching,
    services: (data ?? EMPTY_SERVICES).map((service) =>
      mapService(service, currencyCode),
    ),
    error,
    isError,
  };
}
