import { useMemo } from "react";
import StatCards from "../Dashboard/Client/StatCards.jsx";
import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../Shared/assets/icons/hair-care.svg";
import Icon from "../../Shared/ui/Icon";
export default function StaffStats({ staffMembers }) {
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
        title: "Total Staff",
        value: total.toString(),
        subtitle: "Team members",

        icon: (
          <Icon name="user-profile" size={20} className="text-ink-muted/70" />
        ),
      },
      {
        title: "Active Today",
        value: activeToday.toString(),
        subtitle: "On shift",
        icon: (
          <Icon name="calendar" size={20} className="text-ink-muted/70 bold" />
        ),
      },
      {
        title: "Avg. Rating",
        value: totalRatings > 0 ? avgRating.toFixed(1) : "No ratings yet",
        subtitle: "Client feedback",
        icon: (
          <Icon
            name="tachometer-average"
            size={20}
            className="text-ink-muted/70"
          />
        ),
      },
      {
        title: "Total Appointments",
        value: totalAppointments.toString(),
        subtitle: "All time",
        icon: (
          <Icon
            name="reminder-appointment"
            size={20}
            className="text-ink-muted/70 bold"
          />
        ),
      },
    ];
  }, [staffMembers]);

  return <StatCards stats={stats} lgGridCols={4} />;
}
