import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import { useMemo } from "react";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { formatCurrency } from "../../utils/currency";
import { useCurrencyCode } from "../settings/useCurrencyCode";
import { useServices } from "./useServices";
import { useAppointments } from "../../globalHooks/useAppointments";
import StatCards from "../Dashboard/Client/StatCards";
import Icon from "../../Shared/ui/Icon";

export const ServicesStats = () => {
  const { t } = useTranslation();
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
    const mostPopularLabel = mostPopularService?.title ?? t("services.noDataYet");

    return [
      {
        title: t("services.totalServices"),
        value: totalServices.toString(),
        subtitle: t("services.acrossAllCategories"),
        icon: (
          <Icon name="barber-shop" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: t("services.avgPrice"),
        value: formatCurrency(avgPriceValue, currencyCode),
        subtitle: t("services.basedOnCatalog"),
        icon: (
          <Icon name="credit-card" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: t("services.mostPopular"),
        value: mostPopularLabel,
        subtitle: t("services.basedOnBookingData"),
        icon: <Icon name="hair-care" size={20} className="text-ink-muted/70" />,
      },
      {
        title: t("services.categories"),
        value: categoryCount.toString(),
        subtitle: t("services.serviceGroups"),
        icon: (
          <Icon name="category-alt" size={20} className="text-ink-muted/70" />
        ),
      },
    ];
  }, [appointments, currencyCode, services, i18n.resolvedLanguage, t]);

  return <StatCards stats={stats} lgGridCols={4} />;
};
