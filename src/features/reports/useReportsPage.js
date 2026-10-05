import { localizedError } from "../../i18n/localizedError.js";
import { fixedLabel } from "../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import { supabase } from "../../services/supabase";
import { isCompletedAppointment } from "../Appointments/appointmentStatsUtils.js";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import { useAppointments } from "../../globalHooks/useAppointments";
import { useOwnerId } from "../../globalHooks/useOwnerId";
import { formatCurrency } from "../../utils/currency";
import { useCurrencyCode } from "../settings/useCurrencyCode";
import { useServices } from "../services/useServices";

import { dateRangeOptions, palette, chartColors } from "./reportsConstants";
import {
  getDateRangeConfig,
  getAppointmentDate,
  getAppointmentAmount,
  isCancelledAppointment,
  isInRange,
  formatDelta,
  getClientKey,
  getServiceLabels,
  getPaymentLabel,
  normalizeStaffKey,
  getStaffName,
} from "./reportsUtils";
export function useReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState(dateRangeOptions[0]);
  const { ownerId, isLoading: ownerLoading, error: ownerError } = useOwnerId();
  const {
    currencyCode,
    isLoading: currencyLoading,
    error: currencyError,
  } = useCurrencyCode(ownerId);
  const {
    appointments,
    isFetching: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments(ownerId, { includeCancelled: true });
  const {
    services,
    isFetching: servicesLoading,
    error: servicesError,
  } = useServices(ownerId, currencyCode);
  const {
    data: staffMembers = [],
    isFetching: staffLoading,
    error: staffError,
  } = useQuery({
    queryKey: ["reports-staff", ownerId ?? "all"],
    queryFn: () => getStaffByOwner(ownerId),
    enabled: Boolean(ownerId),
  });

  const reportData = useMemo(() => {
    const range = getDateRangeConfig(dateRange);
    const activeAppointments = appointments.filter(
      (appointment) => !isCancelledAppointment(appointment),
    );
    const currentAppointments = activeAppointments.filter((appointment) =>
      isInRange(appointment, range.start, range.end),
    );
    const previousAppointments = activeAppointments.filter((appointment) =>
      isInRange(appointment, range.previousStart, range.previousEnd),
    );

    const totalRevenue = currentAppointments
      .filter(isCompletedAppointment)
      .reduce((sum, appointment) => sum + getAppointmentAmount(appointment), 0);
    const previousRevenue = previousAppointments
      .filter(isCompletedAppointment)
      .reduce((sum, appointment) => sum + getAppointmentAmount(appointment), 0);

    const firstClientVisitByKey = new Map();
    activeAppointments.forEach((appointment) => {
      const key = getClientKey(appointment);
      const date = getAppointmentDate(appointment);

      if (!key || !date) return;

      const existingDate = firstClientVisitByKey.get(key);
      if (!existingDate || date < existingDate) {
        firstClientVisitByKey.set(key, date);
      }
    });

    const newClients = [...firstClientVisitByKey.values()].filter(
      (date) => date >= range.start && date <= range.end,
    ).length;
    const previousNewClients = [...firstClientVisitByKey.values()].filter(
      (date) => date >= range.previousStart && date <= range.previousEnd,
    ).length;

    const ratings = staffMembers
      .map((staff) => Number(staff.rating))
      .filter((rating) => Number.isFinite(rating) && rating > 0);
    const avgRating = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    return {
      currentAppointments,
      previousAppointments,
      totalRevenue,
      previousRevenue,
      totalAppointments: currentAppointments.length,
      previousAppointmentsCount: previousAppointments.length,
      newClients,
      previousNewClients,
      avgRating,
      ratedStaffCount: ratings.length,
    };
  }, [appointments, dateRange, staffMembers, i18n.resolvedLanguage, t]);

  const statCards = [
    {
      title: t("clients.totalRevenue"),
      value: formatCurrency(reportData.totalRevenue, currencyCode),
      subtitle: fixedLabel(dateRange, "range"),
      delta: formatDelta(reportData.totalRevenue, reportData.previousRevenue),
      icon: creditCardIcon,
    },
    {
      title: t("reports.totalAppointments"),
      value: reportData.totalAppointments.toString(),
      subtitle: fixedLabel(dateRange, "range"),
      delta: formatDelta(
        reportData.totalAppointments,
        reportData.previousAppointmentsCount,
      ),
      icon: calendarIcon,
    },
    {
      title: t("reports.newClients2"),
      value: reportData.newClients.toString(),
      subtitle: fixedLabel(dateRange, "range"),
      delta: formatDelta(reportData.newClients, reportData.previousNewClients),
      icon: giftIcon,
    },
    {
      title: t("reports.avgRating"),
      value: reportData.avgRating ? reportData.avgRating.toFixed(1) : "0.0",
      subtitle: t("reports.staffAverage"),
      delta: t("reports.rated", { value1: reportData.ratedStaffCount }),
      icon: clockIcon,
    },
  ];

  const servicePopularity = useMemo(() => {
    const servicesById = new Map(
      services.map((service) => [String(service.id), service]),
    );
    const counts = new Map();

    reportData.currentAppointments.forEach((appointment) => {
      getServiceLabels(appointment, servicesById).forEach((label) => {
        counts.set(label, (counts.get(label) ?? 0) + 1);
      });
    });

    const total = [...counts.values()].reduce((sum, value) => sum + value, 0);

    if (!total) {
      return [
        {
          label: t("reports.noBookings"),
          value: 0,
          count: 0,
          displayValue: 0,
          color: palette.inkMuted,
        },
      ];
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, count], index) => ({
        label,
        count,
        value: Math.round((count / total) * 100),
        color: chartColors[index % chartColors.length],
      }));
  }, [reportData.currentAppointments, services, i18n.resolvedLanguage, t]);

  const staffPerformance = useMemo(() => {
    const revenueByStaff = new Map();

    staffMembers.forEach((staff) => {
      revenueByStaff.set(String(staff.id), {
        id: String(staff.id),
        count: 0,
        name: staff.name ?? i18n.t("common.unassigned"),
        value: 0,
      });
    });

    reportData.currentAppointments
      .filter(isCompletedAppointment)
      .forEach((appointment) => {
        const key = normalizeStaffKey(appointment);
        const existing = revenueByStaff.get(key) ?? {
          id: key,
          count: 0,
          name: getStaffName(appointment),
          value: 0,
        };

        existing.count += 1;
        existing.value += getAppointmentAmount(appointment);
        revenueByStaff.set(key, existing);
      });

    const rows = [...revenueByStaff.values()].sort((a, b) => b.value - a.value);

    return rows.length ? rows : [{ name: t("reports.noStaffData"), value: 0 }];
  }, [reportData.currentAppointments, staffMembers, i18n.resolvedLanguage, t]);

  const paymentMethods = useMemo(() => {
    const totals = new Map();

    reportData.currentAppointments
      .filter(isCompletedAppointment)
      .forEach((appointment) => {
        const label = getPaymentLabel(appointment);
        totals.set(
          label,
          (totals.get(label) ?? 0) + getAppointmentAmount(appointment),
        );
      });

    const orderedLabels = [t("common.payAtSalon"), t("common.card"), "UPI", t("common.wallet"), t("common.online")];
    const labels = [
      ...orderedLabels.filter((label) => totals.has(label)),
      ...[...totals.keys()].filter((label) => !orderedLabels.includes(label)),
    ];
    const visibleLabels = labels.length ? labels : orderedLabels.slice(0, 4);
    const total = [...totals.values()].reduce((sum, value) => sum + value, 0);

    return visibleLabels.map((label, index) => {
      const amount = totals.get(label) ?? 0;

      return {
        label,
        value: formatCurrency(amount, currencyCode),
        percent: total ? Math.round((amount / total) * 100) : 0,
        color: chartColors[index % chartColors.length],
      };
    });
  }, [currencyCode, reportData.currentAppointments, i18n.resolvedLanguage, t]);

  return {
    dateRange,
    setDateRange,
    currencyCode,
    reportData,
    statCards,
    appointments,
    servicePopularity,
    staffPerformance,
    paymentMethods,
    isLoading:
      ownerLoading ||
      currencyLoading ||
      appointmentsLoading ||
      servicesLoading ||
      staffLoading,
    loadError:
      ownerError ||
      currencyError ||
      appointmentsError ||
      servicesError ||
      staffError ||
      (!ownerLoading && !ownerId ? localizedError("reports.noSalonFound") : null),
  };
}

const getStaffByOwner = async (ownerId) => {
  if (!ownerId) return [];

  const { data, error } = await supabase
    .from("staff")
    .select("id, name, role, rating, appointments_count, owner_id")
    .eq("owner_id", ownerId);

  if (error) {
    throw error;
  }

  return data ?? [];
};
