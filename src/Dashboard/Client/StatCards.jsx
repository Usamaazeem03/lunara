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
  const baseStyles =
    "mt-3 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:mt-6 lg:gap-4";
  return (
    <section className={baseStyles}>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
}

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="relative overflow-hidden border border-[#2d2620]/20 bg-white/70 p-3 sm:p-4 md:p-4 transition-all duration-300 hover:bg-white/90 hover:shadow-sm">
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#2d2620]/5"></div>
      <div className="flex flex-row items-start justify-between gap-2">
        <div className="w-full">
          <p className="text-[0.65rem] uppercase tracking-widest text-[#5f544b]/80 sm:text-xs">
            {title}
          </p>
          <p className="mt-2 text-xl font-semibold sm:text-2xl">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-[#5f544b] sm:mt-2">{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9] sm:h-12 sm:w-12">
          <img src={icon} alt="" className="h-5 w-5 opacity-70 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCards;
