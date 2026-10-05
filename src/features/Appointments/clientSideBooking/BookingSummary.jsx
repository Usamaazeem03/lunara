import { useTranslation } from "react-i18next";
export default function BookingSummary({
  rewardCode,
  rewardMessage,
  setRewardCode,
  isSubmitting,
  services,
  totalPriceLabel,
  totalDurationLabel,
  activeDate,
  activeTime,
  activeStaff,
}) {
  const { t } = useTranslation();
  return (
    <details
      open
      className="group border-ink/10 rounded-2xl border bg-white/70 p-5 lg:sticky lg:top-4"
    >
      <summary className="text-ink flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden"> {t("booking.yourAppointment")}{" "}
        <span
          className="text-ink-muted transition group-open:rotate-180"
          aria-hidden="true"
        >
          &#8964;
        </span>
      </summary>
      <div className="mt-3 space-y-4">
        <label className="block text-sm font-medium">{t("booking.rewardCode")} <input value={rewardCode} onChange={(event) => setRewardCode(event.target.value)} disabled={isSubmitting} maxLength={64} autoComplete="off" placeholder={t("booking.enterYourPersonalCode")} className="mt-2 w-full rounded-xl border border-ink/20 p-3 font-mono text-xs" />
          <span className="mt-2 block text-xs font-normal text-ink-muted">{t("booking.oneUseAtTheIssuingSalonOnlyCancelledBookingsDo")}</span>
          {rewardMessage && <span role="status" className="mt-2 block text-xs font-normal">{rewardMessage}</span>}
        </label>
        {services.length ? (
          <ul className="space-y-3">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <span>
                  {service.title}
                  <span className="text-ink-muted mt-1 block text-xs">
                    {service.duration}
                  </span>
                </span>
                <span className="shrink-0 font-medium">{service.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted text-sm leading-6"> {t("booking.aLittleTimeForYouStartByChoosingYourServices")} </p>
        )}
        {activeDate && (
          <div className="bg-cream/80 rounded-xl p-3 text-sm leading-6">
            <p>
              {activeDate.fullDay}, {activeDate.date}
              {activeTime ? ` · ${activeTime}` : ""}
            </p>
            <p className="text-ink-muted">
              {activeStaff?.name || t("common.anyAvailableStylist")}
            </p>
          </div>
        )}
        <div className="border-ink/10 flex items-center justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-sm font-semibold">{t("common.total")}</p>
            <p className="text-ink-muted text-xs">{totalDurationLabel}</p>
          </div>
          <p className="text-xl font-semibold">{totalPriceLabel}</p>
        </div>
      </div>
    </details>
  );
}
