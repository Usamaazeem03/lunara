import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";

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

const LG_GRID_COLS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

function DashboardStatCard({
  label,
  value,
  subtitle,
  icon,
  iconAlt = "",
  showAccent = true,
}) {
  return (
    <div className="relative overflow-hidden border border-[#2d2620]/20 bg-white/70 p-3 transition-all duration-300 hover:bg-white/90 hover:shadow-sm sm:p-4">
      {showAccent && (
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#2d2620]/5" />
      )}

      <div className="flex justify-between gap-2">
        <div className="w-full">
          {label && (
            <p className="text-xs uppercase tracking-widest text-[#5f544b]/80">
              {label}
            </p>
          )}
          <p className="mt-2 text-xl font-semibold sm:text-2xl">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-[#5f544b]">{subtitle}</p>}
        </div>

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
            <img src={icon} alt={iconAlt} className="h-5 w-5 opacity-70" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCards({ stats = defaultStats, lgGridCols = 4, className = "" }) {
  const lgCols = LG_GRID_COLS[lgGridCols] || LG_GRID_COLS[4];
  const gridClasses = [
    "mt-3 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-3 lg:mt-6 lg:gap-4",
    lgCols,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={gridClasses}>
      {stats.map((stat, index) => {
        const label = stat.label || stat.title || "";
        const value = stat.value || "";
        const subtitle = stat.subtitle || "";
        const key = stat.id || label || value || index;

        return (
          <DashboardStatCard
            key={key}
            label={label}
            value={value}
            subtitle={subtitle}
            icon={stat.icon}
            iconAlt={stat.iconAlt || ""}
          />
        );
      })}
    </section>
  );
}

export default StatCards;
