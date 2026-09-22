import StatCards from "../Dashboard/Client/StatCards";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import { formatCurrency } from "../../utils/currency";
export default function PaymentsStats({ summary, currencyCode }) {
  return (
    <StatCards
      lgGridCols={4}
      stats={[
        {
          title: "Today's Revenue",
          value: formatCurrency(summary.todayRevenue, currencyCode),
          subtitle: "Completed appointments today",
          icon: creditCardIcon,
        },
        {
          title: "This Week",
          value: formatCurrency(summary.weekRevenue, currencyCode),
          subtitle: "Completed visits, Monday to Sunday",
          icon: calendarIcon,
        },
        {
          title: "This Month",
          value: formatCurrency(summary.monthRevenue, currencyCode),
          subtitle: "Completed appointments this month",
          icon: giftIcon,
        },
        {
          title: "Pending Amount",
          value: formatCurrency(summary.pendingAmount, currencyCode),
          subtitle: `${summary.pendingBookings} pending or confirmed bookings`,
          icon: clockIcon,
        },
      ]}
    />
  );
}
