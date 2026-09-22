import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
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
  const { totalClients, activeClients, totalRevenue, avgValue } =
    getClientStats(clients);
  const displayValue = (value) =>
    isLoading ? "..." : error ? "Unavailable" : value;
  const displayMoney = (value) =>
    currencyCode ? formatCurrency(value, currencyCode) : "Unavailable";
  const stats = [
    {
      title: "Total Clients",
      value: displayValue(totalClients),
      subtitle: "All time",
      icon: <Icon name="users" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "Active Clients",
      value: displayValue(activeClients),
      subtitle: "Visited in 90 days",
      icon: (
        <Icon name="user-profile" size={20} className="text-ink-muted/70" />
      ),
    },
    {
      title: "Total Revenue",
      value: displayValue(displayMoney(totalRevenue)),
      subtitle: "Completed visits",

      icon: <Icon name="credit-card-alt" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "Avg. Lifetime Value",
      value: displayValue(displayMoney(avgValue)),
      subtitle: "Per client",
            icon: <Icon name="tachometer-average" size={20} className="text-ink-muted/70" />,

    },
  ];

  return <StatCards stats={stats} lgGridCols={4} />;
}
