import { useMemo } from "react";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { formatCurrency } from "../../utils/currency";
import { useCurrencyCode } from "../settings/useCurrencyCode";
import { useServices } from "./useServices";
import { useAppointments } from "../../globalHooks/useAppointments";
import StatCards from "../Dashboard/Client/StatCards";
import Icon from "../../Shared/ui/Icon";

export const ServicesStats = () => {
  const { ownerId } = useOwnerId();
  const { currencyCode } = useCurrencyCode(ownerId);
  const { services } = useServices(ownerId, currencyCode);
  const { appointments } = useAppointments(ownerId);

  const stats = useMemo(() => {
    const totalServices = services.length;
    const avgPriceValue = totalServices
      ? services.reduce((sum, service) => sum + service.priceValue, 0) /
        totalServices
      : 0;
    const categoryCount = new Set(
      services.map((service) => service.category).filter(Boolean),
    ).size;
    const bookingCounts = appointments.reduce((counts, appointment) => {
      if (appointment.service_id === null) return counts;

      const serviceId = String(appointment.service_id);
      counts[serviceId] = (counts[serviceId] ?? 0) + 1;
      return counts;
    }, {});
    const mostPopularServiceId = Object.entries(bookingCounts).sort(
      ([, countA], [, countB]) => countB - countA,
    )[0]?.[0];
    const mostPopularService = services.find(
      (service) => String(service.id) === mostPopularServiceId,
    );
    const mostPopularLabel = mostPopularService?.title ?? "No data yet";

    return [
      {
        title: "Total Services",
        value: totalServices.toString(),
        subtitle: "Across all categories",
        icon: (
          <Icon name="barber-shop" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: "Avg. Price",
        value: formatCurrency(avgPriceValue, currencyCode),
        subtitle: "Based on catalog",
        icon: (
          <Icon name="credit-card" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: "Most Popular",
        value: mostPopularLabel,
        subtitle: "Based on booking data",
        icon: <Icon name="hair-care" size={20} className="text-ink-muted/70" />,
      },
      {
        title: "Categories",
        value: categoryCount.toString(),
        subtitle: "Service groups",
        icon: (
          <Icon name="category-alt" size={20} className="text-ink-muted/70" />
        ),
      },
    ];
  }, [appointments, currencyCode, services]);

  return <StatCards stats={stats} lgGridCols={4} />;
};
