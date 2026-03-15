import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";

const defaultStats = [
  {
    title: "Total Spend",
    value: "GBP 1,050",
    subtitle: "Last 6 months",
    icon: creditCardIcon,
  },
  {
    title: "Loyalty Points",
    value: "120",
    subtitle: "Reward ready",
    icon: giftIcon,
  },
  {
    title: "Visits This Year",
    value: "6",
    subtitle: "2 upcoming",
    icon: calendarIcon,
  },
  {
    title: "Avg Service Time",
    value: "45 min",
    subtitle: "Based on history",
    icon: clockIcon,
  },
];

function StatCards({ stats = defaultStats, lgGridCols = 4 }) {
  const baseStyles = "mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4";
  return (
    <section className={`${baseStyles} lg:grid-cols-${lgGridCols}`}>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
}

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="relative overflow-hidden  border border-[#2d2620]/20 bg-white/70 p-5">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#2d2620]/5"></div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#5f544b]">
            {title}
          </p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
          {subtitle && (
            <p className="mt-2 text-xs text-[#5f544b]">{subtitle}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
          <img src={icon} alt="" className="h-6 w-6 opacity-70" />
        </div>
      </div>
    </div>
  );
};

export default StatCards;
