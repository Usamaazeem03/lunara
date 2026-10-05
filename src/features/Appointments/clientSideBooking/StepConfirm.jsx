import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n.js";
import calendarIcon from "../../../Shared/assets/icons/calendar.svg";
import checkIcon from "../../../Shared/assets/icons/checkmark-tick.svg";
import clockIcon from "../../../Shared/assets/icons/clock.svg";
import staffIcon from "../../../Shared/assets/icons/staff.svg";

const formatDateLabel = (activeDate) => {
  if (!activeDate) return i18n.t("booking.datePending");

  const day = activeDate.fullDay ?? activeDate.day;
  const date = activeDate.date ?? activeDate.fullDate;

  return [day, date].filter(Boolean).join(", ") || i18n.t("booking.datePending");
};

function StepConfirm({
  activeDate,
  activeTime,
  totalDurationLabel,
  activeStaff,
  selectedServiceList,
  totalPriceLabel,
}) {
  const { t } = useTranslation();
  const dateLabel = formatDateLabel(activeDate);
  const staffName = activeStaff?.name ?? t("booking.noPreference");
  const staffRole = activeStaff?.role ?? t("common.anyAvailableStylist");
  const staffRating = activeStaff?.rating ? t("booking.rating", { value1: activeStaff.rating }) : "";
  const selectedCount = selectedServiceList.length;
  const serviceCountLabel = t("booking.serviceSelected", { count: selectedCount });

  const reviewCards = [
    {
      label: t("common.date"),
      title: dateLabel,
      detail: activeTime,
      meta: t("booking.totalDuration", { value1: totalDurationLabel }),
      icon: calendarIcon,
      featured: true,
    },
    {
      label: t("common.time"),
      title: activeTime,
      detail: totalDurationLabel,
      meta: t("booking.salonScheduleConfirmed"),
      icon: clockIcon,
    },
    {
      label: t("nav.staff"),
      title: staffName,
      detail: staffRole,
      meta: staffRating,
      icon: staffIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase"> {t("booking.reviewDetails")} </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {reviewCards.map((card) => (
            <div
              key={card.label}
              className={`relative min-h-36 border-2 p-4 transition ${
                card.featured
                  ? "border-[#2d2620] bg-[#f3efe9]"
                  : "border-[#2d2620]/30 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-widest text-[#5f544b] uppercase">
                    {card.label}
                  </p>
                  <p className="mt-3 text-base leading-snug font-semibold text-[#2d2620]">
                    {card.title}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2d2620]/30 bg-white">
                  <img src={card.icon} alt="" className="h-5 w-5 opacity-70" />
                </span>
              </div>
              <p className="mt-3 text-sm text-[#5f544b]">{card.detail}</p>
              {card.meta && (
                <p className="mt-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase sm:text-xs">
                  {card.meta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-[#2d2620]/30 bg-white">
        <div className="flex flex-col gap-3 border-b-2 border-[#2d2620]/20 bg-[#f3efe9] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#5f544b] uppercase"> {t("nav.services")} </p>
            <p className="mt-1 text-lg font-semibold text-[#2d2620]">
              {serviceCountLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs tracking-widest text-[#2d2620] uppercase">
            <img src={checkIcon} alt="" className="h-4 w-4" /> {t("booking.readyToBook")} </div>
        </div>

        <div className="divide-y-2 divide-[#2d2620]/10">
          {selectedServiceList.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className="grid gap-2 p-4 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4"
            >
              <div>
                <p className="font-semibold text-[#2d2620]">{service.title}</p>
                {service.description && (
                  <p className="mt-1 text-xs text-[#5f544b]">
                    {service.description}
                  </p>
                )}
              </div>
              <span className="text-xs tracking-widest text-[#5f544b] uppercase">
                {service.duration}
              </span>
              <span className="text-sm font-semibold text-[#2d2620]">
                {service.price}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t-2 border-[#2d2620] bg-[#2d2620] px-4 py-3 text-[#f3efe9]">
          <span className="text-xs tracking-widest uppercase">{t("common.total")}</span>
          <span className="text-lg font-semibold">{totalPriceLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default StepConfirm;
