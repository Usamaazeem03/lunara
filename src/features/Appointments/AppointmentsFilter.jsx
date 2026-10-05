import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

import Button from "../../Shared/Button.jsx";
import Icon from "../../Shared/ui/Icon.jsx";

const VIEW_TABS = [
  { key: "list", labelKey: "appointments.listView" },
  { key: "calendar", labelKey: "appointments.calendarView" },
];

const STATUS_FILTERS = [
  { key: "all", labelKey: "appointments.allStatuses" },
  { key: "Pending", labelKey: "common.pending" },
  { key: "Confirmed", labelKey: "common.confirmed" },
  { key: "Completed", labelKey: "common.completed" },
  { key: "Cancelled", labelKey: "common.cancelled" },
];

const AppointmentsFilter = ({
  activeView,
  setActiveView,
  selectedDate,
  setSelectedDate,
  getTodayIsoDate,
  selectedStatus,
  setSelectedStatus,
}) => {
  const { t } = useTranslation();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!filterRef.current?.contains(event.target)) {
        setIsStatusMenuOpen(false);
        setIsDateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      ref={filterRef}
      className="border-ink/20 flex flex-wrap items-center justify-between gap-3 border-2 bg-white/90 p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {translateConfig(VIEW_TABS).map((tab, index) => {
          const isActive = tab.key === activeView;
          const isLast = index === translateConfig(VIEW_TABS).length - 1;
          return (
            <Button
              key={tab.key}
              type="button"
              onClick={() => setActiveView(tab.key)}
              variant="custom"
              unstyled
              className={`flex items-center justify-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
                isActive ? "bg-cream" : "bg-white"
              } ${!isLast ? "border-ink/20 border-r-2" : ""} border-ink/20 border-2`}
              aria-pressed={isActive}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusMenuOpen((isOpen) => !isOpen)}
            className={`border-ink/20 hover:border-ink flex h-9 w-9 items-center justify-center border-2 bg-white/90 transition ${
              selectedStatus !== "all" ? "bg-cream" : ""
            }`}
            aria-label={t("appointments.filterAppointmentsByStatus")}
            aria-expanded={isStatusMenuOpen}
            title={t("appointments.filterByStatus")}
          >
            <Icon
              name="filter-list"
              size={16}
              className="text-ink opacity-70"
            />
          </button>

          {isStatusMenuOpen && (
            <div className="border-ink/30 absolute top-full right-0 z-20 mt-2 min-w-44 border-2 bg-white p-1 shadow-lg">
              {translateConfig(STATUS_FILTERS).map((status) => (
                <button
                  key={status.key}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(status.key);
                    setIsStatusMenuOpen(false);
                  }}
                  className={`text-ink hover:bg-cream flex w-full items-center justify-between px-3 py-2 text-left text-xs tracking-widest uppercase transition ${
                    selectedStatus === status.key ? "bg-cream" : ""
                  }`}
                >
                  {status.label}
                  {selectedStatus === status.key && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateMenuOpen((isOpen) => !isOpen)}
            className={`border-ink/20 hover:border-ink flex h-9 w-9 items-center justify-center border-2 bg-white/90 transition ${
              selectedDate ? "bg-cream" : ""
            }`}
            aria-label={t("appointments.filterAppointmentsByDate")}
            aria-expanded={isDateMenuOpen}
            title={t("appointments.filterByDate")}
          >
            <Icon name="calendar" size={16} className="text-ink opacity-70" />
          </button>

          {isDateMenuOpen && (
            <div className="border-ink/30 absolute top-full right-0 z-20 mt-2 min-w-52 border-2 bg-white p-2 shadow-lg">
              <label className="text-ink-muted block text-[0.65rem] tracking-widest uppercase"> {t("appointments.selectDate")} <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="border-ink/20 text-ink mt-1 w-full border-2 bg-white px-2 py-2 text-xs tracking-widest uppercase focus:outline-none"
                />
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate("");
                    setIsDateMenuOpen(false);
                  }}
                  className="border-ink/20 hover:border-ink border-2 bg-white px-2 py-2 text-[0.65rem] tracking-widest uppercase transition"
                > {t("appointments.allDates")} </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(getTodayIsoDate());
                    setIsDateMenuOpen(false);
                  }}
                  className="border-ink/20 hover:border-ink border-2 bg-white px-2 py-2 text-[0.65rem] tracking-widest uppercase transition"
                > {t("appointments.today")} </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsFilter;
