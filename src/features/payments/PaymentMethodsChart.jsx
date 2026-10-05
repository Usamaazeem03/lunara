import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/currency";
const COLORS = [
  "#2d2620",
  "#8a8179",
  "#b59b79",
  "#79846e",
  "#ad7c68",
  "#c6b9a6",
];
export default function PaymentMethodsChart({ methods, currencyCode }) {
  const { t } = useTranslation();
  const chartData = methods.filter((method) => method.value > 0);
  return (
    <section className="border-ink/20 min-w-0 border-2 bg-white/90 p-4 sm:p-5">
      <h2 className="text-lg font-semibold">{t("common.paymentMethods")}</h2>
      <p className="text-ink-muted mt-1 text-sm"> {t("payments.completedRevenueForTheSelectedWeek")} </p>
      {chartData.length ? (
        <>
          <div
            className="h-52 w-full"
            aria-label={t("payments.revenueByRecordedPaymentMethod")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {chartData.map((method, index) => (
                    <Cell
                      key={method.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value, currencyCode)}
                  contentStyle={{
                    border: "2px solid #2d262033",
                    borderRadius: 0,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2">
            {chartData.map((method, index) => (
              <li
                key={method.name}
                className="border-ink/10 flex items-center justify-between gap-3 border-b py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span>
                    {method.name}
                    <span className="text-ink-muted ml-2 text-xs">
                      {method.share.toFixed(1)}%
                    </span>
                  </span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(method.value, currencyCode)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="border-ink/20 bg-cream text-ink-muted mt-5 border-2 border-dashed p-8 text-center text-sm"> {t("payments.noPaymentMethodBreakdownForThisWeek")} </div>
      )}
    </section>
  );
}
