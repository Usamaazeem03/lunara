import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import { formatCurrency } from "../../utils/currency";
export const ReportStatCard = ({ title, value, subtitle, delta, icon }) => {
  useTranslation();
  return (
    <div className="border-ink/20 relative overflow-hidden border-2 bg-white/90 p-4">
      <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div>
      <div className="flex items-center justify-between gap-3">
        <div className="border-ink/20 bg-cream flex h-11 w-11 items-center justify-center rounded-full border-2">
          <img src={icon} alt="" className="h-5 w-5 opacity-70" />
        </div>
        <span className="border-ink/20 bg-cream-deep text-ink rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
          {delta}
        </span>
      </div>
      <p className="text-ink-muted mt-4 text-xs tracking-widest uppercase">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-ink-muted mt-1 text-xs">{subtitle}</p>
    </div>
  );
};

export const PaymentMethodRow = ({ label, value, percent, color }) => {
  useTranslation();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold">{label}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold">{value}</p>
          <p className="text-ink-muted text-xs">{percent}%</p>
        </div>
      </div>
      <div className="border-ink/20 bg-cream h-2 w-full overflow-hidden rounded-full border">
        <div
          className="h-full"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color} 75%, var(--color-cream-deep) 100%)`,
          }}
        />
      </div>
    </div>
  );
};
import { useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildRevenueSeries } from "./reportsChartUtils.js";

const chartTooltipStyle = {
  border: "1px solid #cbb9a6",
  background: "#fffdf9",
  borderRadius: 12,
  fontSize: 12,
  color: "#302821",
};
const controlClass =
  "border-ink/20 bg-cream/50 text-ink rounded-lg border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const compact = (value) =>
  new Intl.NumberFormat(i18n.resolvedLanguage, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function RevenueTrendChart({ appointments, dateRange, currencyCode }) {
  const { t } = useTranslation();
  const [grouping, setGrouping] = useState(
    dateRange === "This Year" ? "month" : "day",
  );
  const [compare, setCompare] = useState(true);
  const gradientId = useId();
  const rows = useMemo(
    () => buildRevenueSeries(appointments, dateRange, grouping),
    [appointments, dateRange, grouping, i18n.resolvedLanguage],
  );
  const total = rows.reduce((sum, row) => sum + row.current, 0);
  const previous = rows.reduce((sum, row) => sum + row.previous, 0);
  const peak = rows.reduce(
    (best, row) => (row.current > (best?.current ?? 0) ? row : best),
    null,
  );
  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="text-ink-muted flex items-center gap-2 text-xs"> {t("reports.groupBy")} <select
            aria-label={t("reports.revenueGrouping")}
            className={controlClass}
            value={grouping}
            onChange={(event) => setGrouping(event.target.value)}
          >
            <option value="day">{t("reports.day")}</option>
            <option value="week">{t("reports.week")}</option>
            {dateRange === "This Year" && <option value="month">{t("reports.month")}</option>}
          </select>
        </label>
        <button
          type="button"
          aria-pressed={compare}
          className={controlClass}
          onClick={() => setCompare(!compare)}
        >
          {compare ? t("reports.hide") : t("reports.show")} {t("reports.previousPeriod")} </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span>
          <span className="text-ink-muted block text-xs">{t("reports.selectedPeriod")}</span>
          <strong>{formatCurrency(total, currencyCode)}</strong>
        </span>
        {compare && (
          <span>
            <span className="text-ink-muted block text-xs"> {t("reports.previousPeriod2")} </span>
            <strong>{formatCurrency(previous, currencyCode)}</strong>
          </span>
        )}
      </div>
      <div
        className="h-72 w-full min-w-0"
        role="group"
        aria-label={t("reports.revenueChartUseArrowKeysToExploreValues")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={rows}
            accessibilityLayer
            margin={{ top: 12, right: 10, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8c6f5a" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8c6f5a" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e8dfd5"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={25}
            />
            <YAxis
              tickFormatter={compact}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={52}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value, name) => [
                formatCurrency(value, currencyCode),
                name,
              ]}
              labelFormatter={(label) =>
                `${grouping === "week" ? t("reports.weekStarting") : ""}${label}`
              }
            />
            {compare && (
              <Area
                type="monotone"
                dataKey="previous"
                name={t("reports.previousPeriod2")}
                stroke="#a8998a"
                strokeDasharray="5 4"
                fill="transparent"
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="current"
              name={t("reports.selectedPeriod")}
              stroke="#644c3b"
              fill={`url(#${gradientId})`}
              strokeWidth={3}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-ink-muted mt-2 text-xs">
        {peak
          ? t("reports.peak", { value1: grouping, value2: peak.label, value3: formatCurrency(peak.current, currencyCode) })
          : t("reports.noCompletedRevenueInTheSelectedPeriod")}{" "} {t("reports.hoverTapOrUseArrowKeysForValues")} </p>
      {compare && (
        <p className="text-ink-muted mt-1 text-xs"> {t("reports.dashedLinePreviousPeriodAlignedBy")}{" "}
          {grouping === "month" ? t("reports.calendarMonth") : t("reports.elapsedDays")}.
        </p>
      )}
      <details className="mt-3 text-xs">
        <summary className="cursor-pointer py-2 font-semibold"> {t("reports.viewRevenueData")} </summary>
        <div className="max-h-56 overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">{t("reports.periodStart")}</th>
                <th className="p-2">{t("common.revenue")}</th>
                {compare && <th className="p-2">{t("common.previous")}</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-ink/10 border-t">
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">
                    {formatCurrency(row.current, currencyCode)}
                  </td>
                  {compare && (
                    <td className="p-2">
                      {formatCurrency(row.previous, currencyCode)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export function ServicePie({ data }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const rows = data.filter((item) => item.count > 0);
  const total = rows.reduce((sum, item) => sum + item.count, 0);
  const active = rows.find((item) => item.label === selected);
  if (!total)
    return (
      <div className="text-ink-muted flex h-64 items-center justify-center text-sm"> {t("reports.noServiceBookingsInThisPeriod")} </div>
    );
  const select = (label) =>
    setSelected((current) => (current === label ? null : label));
  return (
    <div>
      <div
        className="relative h-60"
        role="group"
        aria-label={t("reports.serviceBookingShares")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="count"
              nameKey="label"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={rows.length > 1 ? 2 : 0}
              stroke="none"
              isAnimationActive={false}
              onClick={(entry) => select(entry.label)}
            >
              {rows.map((row) => (
                <Cell
                  key={row.label}
                  fill={row.color}
                  fillOpacity={!active || active.label === row.label ? 1 : 0.2}
                  className="cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value, name) => [
                t("reports.bookings", { value1: value, value2: ((value / total) * 100).toFixed(1) }),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <strong className="text-3xl">{active?.count ?? total}</strong>
          <span className="text-ink-muted max-w-28 truncate text-xs">
            {active ? t("reports.selectedBookings") : t("reports.serviceBookings")}
          </span>
        </div>
      </div>
      <div className="max-h-48 space-y-1 overflow-auto">
        {rows.map((row) => (
          <button
            key={row.label}
            type="button"
            aria-pressed={selected === row.label}
            onClick={() => select(row.label)}
            className={`focus-visible:outline-ink flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition focus-visible:outline-2 ${selected === row.label ? "bg-cream-deep" : "hover:bg-cream"}`}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: row.color }}
            />
            <span className="min-w-0 flex-1 break-words">{row.label}</span>
            <span className="text-ink-muted shrink-0 text-xs">
              {row.count} / {((row.count / total) * 100).toFixed(1)}%
            </span>
          </button>
        ))}
      </div>
      <p className="text-ink-muted mt-3 text-xs"> {t("reports.selectACategoryToHighlightItSelectAgainToReset")} </p>
    </div>
  );
}

export function StaffPerformanceChart({ data, currencyCode }) {
  const { t } = useTranslation();
  const [metric, setMetric] = useState("value");
  const [showAll, setShowAll] = useState(false);
  const ranked = data
    .filter((row) => row.id)
    .map((row) => ({ ...row, average: row.count ? row.value / row.count : 0 }))
    .sort((a, b) => b[metric] - a[metric]);
  const rows = showAll ? ranked : ranked.slice(0, 5);
  const label = {
    value: t("common.revenue"),
    count: t("common.completedVisits"),
    average: t("reports.averageSale"),
  }[metric];
  const format = (value) =>
    metric === "count"
      ? t("reports.visits", { value1: value })
      : formatCurrency(value, currencyCode);
  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="text-ink-muted flex items-center gap-2 text-xs"> {t("reports.rankBy")}{" "}
          <select
            aria-label={t("reports.staffRankingMetric")}
            className={controlClass}
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
          >
            <option value="value">{t("common.revenue")}</option>
            <option value="count">{t("common.completedVisits")}</option>
            <option value="average">{t("reports.averageSale")}</option>
          </select>
        </label>
        {ranked.length > 5 && (
          <button
            type="button"
            className={controlClass}
            aria-pressed={showAll}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? t("reports.showTop5") : t("reports.showAll", { value1: ranked.length })}
          </button>
        )}
      </div>
      {!rows.length ? (
        <p className="text-ink-muted py-12 text-center text-sm"> {t("reports.noStaffDataForThisPeriod")} </p>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto">
            <div
              style={{ height: Math.max(180, rows.length * 52 + 40) }}
              role="group"
              aria-label={t("reports.staffRankedByUseArrowKeysToExploreValues", { value1: label })}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rows}
                  layout="vertical"
                  accessibilityLayer
                  margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="#e8dfd5"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={compact}
                    allowDecimals={metric !== "count"}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(name) =>
                      name.length > 14 ? `${name.slice(0, 12)}...` : name
                    }
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    cursor={{ fill: "#eee5d980" }}
                    formatter={(value) => [format(value), label]}
                  />
                  <Bar
                    dataKey={metric}
                    name={label}
                    fill="#8c6f5a"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={24}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer py-2 font-semibold"> {t("reports.viewStaffValues")} </summary>
            <div className="max-h-56 overflow-auto">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="border-ink/10 flex justify-between gap-3 border-t py-2"
                >
                  <span>{row.name}</span>
                  <strong>{format(row[metric])}</strong>
                </div>
              ))}
            </div>
          </details>
          <p className="text-ink-muted mt-2 text-xs"> {t("reports.completedAppointmentsOnlyHoverTapOrUseArrowKeysFor")} </p>
        </>
      )}
    </div>
  );
}
