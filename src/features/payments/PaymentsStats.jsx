import { useTranslation } from "react-i18next";
import StatCards from "../Dashboard/Client/StatCards";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import { formatCurrency } from "../../utils/currency";
export default function PaymentsStats({ summary, currencyCode }) {
  const { t } = useTranslation();
  return (
    <StatCards
      lgGridCols={4}
      stats={[
        {
          title: t("payments.todaySRevenue"),
          value: formatCurrency(summary.todayRevenue, currencyCode),
          subtitle: t("payments.completedAppointmentsToday"),
          icon: creditCardIcon,
        },
        {
          title: t("appointments.thisWeek"),
          value: formatCurrency(summary.weekRevenue, currencyCode),
          subtitle: t("payments.completedVisitsMondayToSunday"),
          icon: calendarIcon,
        },
        {
          title: t("dashboard.thisMonth2"),
          value: formatCurrency(summary.monthRevenue, currencyCode),
          subtitle: t("dashboard.completedAppointmentsThisMonth"),
          icon: giftIcon,
        },
        {
          title: t("dashboard.pendingAmount"),
          value: formatCurrency(summary.pendingAmount, currencyCode),
          subtitle: t("payments.pendingOrConfirmedBookings", { value1: summary.pendingBookings }),
          icon: clockIcon,
        },
      ]}
    />
  );
}
