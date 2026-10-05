import { fixedLabel } from "../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import AppHeader from "../../AppLayout/AppHeader";
import Button from "../../Shared/Button";
import { useReportsPage } from "./useReportsPage";
import { dateRangeOptions, exportReports } from "./reportsConstants";
import {
  ReportStatCard,
  RevenueTrendChart,
  ServicePie,
  StaffPerformanceChart,
  PaymentMethodRow,
} from "./ReportsCharts";
import {
  buildReport,
  downloadCsv,
  downloadPng,
  printReport,
} from "./reportExport";

const ReportsPage = () => {
  const { t } = useTranslation();
  const data = useReportsPage();
  const {
    dateRange,
    setDateRange,
    currencyCode,
    statCards,
    appointments,
    servicePopularity,
    staffPerformance,
    paymentMethods,
    isLoading,
    loadError,
  } = data;
  const [exporting, setExporting] = useState("");
  const [exportError, setExportError] = useState("");
  const report = buildReport(data);
  const period = report.period;
  async function handleExport(format, label) {
    if (exporting || isLoading || loadError) return;
    setExporting(format);
    setExportError("");
    try {
      if (format === "csv") downloadCsv(report, label);
      else if (format === "png") await downloadPng(report);
      else await printReport(report);
    } catch {
      setExportError(t("reports.exportFailedPleaseTryAgain"));
    } finally {
      setExporting("");
    }
  }
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <AppHeader
          eyebrow={t("nav.reports")}
          title={t("reports.reportsAnalytics")}
          description={t("reports.comprehensiveBusinessInsightsAndPerformanceMetrics")}
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label={t("reports.reportDateRange")}
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className="border-ink/30 text-ink border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase focus:outline-none"
          >
            {dateRangeOptions.map((option) => (
              <option key={option} value={option}>{fixedLabel(option, "range")}</option>
            ))}
          </select>
          <Button
            disabled={isLoading || !!loadError || !!exporting}
            onClick={() => handleExport("png")}
          >
            {exporting ? t("payments.preparing") : t("reports.exportPng3x")}
          </Button>
          <Button
            variant="primary"
            disabled={isLoading || !!loadError || !!exporting}
            onClick={() => handleExport("pdf")}
          > {t("reports.printSavePdf")} </Button>
        </div>
      </div>

      <p className="text-ink-muted text-sm">
        {period} {t("reports.revenueIncludesCompletedAppointmentsOnly")} </p>
      {(loadError || exportError) && (
        <p role="alert" className="text-red-700">
          {exportError ||
            t("reports.unableToLoadReportsPleaseRefreshAndTryAgain")}
        </p>
      )}
      {isLoading && <p role="status">{t("reports.loadingReportData")}</p>}
      <section className="grid gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <ReportStatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div className="border-ink/20 relative flex flex-col overflow-hidden border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t("reports.revenueTrend")}</h2>
              <p className="text-ink-muted text-sm"> {t("reports.completedRevenueForTheSelectedPeriodComparedWithThePreceding")} </p>
            </div>
            <span className="border-ink/30 bg-cream text-ink rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
              {dateRange}
            </span>
          </div>
          <div className="mt-4">
            <RevenueTrendChart
              key={dateRange}
              appointments={appointments}
              dateRange={dateRange}
              currencyCode={currencyCode}
            />
          </div>
        </div>

        <div className="border-ink/20 relative flex flex-col overflow-hidden border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t("reports.servicePopularity")}</h2>
              <p className="text-ink-muted text-sm"> {t("reports.bookingsByServiceCategory")} </p>
            </div>
            <span className="border-ink/30 bg-cream text-ink rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
              {dateRange}
            </span>
          </div>
          <div className="mt-4">
            <ServicePie data={servicePopularity} />
          </div>
        </div>
      </section>

      <section className="border-ink/20 relative flex flex-col overflow-hidden border-2 bg-white/90 p-4 sm:p-5">
        <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{t("reports.staffPerformance")}</h2>
            <p className="text-ink-muted text-sm"> {t("reports.revenueGeneratedByEachStaffMember")} </p>
          </div>
        </div>
        <div className="mt-4">
          <StaffPerformanceChart
            data={staffPerformance}
            currencyCode={currencyCode}
          />
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-ink/20 relative flex flex-col overflow-hidden border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold">{t("common.paymentMethods")}</h2>
            <p className="text-ink-muted text-sm"> {t("reports.distributionOfPaymentTypes")} </p>
          </div>
          <div className="mt-4 space-y-4">
            {paymentMethods.map((method) => (
              <PaymentMethodRow key={method.label} {...method} />
            ))}
          </div>
        </div>

        <div className="border-ink/20 relative flex flex-col overflow-hidden border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold">{t("reports.exportReports")}</h2>
            <p className="text-ink-muted text-sm"> {t("reports.csvReportsUseTheSelectedDatesPngAndPdfInclude")} </p>
          </div>
          <div className="mt-4 space-y-3">
            {exportReports.map((label) => (
              <div
                key={label}
                className="border-ink/10 bg-cream/50 flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3"
              >
                <span className="text-sm font-semibold">{label}</span>
                <button
                  type="button"
                  disabled={isLoading || !!loadError || !!exporting}
                  onClick={() => handleExport("csv", t(label))}
                  className="border-ink/30 text-ink hover:border-ink border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase transition"
                >
                  CSV
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ReportsPage;
