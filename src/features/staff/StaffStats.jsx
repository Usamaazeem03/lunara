import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import { useMemo } from "react";
import StatCards from "../Dashboard/Client/StatCards.jsx";
import Icon from "../../Shared/ui/Icon";
export default function StaffStats({ staffMembers }) {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const total = staffMembers.length;
    const activeToday = staffMembers.filter((s) => s.isOnShift).length;
    const totalRatings = staffMembers.reduce(
      (sum, member) => sum + member.ratingCount,
      0,
    );
    const avgRating =
      totalRatings > 0
        ? staffMembers.reduce(
            (sum, member) => sum + member.rating * member.ratingCount,
            0,
          ) / totalRatings
        : 0;
    const totalAppointments = staffMembers.reduce(
      (sum, s) => sum + s.appointments,
      0,
    );

    return [
      {
        title: t("staff.totalStaff"),
        value: total.toString(),
        subtitle: t("staff.teamMembers"),

        icon: (
          <Icon name="user-profile" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: t("staff.activeToday"),
        value: activeToday.toString(),
        subtitle: t("staff.onShift"),
        icon: (
          <Icon name="calendar" size={20} className="text-ink-muted/70 bold" />
        ),
      },
      {
        title: t("staff.avgRating"),
        value: totalRatings > 0 ? avgRating.toFixed(1) : t("common.noRatingsYet"),
        subtitle: t("staff.clientFeedback"),
        icon: (
          <Icon
            name="tachometer-average"
            size={20}
            className="text-ink-muted/70"
          />
        ),
      },
      {
        title: t("reports.totalAppointments"),
        value: totalAppointments.toString(),
        subtitle: t("common.allTime"),
        icon: (
          <Icon
            name="reminder-appointment"
            size={20}
            className="text-ink-muted/70 bold"
          />
        ),
      },
    ];
  }, [staffMembers, i18n.resolvedLanguage, t]);

  return <StatCards stats={stats} lgGridCols={4} />;
}
