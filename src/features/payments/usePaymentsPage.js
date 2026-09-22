import { useAuth } from "../../hooks/useAuth";
import { notify } from "../../Shared/lib/toast";
import { useMemo, useState } from "react";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { useCurrencyCode } from "../settings/useCurrencyCode";
import { usePayments } from "./usePayments";
import {
  buildPaymentsCsv,
  filterPayments,
  getPaymentCharts,
  getPaymentSummary,
} from "./paymentUtils";
export function usePaymentsPage() {
  const { ownerId, isLoading: ownerLoading, error: ownerError } = useOwnerId();
  const {
    currencyCode,
    isLoading: currencyLoading,
    error: currencyError,
  } = useCurrencyCode(ownerId);
  const {
    appointments,
    isLoading: paymentsLoading,
    error,
    refetch,
    isFetching,
  } = usePayments(ownerId);
  const [search, setSearch] = useState("");
  const [invoiceFilters, setInvoiceFilters] = useState({ date: "", time: "" });
  const { profile } = useAuth();
  const [page, setPage] = useState(1);
  const [weekOffset, setWeekOffset] = useState(0);
  const summary = useMemo(
    () => getPaymentSummary(appointments),
    [appointments],
  );
  const charts = useMemo(
    () => getPaymentCharts(appointments, weekOffset),
    [appointments, weekOffset],
  );
  const filtered = useMemo(
    () => filterPayments(appointments, search, "completed", invoiceFilters),
    [appointments, search, invoiceFilters],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, totalPages);
  const isLoading = ownerLoading || paymentsLoading || currencyLoading;
  const loadError =
    ownerError?.message ||
    error?.message ||
    currencyError?.message ||
    (!isLoading && !ownerId ? "Please sign in to view payments." : "");
  async function downloadInvoice(appointment) {
    try {
      const { downloadAppointmentInvoice } =
        await import("./downloadInvoice.js");
      await downloadAppointmentInvoice(appointment, currencyCode, profile);
    } catch (error) {
      notify.error(error.message || "Unable to download this invoice.");
    }
  }
  function exportReport() {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", buildPaymentsCsv(filtered, currencyCode)], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "lunara-payment-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {
    summary,
    charts,
    currencyCode,
    isLoading,
    loadError,
    refetch,
    isFetching,
    search,
    setSearch: (value) => {
      setSearch(value);
      setPage(1);
    },
    invoiceFilters,
    setInvoiceFilter: (field, value) => {
      setInvoiceFilters((current) => ({ ...current, [field]: value }));
      setPage(1);
    },
    clearInvoiceFilters: () => {
      setSearch("");
      setInvoiceFilters({ date: "", time: "" });
      setPage(1);
    },
    weekOffset,
    setWeekOffset,
    currentPage,
    totalPages,
    setPage,
    rows: filtered.slice((currentPage - 1) * 10, currentPage * 10),
    totalRows: filtered.length,
    exportReport,
    downloadInvoice,
  };
}
