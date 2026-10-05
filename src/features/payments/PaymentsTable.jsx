import { useTranslation } from "react-i18next";
import PaymentRow from "./PaymentRow";
export default function PaymentsTable({
  rows,
  totalRows,
  currentPage,
  totalPages,
  onPageChange,
  currencyCode,
  onDownloadInvoice,
}) {
  const { t } = useTranslation();
  return (
    <section className="border-ink/20 mt-4 border-2 bg-white/90 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{t("payments.clientInvoices")}</h2>
          <p className="text-ink-muted mt-1 text-sm"> {t("payments.findAnyCompletedVisitAndDownloadAnInvoiceForYour")} </p>
        </div>
        <span className="text-ink-muted text-xs">
          {totalRows} {t("payments.completedVisits")} </span>
      </div>
      {rows.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-cream text-ink-muted text-xs tracking-widest uppercase">
              <tr>
                {[
                  t("common.date"),
                  t("common.client"),
                  t("common.service"),
                  t("common.amount"),
                  t("common.method"),
                  t("payments.bookingStatus"),
                  t("common.actions"),
                ].map((label) => (
                  <th key={label} scope="col" className="px-3 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((appointment) => (
                <PaymentRow
                  key={appointment.id}
                  appointment={appointment}
                  currencyCode={currencyCode}
                  onDownloadInvoice={onDownloadInvoice}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="border-ink/20 text-ink-muted mt-5 border-2 border-dashed p-6 text-center text-sm"> {t("payments.noCompletedVisitsMatchYourSearch")} </p>
      )}
      {totalPages > 1 && (
        <div className="border-ink/10 mt-4 flex items-center justify-between gap-3 border-t pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="border-ink/20 min-h-11 border-2 px-3 text-xs disabled:opacity-40"
          > {t("common.previous")} </button>
          <span className="text-ink-muted text-xs"> {t("payments.page2")} {currentPage} {t("booking.of")} {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="border-ink/20 min-h-11 border-2 px-3 text-xs disabled:opacity-40"
          > {t("payments.next")} </button>
        </div>
      )}
    </section>
  );
}
