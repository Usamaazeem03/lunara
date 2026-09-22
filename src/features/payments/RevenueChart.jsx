import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../utils/currency";

export default function RevenueChart({
  charts,
  currencyCode,
  weekOffset,
  onWeekChange,
}) {
  return (
    <section className="border-ink/20 min-w-0 border-2 bg-white/90 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Weekly Revenue</h2>
          <p className="text-ink-muted mt-1 text-sm">
            Completed visits by appointment date.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => onWeekChange(weekOffset - 1)}
            className="border-ink/20 hover:border-ink h-11 w-11 border-2"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => onWeekChange(0)}
            disabled={weekOffset === 0}
            className="border-ink/20 min-h-11 border-2 px-3 text-xs disabled:opacity-50"
          >
            This week
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => onWeekChange(weekOffset + 1)}
            disabled={weekOffset >= 0}
            className="border-ink/20 hover:border-ink h-11 w-11 border-2 disabled:opacity-30"
          >
            &rarr;
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-ink-muted text-xs">
          {charts.start} to {charts.end}
        </p>
        <p className="text-xl font-semibold">
          {formatCurrency(charts.total, currencyCode)}
        </p>
      </div>
      <div
        className="mt-5 h-64 w-full"
        aria-label="Daily completed appointment revenue"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={charts.days}
            accessibilityLayer
            margin={{ top: 10, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(45,38,32,0.1)" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5f544b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5f544b", fontSize: 11 }}
              width={55}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ fill: "#f3efe9" }}
              formatter={(value) => [
                formatCurrency(value, currencyCode),
                "Revenue",
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
              contentStyle={{
                border: "2px solid #2d262033",
                borderRadius: 0,
                background: "#fff",
              }}
            />
            <Bar dataKey="revenue" fill="#2d2620" maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {charts.total === 0 && (
        <p className="text-ink-muted mt-3 text-center text-sm">
          No completed revenue for this week.
        </p>
      )}
      <details className="text-ink-muted mt-3 text-xs">
        <summary className="cursor-pointer py-2">View daily amounts</summary>
        <dl className="grid grid-cols-2 gap-2">
          {charts.days.map((day) => (
            <div key={day.date}>
              <dt>{day.date}</dt>
              <dd>{formatCurrency(day.revenue, currencyCode)}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
