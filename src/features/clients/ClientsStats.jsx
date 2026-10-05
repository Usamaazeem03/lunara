import { useTranslation } from "react-i18next";
import StatCards from "../Dashboard/Client/StatCards";
import Icon from "../../Shared/ui/Icon";
import { formatCurrency } from "../../utils/currency";
import { getClientStats } from "./clientStatsUtils";

export default function ClientsStats({
  clients,
  currencyCode,
  isLoading,
  error,
}) {
  const { t } = useTranslation();
  const { totalClients, activeClients, totalRevenue, avgValue } =
    getClientStats(clients);
  const displayValue = (value) =>
    isLoading ? "..." : error ? t("common.unavailable") : value;
  const displayMoney = (value) =>
    currencyCode ? formatCurrency(value, currencyCode) : t("common.unavailable");
  const stats = [
    {
      title: t("common.totalClients"),
      value: displayValue(totalClients),
      subtitle: t("common.allTime"),
      icon: <Icon name="users" size={20} className="text-ink-muted/70" />,
    },
    {
      title: t("clients.activeClients"),
      value: displayValue(activeClients),
      subtitle: t("clients.visitedIn90Days"),
      icon: (
        <Icon name="user-profile" size={20} className="text-ink-muted/70" />
      ),
    },
    {
      title: t("clients.totalRevenue"),
      value: displayValue(displayMoney(totalRevenue)),
      subtitle: t("common.completedVisits"),

      icon: <Icon name="credit-card-alt" size={20} className="text-ink-muted/70" />,
    },
    {
      title: t("clients.avgLifetimeValue"),
      value: displayValue(displayMoney(avgValue)),
      subtitle: t("clients.perClient"),
            icon: <Icon name="tachometer-average" size={20} className="text-ink-muted/70" />,

    },
  ];

  return <StatCards stats={stats} lgGridCols={4} />;
}
