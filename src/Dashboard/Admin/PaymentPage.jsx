import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../Shared/DashboardHeader";
import StatCards from "../Client/StatCards";
import Button from "../Shared/Button";

const PaymentPage = () => {
  const stats = [
    {
      title: "Today's Revenue",
      value: "GBP 1,250",
      subtitle: "+15% vs yesterday",
      icon: creditCardIcon,
    },
    {
      title: "This Week",
      value: "GBP 8,650",
      subtitle: "+23% vs last week",
      icon: calendarIcon,
    },
    {
      title: "This Month",
      value: "GBP 9,100",
      subtitle: "+18% vs last month",
      icon: giftIcon,
    },
    {
      title: "Pending Payments",
      value: "GBP 285",
      subtitle: "5 pending",
      icon: clockIcon,
    },
  ];

  const weeklyBreakdown = [
    { day: "Monday", value: 1250 },
    { day: "Tuesday", value: 1480 },
    { day: "Wednesday", value: 1320 },
    { day: "Thursday", value: 1650 },
    { day: "Friday", value: 1890 },
    { day: "Saturday", value: 2100 },
    { day: "Sunday", value: 980 },
  ];

  const maxWeeklyValue = Math.max(
    ...weeklyBreakdown.map((item) => item.value),
  );

  const paymentMethods = [
    {
      id: "pm-1",
      label: "Credit Card",
      share: "65% of payments",
      total: "GBP 5,915",
      icon: creditCardIcon,
    },
    {
      id: "pm-2",
      label: "Cash",
      share: "25% of payments",
      total: "GBP 2,275",
      icon: giftIcon,
    },
    {
      id: "pm-3",
      label: "Debit Card",
      share: "10% of payments",
      total: "GBP 910",
      icon: clockIcon,
    },
  ];

  const recentPayments = [
    {
      id: "PAY-201",
      date: "Mar 10, 2026",
      client: "Emily Parker",
      service: "Haircut & Style",
      amount: "GBP 85",
      method: "Card",
      status: "Paid",
    },
    {
      id: "PAY-202",
      date: "Mar 10, 2026",
      client: "Michael Chen",
      service: "Beard Trim",
      amount: "GBP 35",
      method: "Cash",
      status: "Paid",
    },
    {
      id: "PAY-203",
      date: "Mar 09, 2026",
      client: "Sarah Williams",
      service: "Hair Coloring",
      amount: "GBP 150",
      method: "Card",
      status: "Paid",
    },
    {
      id: "PAY-204",
      date: "Mar 09, 2026",
      client: "James Brown",
      service: "Relax Massage",
      amount: "GBP 90",
      method: "Wallet",
      status: "Pending",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <DashboardHeader
        eyebrow="Payments"
        title="Payments & Revenue"
        description="Track your income and payment status."
      >
        <Button variant="primary">Export Report</Button>
      </DashboardHeader>

      <StatCards stats={stats} lgGridCols={4} />

      <section className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Weekly Breakdown</h2>
              <p className="text-sm text-ink-muted">
                Revenue performance by day.
              </p>
            </div>
            <span className="rounded-full border-2 border-ink/30 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink">
              Last 7 days
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {weeklyBreakdown.map((item) => {
              const percent = Math.round((item.value / maxWeeklyValue) * 100);
              return (
                <div key={item.day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{item.day}</span>
                    <span className="text-ink-muted">GBP {item.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full border border-ink/20 bg-cream">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Payment Methods</h2>
              <p className="text-sm text-ink-muted">
                Share of total revenue by method.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between gap-3 border-2 border-ink/20 bg-cream/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink/20 bg-white">
                    <img
                      src={method.icon}
                      alt=""
                      className="h-5 w-5 opacity-70"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{method.label}</p>
                    <p className="text-xs text-ink-muted">{method.share}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{method.total}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 flex flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recent Payments</h2>
            <p className="text-sm text-ink-muted">
              Latest transactions and payment status.
            </p>
          </div>
          <button className="border-2 border-ink px-3 py-1 text-[0.65rem] uppercase tracking-widest transition hover:bg-ink hover:text-cream">
            View all
          </button>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="hidden border-b-2 border-ink/10 bg-cream px-4 py-3 text-xs uppercase tracking-widest text-ink-muted sm:grid sm:grid-cols-[1fr_1.2fr_1.4fr_0.9fr_0.8fr_0.9fr_0.8fr]">
            <span>Date</span>
            <span>Client</span>
            <span>Service</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="scrollbar-hidden overflow-y-auto">
            {recentPayments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

const PaymentRow = ({ payment }) => {
  const statusStyles = {
    Paid: "border-ink bg-ink text-cream",
    Pending: "border-ink/30 bg-cream text-ink",
    Refunded: "border-ink/30 text-ink-muted",
  };

  return (
    <div className="grid gap-3 border-b border-ink/10 px-4 py-3 text-sm transition hover:bg-cream/50 sm:grid-cols-[1fr_1.2fr_1.4fr_0.9fr_0.8fr_0.9fr_0.8fr] sm:items-center">
      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Date
      </p>
      <span>{payment.date}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Client
      </p>
      <span className="font-semibold">{payment.client}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Service
      </p>
      <span>{payment.service}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Amount
      </p>
      <span className="font-semibold">{payment.amount}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Method
      </p>
      <span>{payment.method}</span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Status
      </p>
      <span
        className={`w-fit rounded-full border-2 px-3 py-1 text-[0.65rem] uppercase tracking-widest ${
          statusStyles[payment.status] ?? "border-ink/30 text-ink-muted"
        }`}
      >
        {payment.status}
      </span>

      <p className="text-xs uppercase tracking-widest text-ink-muted sm:hidden">
        Actions
      </p>
      <button className="w-fit border-2 border-ink px-3 py-1 text-xs uppercase tracking-widest transition hover:bg-ink hover:text-cream">
        Invoice
      </button>
    </div>
  );
};

export default PaymentPage;
