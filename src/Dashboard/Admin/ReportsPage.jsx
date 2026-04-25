import { useState } from "react";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import Button from "../../Shared/Button";

const ReportsPage = () => {
  const tabs = [
    "Overview",
    "Revenue",
    "Staff Performance",
    "Services",
    "Client Retention",
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const statCards = [
    {
      title: "Total Revenue",
      value: "GBP 29,800",
      subtitle: "Last 30 days",
      delta: "+18.5%",
      icon: creditCardIcon,
    },
    {
      title: "Total Appointments",
      value: "453",
      subtitle: "Last 30 days",
      delta: "+12.3%",
      icon: calendarIcon,
    },
    {
      title: "New Clients",
      value: "28",
      subtitle: "Last 30 days",
      delta: "+8.2%",
      icon: giftIcon,
    },
    {
      title: "Avg Rating",
      value: "4.8",
      subtitle: "All time average",
      delta: "+0.3",
      icon: clockIcon,
    },
  ];

  const palette = {
    ink: "var(--color-ink)",
    inkMuted: "var(--color-ink-muted)",
    cream: "var(--color-cream)",
    creamDeep: "var(--color-cream-deep)",
    creamAlt: "var(--color-cream-alt)",
    danger: "var(--color-danger)",
    warmMid: "#8c6f5a",
    warmSoft: "#cbb9a6",
  };

  const revenueTrend = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    actual: [4200, 3800, 5100, 4600, 6200, 5800],
    target: [4000, 3900, 4500, 4500, 5000, 5200],
  };

  const servicePopularity = [
    { label: "Haircut", value: 32, color: palette.ink },
    { label: "Grooming", value: 22, color: palette.warmMid },
    { label: "Coloring", value: 15, color: palette.danger },
    { label: "Treatment", value: 12, color: palette.creamDeep },
    { label: "Spa", value: 20, color: palette.inkMuted },
  ];

  const staffPerformance = [
    { name: "Alex Johnson", value: 7200 },
    { name: "Sarah Martinez", value: 6800 },
    { name: "David Chen", value: 6400 },
    { name: "Emma Williams", value: 7100 },
  ];

  const paymentMethods = [
    { label: "Cash", value: "GBP 6,825", percent: 35, color: palette.ink },
    {
      label: "Card",
      value: "GBP 8,190",
      percent: 42,
      color: palette.warmMid,
    },
    {
      label: "UPI",
      value: "GBP 3,510",
      percent: 18,
      color: palette.inkMuted,
    },
    {
      label: "Online",
      value: "GBP 975",
      percent: 5,
      color: palette.danger,
    },
  ];

  const exportReports = [
    "Daily Sales Report",
    "Monthly Revenue Report",
    "Staff Performance Report",
    "Client Retention Report",
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <DashboardHeader
          eyebrow="Reports"
          title="Reports & Analytics"
          description="Comprehensive business insights and performance metrics."
        />
        <div className="flex flex-wrap items-center gap-2">
          <select className="border-2 border-ink/30 bg-white px-4 py-2 text-xs uppercase tracking-widest text-ink focus:outline-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <Button variant="primary">Export PDF</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-ink/20 bg-white/90 p-2">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs uppercase tracking-widest transition ${
                isActive ? "bg-ink text-cream" : "text-ink-muted hover:bg-cream"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <section className="grid gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <ReportStatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Revenue Trend</h2>
              <p className="text-sm text-ink-muted">
                Monthly revenue vs target.
              </p>
            </div>
            <span className="rounded-full border-2 border-ink/30 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink">
              Updated
            </span>
          </div>
          <div className="mt-4">
            <RevenueTrendChart
              labels={revenueTrend.labels}
              actual={revenueTrend.actual}
              target={revenueTrend.target}
            />
          </div>
        </div>

        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Service Popularity</h2>
              <p className="text-sm text-ink-muted">
                Bookings by service category.
              </p>
            </div>
            <span className="rounded-full border-2 border-ink/30 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink">
              This month
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <ServicePie data={servicePopularity} />
            <div className="grid gap-2 text-sm">
              {servicePopularity.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-ink-muted">{item.label}</span>
                  <span className="text-ink">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Staff Performance</h2>
            <p className="text-sm text-ink-muted">
              Revenue generated by each staff member.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <StaffPerformanceChart data={staffPerformance} />
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <div>
            <h2 className="text-lg font-semibold">Payment Methods</h2>
            <p className="text-sm text-ink-muted">
              Distribution of payment types.
            </p>
          </div>
          <div className="mt-4 space-y-4">
            {paymentMethods.map((method) => (
              <PaymentMethodRow key={method.label} {...method} />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <div>
            <h2 className="text-lg font-semibold">Export Reports</h2>
            <p className="text-sm text-ink-muted">
              Download detailed reports in your preferred format.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {exportReports.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink/10 bg-cream/50 px-4 py-3"
              >
                <span className="text-sm font-semibold">{label}</span>
                <button className="border-2 border-ink/30 px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink transition hover:border-ink">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

const ReportStatCard = ({ title, value, subtitle, delta, icon }) => {
  return (
    <div className="relative overflow-hidden border-2 border-ink/20 bg-white/90 p-4">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-ink/5"></div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/20 bg-cream">
          <img src={icon} alt="" className="h-5 w-5 opacity-70" />
        </div>
        <span className="rounded-full border-2 border-ink/20 bg-cream-deep px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink">
          {delta}
        </span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-ink-muted">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>
    </div>
  );
};

const RevenueTrendChart = ({ labels, actual, target }) => {
  const chartWidth = 300;
  const chartHeight = 140;
  const maxValue = Math.max(...actual, ...target);
  const minValue = Math.min(...actual, ...target);
  const range = Math.max(maxValue - minValue, 1);

  const buildPoints = (values) =>
    values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * chartWidth;
        const y = chartHeight - ((value - minValue) / range) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");

  const actualPoints = buildPoints(actual);
  const targetPoints = buildPoints(target);
  const areaPoints = `0,${chartHeight} ${actualPoints} ${chartWidth},${chartHeight}`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-44 w-full"
        role="img"
        aria-label="Revenue trend chart"
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((index) => {
          const y = (chartHeight / 4) * index;
          return (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="rgba(45, 38, 32, 0.1)"
              strokeWidth="1"
            />
          );
        })}
        <polygon points={areaPoints} fill="url(#revenueFill)" />
        <polyline
          points={targetPoints}
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <polyline
          points={actualPoints}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        {actual.map((value, index) => {
          const x = (index / (actual.length - 1)) * chartWidth;
          const y = chartHeight - ((value - minValue) / range) * chartHeight;
          return (
            <circle key={value} cx={x} cy={y} r="3" fill="var(--color-ink)" />
          );
        })}
      </svg>
      <div className="mt-2 grid grid-cols-6 text-xs uppercase tracking-widest text-ink-muted">
        {labels.map((label) => (
          <span key={label} className="text-center">
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs uppercase tracking-widest text-ink-muted">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ink" />
          Actual Revenue
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ink-muted" />
          Target
        </span>
      </div>
    </div>
  );
};

const ServicePie = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 24;

  return (
    <svg
      viewBox="0 0 140 140"
      className="h-44 w-44"
      role="img"
      aria-label="Service popularity pie chart"
    >
      <g transform="translate(70,70) rotate(-90)">
        {data.map((slice) => {
          const value = (slice.value / total) * circumference;
          const offset = (cumulative / total) * circumference;
          cumulative += slice.value;
          return (
            <circle
              key={slice.label}
              r={radius}
              cx="0"
              cy="0"
              fill="transparent"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${value} ${circumference - value}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
};

const StaffPerformanceChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.map((item) => {
        const height = Math.round((item.value / maxValue) * 140);
        return (
          <div key={item.name} className="flex flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end justify-center">
              <div
                className="w-full rounded-xl border border-ink/10"
                style={{
                  height: `${height}px`,
                  background:
                    "linear-gradient(180deg, var(--color-ink) 0%, var(--color-cream-deep) 100%)",
                }}
              />
            </div>
            <p className="text-xs uppercase tracking-widest text-ink-muted">
              {item.name}
            </p>
            <p className="text-sm font-semibold">GBP {item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

const PaymentMethodRow = ({ label, value, percent, color }) => {
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
          <p className="text-xs text-ink-muted">{percent}%</p>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-ink/20 bg-cream">
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

export default ReportsPage;
