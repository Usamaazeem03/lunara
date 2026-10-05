import { translateConfig } from "../../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { BOOKING_STEPS } from "./bookingConfig.js";

export default function BookingStepNavigation({ step, goToStep }) {
  const { t } = useTranslation();
  const labels = [
    t("nav.services"),
    t("booking.dateTime"),
    t("common.stylist"),
    t("booking.customerDetails"),
    t("booking.emailVerification"),
  ];
  return (
    <nav
      aria-label={t("booking.bookingProgress")}
      className="border-ink/10 my-6 rounded-2xl border bg-white/70 p-3 sm:p-4"
    >
      <div className="text-ink-muted mb-3 flex items-center justify-between text-xs sm:hidden">
        <span className="text-ink font-semibold"> {t("booking.step")} {step} {t("booking.of")} {translateConfig(BOOKING_STEPS).length}
        </span>
        <span>{labels[step - 1]}</span>
      </div>
      <ol className="grid grid-cols-5 gap-1 sm:gap-3">
        {translateConfig(BOOKING_STEPS).map(({ title }, index) => {
          const number = index + 1;
          const active = step === number;
          const complete = number < step;
          return (
            <li key={title}>
              <button
                type="button"
                onClick={() => goToStep(number)}
                aria-label={t("booking.step2", { value1: number, value2: title })}
                aria-current={active ? "step" : undefined}
                className={`focus-visible:outline-ink flex min-h-14 w-full flex-col items-center justify-center gap-2 rounded-xl px-1 py-2 text-[10px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-row sm:text-sm ${active ? "bg-ink text-cream" : complete ? "bg-[#e9eee6] text-[#43563c]" : "text-ink-muted hover:bg-cream"}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${active ? "bg-white/15" : "bg-ink/5"}`}
                  aria-hidden="true"
                >
                  {complete ? "\u2713" : number}
                </span>
                <span>{labels[index]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
