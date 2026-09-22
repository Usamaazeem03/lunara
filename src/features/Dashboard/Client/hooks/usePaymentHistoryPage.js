import {
  statsPaymentHistory,
  transactions,
  paymentMethods,
  filterTabs,
  spendingSummaryItems,
} from "../data/paymentHistoryPageData.js";
import { useState } from "react";

// Demo dashboard data is kept here until these screens have API endpoints.
export function usePaymentHistoryPage() {
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

  return {
    statsPaymentHistory,
    transactions,
    paymentMethods,
    filterTabs,
    spendingSummaryItems,
    filterCounts,
    filteredTransactions,
    activeFilter,
    setActiveFilter,
  };
}
