import { useMemo } from "react";

import StatCards from "../Dashboard/Client/StatCards.jsx";
import Icon from "../../Shared/ui/Icon.jsx";
import { getAppointmentStats } from "./appointmentStatsUtils.js";

export const AppointmentStats = ({ appointments = [] }) => {
  const stats = useMemo(() => {
    const { todayCount, weekCount, confirmedCount, pendingCount } =
      getAppointmentStats(appointments);

    return [
      {
        title: "Today's Appointments",
        value: todayCount.toString(),
        subtitle: "On the calendar",
        icon: <Icon name="calendar" size={20} className="text-ink-muted/70" />,
      },
      {
        title: "This Week",
        value: weekCount.toString(),
        subtitle: "Upcoming visits",
        icon: (
          <Icon name="calendar-week" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: "Confirmed",
        value: confirmedCount.toString(),
        subtitle: "Ready to start",
        icon: (
          <Icon
            name="assept-document"
            size={20}
            className="text-ink-muted/70"
          />
        ),
      },
      {
        title: "Pending",
        value: pendingCount.toString(),
        subtitle: "Needs review",
        icon: <Icon name="pending" size={20} className="text-ink-muted/70" />,
      },
    ];
  }, [appointments]);

  return <StatCards stats={stats} lgGridCols={4} />;
};
