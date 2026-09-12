import StatCards from "../Client/StatCards.jsx";
import Icon from "../../../Shared/ui/Icon.jsx";
export const DashboardStats = ({
  todayAppointments = [],
  totalClients = 0,
  monthRevenue = "N/A",
  pendingPayments = "N/A",
  monthLabel = "This month",
}) => {
  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
      subtitle: "On schedule",
      icon: <Icon name="calendar" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "Total Clients",
      value: totalClients.toString(),
      subtitle: "Active profiles",
      icon: <Icon name="users" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "This Month Revenue",
      value: monthRevenue,
      subtitle: monthLabel,
      icon: <Icon name="credit-card" size={20} className="text-ink-muted/70" />,
    },
    {
      title: "Pending Payments",
      value: pendingPayments,
      subtitle: "Follow-ups needed",
      icon: <Icon name="pending" size={20} className="text-ink-muted/70" />,
    },
  ];

  return <StatCards stats={stats} lgGridCols={4} />;
};
