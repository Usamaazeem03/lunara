import { useTranslation } from "react-i18next";
import AppHeader from "../../AppLayout/AppHeader";
import Button from "../../Shared/Button";
import { usePaymentsPage } from "./usePaymentsPage";
import PaymentsStats from "./PaymentsStats";
import RevenueChart from "./RevenueChart";
import PaymentMethodsChart from "./PaymentMethodsChart";
import PaymentFilter from "./PaymentFilter";
import PaymentsTable from "./PaymentsTable";

export default function PaymentsPage() {
  const { t } = useTranslation();
  const {
    summary,
    charts,
    currencyCode,
    isLoading,
    loadError,
    refetch,
    isFetching,
    search,
    setSearch,
    invoiceFilters,
    setInvoiceFilter,
    clearInvoiceFilters,
    weekOffset,
    setWeekOffset,
    currentPage,
    totalPages,
    setPage,
    rows,
    totalRows,
    exportReport,
    downloadInvoice,
  } = usePaymentsPage();
  return (
    <section className="flex h-full flex-col pb-6">
      <AppHeader
        eyebrow={t("marketing.payments")}
        title={t("payments.paymentsRevenue")}
        description={t("payments.completedVisitsCountAsRevenuePendingAndConfirmedBookingsStay")}
      >
        <Button
          variant="secondary"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? t("dashboard.refreshing") : t("payments.refresh")}
        </Button>
        <Button
          variant="primary"
          onClick={exportReport}
          disabled={isLoading || Boolean(loadError) || !totalRows}
        > {t("payments.exportReport")} </Button>
      </AppHeader>
      {isLoading ? (
        <p
          role="status"
          className="text-ink-muted border-ink/20 mt-5 border-2 bg-white/90 p-8 text-center"
        > {t("payments.loadingPayments")} </p>
      ) : loadError ? (
        <div
          role="alert"
          className="border-danger/40 bg-danger/10 text-danger mt-5 border-2 p-4"
        >
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-3 min-h-11 underline"
          > {t("common.tryAgain")} </button>
        </div>
      ) : (
        <>
          <PaymentsStats summary={summary} currencyCode={currencyCode} />
          <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <RevenueChart
              charts={charts}
              currencyCode={currencyCode}
              weekOffset={weekOffset}
              onWeekChange={setWeekOffset}
            />
            <PaymentMethodsChart
              methods={charts.methods}
              currencyCode={currencyCode}
            />
          </div>
          <PaymentFilter
            search={search}
            onSearchChange={setSearch}
            filters={invoiceFilters}
            onFilterChange={setInvoiceFilter}
            onClear={clearInvoiceFilters}
          />
          <PaymentsTable
            rows={rows}
            totalRows={totalRows}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            currencyCode={currencyCode}
            onDownloadInvoice={downloadInvoice}
          />
        </>
      )}
    </section>
  );
}
