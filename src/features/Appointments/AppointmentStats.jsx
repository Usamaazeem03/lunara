import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import { useMemo } from "react";

import StatCards from "../Dashboard/Client/StatCards.jsx";
import Icon from "../../Shared/ui/Icon.jsx";
import { getAppointmentStats } from "./appointmentStatsUtils.js";

export const AppointmentStats = ({ appointments = [] }) => {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const { todayCount, weekCount, confirmedCount, pendingCount } =
      getAppointmentStats(appointments);

    return [
      {
        title: t("common.todaySAppointments"),
        value: todayCount.toString(),
        subtitle: t("appointments.onTheCalendar"),
        icon: <Icon name="calendar" size={20} className="text-ink-muted/70" />,
      },
      {
        title: t("appointments.thisWeek"),
        value: weekCount.toString(),
        subtitle: t("appointments.upcomingVisits"),
        icon: (
          <Icon name="calendar-week" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: t("common.confirmed"),
        value: confirmedCount.toString(),
        subtitle: t("appointments.readyToStart"),
        icon: (
          <Icon
            name="assept-document"
            size={20}
            className="text-ink-muted/70"
          />
        ),
      },
      {
        title: t("common.pending"),
        value: pendingCount.toString(),
        subtitle: t("appointments.needsReview"),
        icon: <Icon name="pending" size={20} className="text-ink-muted/70" />,
      },
    ];
  }, [appointments, i18n.resolvedLanguage, t]);

  return <StatCards stats={stats} lgGridCols={4} />;
};
