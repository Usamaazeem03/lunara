import { useState } from "react";
import calendarIcon from "../../../assets/icons/calendar.svg";
import clockIcon from "../../../assets/icons/clock.svg";
import creditCardIcon from "../../../assets/icons/credit-card.svg";
import DashboardHeader from "../../Shared/DashboardHeader";
import Button from "../../Shared/Button";
import InfoCard from "../InfoCard";
import StatCards from "../StatCards";
import Checklist from "../../../components/Checklist";
import Note from "../../../components/Note";

const PaymentHistoryPage = () => {
  const statsPaymentHistory = [
    {
      title: "Total Spent",
      value: "GBP 530",
      subtitle: "All time",
      icon: creditCardIcon,
    },
    {
      title: "This Month",
      value: "GBP 114",
      subtitle: "February 2026",
      icon: calendarIcon,
    },
    {
      title: "Pending",
      value: "GBP 0",
      subtitle: "Outstanding balance",
      icon: clockIcon,
    },
  ];

  const transactions = [
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-104",
      date: "08/02/2026",
      service: "Classic Haircut",
      staff: "Alex Johnson",
      amount: "GBP 45",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-103",
      date: "01/18/2026",
      service: "Glow Facial",
      staff: "Ava Lee",
      amount: "GBP 75",
      method: "Card",
      status: "Paid",
    },
    {
      id: "TRX-102",
      date: "12/21/2025",
      service: "Relax Massage",
      staff: "No Preference",
      amount: "GBP 85",
      method: "Wallet",
      status: "Paid",
    },
  ];

  const paymentMethods = [
    {
      id: "card-4242",
      label: "**** **** **** 4242",
      meta: "Expires 12/26",
      status: "Default",
    },
  ];

  const filterTabs = [
    { key: "All", label: "All" },
    { key: "Paid", label: "Paid" },
    { key: "Pending", label: "Pending" },
    { key: "Refunded", label: "Refunded" },
  ];

  const spendingSummaryItems = [
    { label: "Hair Services", detail: "GBP 210" },
    { label: "Skin Treatments", detail: "GBP 175" },
    { label: "Massage", detail: "GBP 145" },
  ];

  const [activeFilter, setActiveFilter] = useState(filterTabs[0].key);

  const statusCounts = transactions.reduce((acc, transaction) => {
    const status = transaction.status;
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  const filterCounts = {
    All: transactions.length,
    ...statusCounts,
  };

  const filteredTransactions =
    activeFilter === "All"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.status === activeFilter,
        );

  return (
    <section className="flex h-full flex-col">
      {/* <header className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-[#e9e1d8] px-4 py-1 text-xs uppercase tracking-widest text-[#5f544b]">
          Payment History
        </span>
        <h1 className="text-3xl font-semibold tracking-wide sm:text-4xl">
          Payment History
        </h1>
        <p className="max-w-2xl text-sm text-[#5f544b] sm:text-base">
          View all your transactions, receipts, and saved payment methods.
        </p>
      </header> */}
      <DashboardHeader
        eyebrow={"Payment History"}
        title={"Payment History"}
        description={`View all your transactions, receipts, and saved payment methods.`}
      />
      <InfoCard
        layout="inline"
        title={`GBP 0 outstanding`}
        label="Current Balance"
        meta={`Next statement: March 31, 2026`}
        padding="px-3 py-1.5"
        className="mt-3 border-2 border-[#2d2620] bg-[#f3efe9]"
      />

      {/* <div className="mt-3 flex flex-wrap items-center gap-3 border-2 border-[#2d2620] bg-[#f3efe9] px-4 py-2">
        <span className="text-[0.65rem] uppercase tracking-widest text-[#5f544b]">
          Current Balance
        </span>
        <span className="text-sm font-semibold">GBP 0 outstanding</span>
        <span className="text-xs text-[#5f544b]">
          Next statement: March 31, 2026
        </span>
      </div> */}

      {/* <section className="mt-4 grid gap-3 sm:grid-cols-3">
        {statsPaymentHistory.map((stat) => (
          <SummaryCard key={stat.title} {...stat} />
        ))}
      </section> */}
      <StatCards stats={statsPaymentHistory} lgGridCols={3} />

      <section className="mt-5 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative flex min-h-0 flex-col border-2 border-[#2d2620]/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#2d2620]/5"></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Transaction History</h2>
              <p className="max-w-xl text-sm text-[#5f544b]">
                All your payment records in one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#2d2620]">
                {filteredTransactions.length} records
              </span>
            </div>
          </div>

          <div className="mt-3 grid w-full grid-cols-1 overflow-hidden border-2 border-[#2d2620]/20 text-xs uppercase tracking-widest sm:grid-cols-4">
            {filterTabs.map((tab, index) => {
              const isActive = tab.key === activeFilter;
              const isLast = index === filterTabs.length - 1;
              const count = filterCounts[tab.key] ?? 0;
              return (
                <Button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  variant="custom"
                  unstyled
                  className={`flex items-center justify-center gap-2 px-3 py-2 text-center transition ${
                    isActive ? "bg-[#f3efe9]" : "bg-white"
                  } ${
                    !isLast
                      ? "border-b-2 border-[#2d2620]/20 sm:border-b-0 sm:border-r-2"
                      : ""
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{tab.label}</span>
                  <span className="rounded-full border border-[#2d2620]/40 px-2 py-0.5 text-[0.65rem]">
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            <div className="hidden border-b-2 border-[#2d2620]  bg-[#f3efe9] text-xs uppercase tracking-widest text-[#5f544b] sm:grid sm:grid-cols-[1fr_1.4fr_1fr_0.8fr_0.7fr_0.7fr_0.9fr]">
              <span className=" px-3 py-2">Date</span>
              <span className=" px-3 py-2">Service</span>
              <span className=" px-3 py-2">Staff</span>
              <span className=" px-3 py-2">Amount</span>
              <span className=" px-3 py-2">Method</span>
              <span className=" px-3 py-2">Status</span>
              <span className="px-3 py-2">Actions</span>
            </div>

            <div className="scrollbar-hidden flex-1 overflow-y-auto bg-white/80 pr-2">
              {filteredTransactions.map((item) => (
                <TransactionRow key={item.id} transaction={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="border-2 border-[#2d2620]/20 bg-white/90 p-4 sm:p-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Saved Payment Methods</h2>
              <p className="text-sm text-[#5f544b]">
                Manage your payment options.
              </p>
            </div>

            <div className="mt-3 space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between gap-3 border-2 border-[#2d2620]/30 bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
                      <img
                        src={creditCardIcon}
                        alt=""
                        className="h-5 w-5 opacity-70"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{method.label}</p>
                      <p className="text-xs text-[#5f544b]">{method.meta}</p>
                    </div>
                  </div>
                  <span className="rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#2d2620]">
                    {method.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-3 w-full border-2 border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
              Add New Payment Method
            </button>
          </div>

          <Checklist title="Spending Summary" items={spendingSummaryItems} />
          <Note
            title={"Payment Support"}
            primaryText={"Need help with a receipt or refund?"}
            secondaryText={
              " Reach out to the front desk and we will take care of it."
            }
          />

          {/* <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-4 text-sm">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Payment Support
            </p>
            <p className="mt-2 font-semibold">
              Need help with a receipt or refund?
            </p>
            <p className="text-xs text-[#5f544b]">
              Reach out to the front desk and we will take care of it.
            </p>
          </div> */}
        </div>
      </section>
    </section>
  );
};

// const SummaryCard = ({ title, value, subtitle, icon }) => {
//   return (
//     <div className="relative flex items-center justify-between gap-4 border-2 border-[#2d2620] bg-white/90 px-4 py-2.5">
//       <div className="absolute -right-6 -top-6 h-14 w-14 rounded-full bg-[#2d2620]/5"></div>
//       <div>
//         <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//           {title}
//         </p>
//         <p className="mt-2 text-xl font-semibold">{value}</p>
//         <p className="text-xs text-[#5f544b]">{subtitle}</p>
//       </div>
//       <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
//         <img src={icon} alt="" className="h-6 w-6 opacity-70" />
//       </div>
//     </div>
//   );
// };

const TransactionRow = ({ transaction }) => {
  return (
    <div className="grid gap-3 px-4 py-2.5 text-sm transition hover:bg-[#f3efe9]/60 sm:grid-cols-[1fr_1.4fr_1fr_0.8fr_0.7fr_0.7fr_0.9fr] sm:items-center">
      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Date
      </p>
      <p>{transaction.date}</p>

      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Service
      </p>
      <p className="font-semibold">{transaction.service}</p>

      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Staff
      </p>
      <p>{transaction.staff}</p>

      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Amount
      </p>
      <p>{transaction.amount}</p>

      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Method
      </p>
      <p>{transaction.method}</p>

      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Status
      </p>
      <span className="w-fit rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#2d2620]">
        {transaction.status}
      </span>

      <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
        Actions
      </p>
      <button className="w-fit border-2 border-[#2d2620] px-3 py-1 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
        Invoice
      </button>
    </div>
  );
};

export default PaymentHistoryPage;
