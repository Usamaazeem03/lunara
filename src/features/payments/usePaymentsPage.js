import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
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
  const { t } = useTranslation();
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
    [appointments, i18n.resolvedLanguage],
  );
  const charts = useMemo(
    () => getPaymentCharts(appointments, weekOffset),
    [appointments, weekOffset, i18n.resolvedLanguage],
  );
  const filtered = useMemo(
    () => filterPayments(appointments, search, "completed", invoiceFilters),
    [appointments, search, invoiceFilters, i18n.resolvedLanguage],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, totalPages);
  const isLoading = ownerLoading || paymentsLoading || currencyLoading;
  const loadError =
    ownerError?.message ||
    error?.message ||
    currencyError?.message ||
    (!isLoading && !ownerId ? t("payments.pleaseSignInToViewPayments") : "");
  async function downloadInvoice(appointment) {
    try {
      const { downloadAppointmentInvoice } =
        await import("./downloadInvoice.js");
      await downloadAppointmentInvoice(appointment, currencyCode, profile);
    } catch (error) {
      notify.error(error.message || translatedMessage("payments.unableToDownloadThisInvoice"));
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
