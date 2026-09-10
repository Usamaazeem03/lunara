import { startTransition, useCallback, useEffect, useMemo } from "react";

import Button from "../../Shared/Button.jsx";
import AppHeader from "../../AppLayout/AppHeader.jsx";
import { supabase } from "../../services/supabase.js";
import {
  formatNumber,
  getInitials,
  parseTimeToMinutes,
} from "../../utils/appointmentUtils.js";

import { useBookingSubmit } from "../../globalHooks/useBookingSubmit.js";
import { notify } from "../../Shared/lib/toast.jsx";
import { useOwnerId } from "../../globalHooks/useOwnerId.js";
import { useCurrencyCode } from "../settings/useCurrencyCode.js";
import { useAppointments } from "../../globalHooks/useAppointments.js";
import { useServices } from "../services/useServices.js";
import CreateAppointmentForm from "./CreateAppointmentForm.jsx";
import AppointmentDetails from "./AppointmentDetails.jsx";
import AppointmentsView from "./AppointmentsView.jsx";
import { AppointmentStats } from "./AppointmentStats.jsx";
import { EMPTY_APPOINTMENT_FORM } from "./appointmentReducer.js";
import { useAppointmentLogic } from "./useAppointmentLogic.js";
const TABLE_NOT_FOUND_CODE = "42P01";
const APPOINTMENTS_PER_PAGE = 10;

const VIEW_TABS = [
  { key: "list", label: "List View" },
  { key: "calendar", label: "Calendar View" },
];

const APPOINTMENT_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
const STATUS_OPTIONS = APPOINTMENT_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

const getDefaultWorkingHours = () => [
  {
    day_of_week: 0,
    day_name: "Sunday",
    is_open: false,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 1,
    day_name: "Monday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 2,
    day_name: "Tuesday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 3,
    day_name: "Wednesday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 4,
    day_name: "Thursday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 5,
    day_name: "Friday",
    is_open: true,
    open_time: "09:00",
    close_time: "18:00",
  },
  {
    day_of_week: 6,
    day_name: "Saturday",
    is_open: true,
    open_time: "10:00",
    close_time: "16:00",
  },
];

const getTodayIsoDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toStartOfDay = (isoDate) => {
  if (!isoDate || typeof isoDate !== "string") return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatPrice = (value, currencyCode = "USD") => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return `${currencyCode} ${formatNumber(numeric)}`;
};

const formatMinutesToTimeLabel = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};

const formatTimeLabel = (value) => {
  const minutes = parseTimeToMinutes(value);
  if (minutes === null) return value || "N/A";
  return formatMinutesToTimeLabel(minutes);
};

const formatDateLabel = (isoDate) => {
  const date = toStartOfDay(isoDate);
  if (!date) return isoDate || "No date";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const isMissingAppointmentsTableError = (error) => {
  if (!error) return false;
  if (error.code === TABLE_NOT_FOUND_CODE) return true;

  const message = `${error.message ?? ""} ${error.details ?? ""} ${
    error.hint ?? ""
  }`.toLowerCase();

  return (
    (message.includes("relation") &&
      message.includes("appointments") &&
      message.includes("does not exist")) ||
    (message.includes("could not find") && message.includes("appointments"))
  );
};

const mergeWorkingHours = (rows) => {
  const defaultRows = getDefaultWorkingHours();
  const incomingByDay = new Map(
    (rows ?? []).map((row) => [Number(row.day_of_week), row]),
  );

  return defaultRows.map((defaultRow) => {
    const incoming = incomingByDay.get(defaultRow.day_of_week);
    if (!incoming) return defaultRow;

    return {
      ...defaultRow,
      ...incoming,
      day_of_week: Number(incoming.day_of_week),
    };
  });
};

const buildDateOptions = (workingHours, horizonDays = 14) => {
  const options = [];
  const today = new Date();

  for (let i = 0; i < horizonDays; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();

    const dayConfig = workingHours.find(
      (item) => Number(item.day_of_week) === dayOfWeek,
    );

    if (!dayConfig?.is_open) continue;

    const value = toIsoDate(date);

    options.push({
      value,
      label: date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      openTime: dayConfig.open_time,
      closeTime: dayConfig.close_time,
    });
  }

  return options;
};

const buildTimeSlots = (dateIso, workingHours) => {
  const date = toStartOfDay(dateIso);
  if (!date) return [];

  const dayConfig = workingHours.find(
    (item) => Number(item.day_of_week) === date.getDay(),
  );

  if (!dayConfig?.is_open) return [];

  const start = parseTimeToMinutes(dayConfig.open_time);
  const end = parseTimeToMinutes(dayConfig.close_time);

  if (start === null || end === null || start >= end) {
    return [];
  }

  const slots = [];
  for (let current = start; current < end; current += 30) {
    slots.push(formatMinutesToTimeLabel(current));
  }

  return slots;
};

const mapStaffRow = (staff) => ({
  id: staff.id,
  name: staff.name ?? "Unknown Staff",
  role: staff.role ?? "Staff",
  isOnShift: staff.is_on_shift ?? false,
  initials: getInitials(staff.name),
});

const getStaffOptionLabel = (staff) => `${staff.name} - ${staff.role}`;

const mapAppointmentRow = (
  row,
  index,
  servicesById,
  staffById,
  currencyCode,
) => {
  if (!row) return null;

  const serviceFromLookup = row.service_id
    ? servicesById[String(row.service_id)]
    : null;
  const staffFromLookup = row.staff_id ? staffById[String(row.staff_id)] : null;

  const rawDate =
    row.appointment_date ??
    row.date ??
    row.booking_date ??
    row.scheduled_date ??
    row.starts_at ??
    "";
  const appointmentDate =
    typeof rawDate === "string" ? rawDate.split("T")[0] : "";

  const rawTime =
    row.appointment_time ??
    row.time ??
    row.start_time ??
    row.slot_time ??
    row.starts_at ??
    "";

  const clientName =
    row.client_name ?? row.customer_name ?? row.client ?? "Walk-in";
  const serviceName =
    row.service_name ??
    row.service_title ??
    serviceFromLookup?.title ??
    "Service";
  const staffName = row.staff_name ?? staffFromLookup?.name ?? "Unassigned";
  const durationValue = Number(
    row.duration_minutes ?? row.duration ?? serviceFromLookup?.durationValue,
  );
  const priceValue = Number(
    row.price ?? row.amount ?? serviceFromLookup?.priceValue,
  );

  return {
    id: row.id ?? row.appointment_id ?? `local-${index}`,
    appointmentDate,
    dateLabel: formatDateLabel(appointmentDate),
    timeLabel: formatTimeLabel(rawTime),
    timeSortValue: parseTimeToMinutes(rawTime) ?? 0,
    client: clientName,
    initials: getInitials(clientName),
    service: serviceName,
    staff: staffName,
    duration: Number.isFinite(durationValue) ? `${durationValue} min` : "N/A",
    price: Number.isFinite(priceValue)
      ? formatPrice(priceValue, currencyCode)
      : (serviceFromLookup?.priceLabel ?? "N/A"),
    status:
      typeof row.status === "string" && row.status.trim()
        ? row.status
        : "Pending",
    isLocalDraft: row.source === "local-draft",
    notes: row.notes ?? null,
  };
};

const sortAppointments = (appointments) =>
  [...appointments].sort((a, b) => {
    const dateA =
      toStartOfDay(a.appointmentDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const dateB =
      toStartOfDay(b.appointmentDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (dateA !== dateB) return dateA - dateB;
    return a.timeSortValue - b.timeSortValue;
  });

const AppointmentPage = () => {
  const { ownerId } = useOwnerId();
  const { currencyCode } = useCurrencyCode(ownerId);
  const displayCurrencyCode = currencyCode ?? "USD";
  const { services: loadedServices, error: servicesError } = useServices(
    ownerId,
    displayCurrencyCode,
  );
  const services = useMemo(
    () => loadedServices.filter((service) => service.isActive),
    [loadedServices],
  );
  const serviceLoadError = servicesError?.message ?? "";
  const {
    appointments: loadedAppointments,
    isLoading: isAppointmentsLoading,
    error: appointmentsError,
  } = useAppointments(ownerId, { includeCancelled: true });

  const appointmentLogic = useAppointmentLogic(
    getTodayIsoDate(),
    getDefaultWorkingHours(),
    loadedAppointments,
  );
  const { state, set, update, updateForm } = appointmentLogic;
  const {
    activeView,
    selectedDate,
    selectedStatus,
    currentPage,
    staffMembers,
    workingHours,
    appointments,
    localDraftAppointments,
    clients,
    loadError,
    isAppointmentTableReady,
    tableMessage,
    showForm,
    formState,
    serviceSearchQuery,
    staffSearchValue,
    selectedAppointment,
  } = state;
  const setActiveView = (value) => set("activeView", value);
  const setSelectedDate = (value) => set("selectedDate", value);
  const setSelectedStatus = (value) => set("selectedStatus", value);
  const setCurrentPage = (value) => set("currentPage", value);
  const setStaffMembers = useCallback(
    (value) => set("staffMembers", value),
    [set],
  );
  const setWorkingHours = useCallback(
    (value) => set("workingHours", value),
    [set],
  );
  const setAppointments = useCallback(
    (value) => update("appointments", value),
    [update],
  );
  const setLocalDraftAppointments = useCallback(
    (value) => update("localDraftAppointments", value),
    [update],
  );
  const setClients = useCallback((value) => set("clients", value), [set]);
  const setIsLoading = useCallback((value) => set("isLoading", value), [set]);
  const setLoadError = useCallback((value) => set("loadError", value), [set]);
  const setIsAppointmentTableReady = useCallback(
    (value) => set("isAppointmentTableReady", value),
    [set],
  );
  const setTableMessage = useCallback(
    (value) => set("tableMessage", value),
    [set],
  );
  const setShowForm = (value) => set("showForm", value);
  const setFormState = (value) => updateForm(value);
  const setServiceSearchQuery = (value) => set("serviceSearchQuery", value);
  const setStaffSearchValue = (value) => set("staffSearchValue", value);
  const setSelectedAppointment = (value) => set("selectedAppointment", value);

  const {
    handleBooking,
    isSaving,
    saveError,
    setSaveError,
    saveSuccess,
    setSaveSuccess,
  } = useBookingSubmit("owner");

  useEffect(() => {
    const errorMessage = [
      loadError,
      serviceLoadError,
      appointmentsError?.message,
    ]
      .filter(Boolean)
      .join(" ");
    if (errorMessage) notify.error(errorMessage);
  }, [appointmentsError, loadError, serviceLoadError]);

  useEffect(() => {
    if (!appointmentsError) {
      startTransition(() => {
        setAppointments(loadedAppointments);
        setIsAppointmentTableReady(true);
        setTableMessage("");
      });
      return;
    }

    if (isMissingAppointmentsTableError(appointmentsError)) {
      startTransition(() => {
        setAppointments([]);
        setIsAppointmentTableReady(false);
        setTableMessage(
          "Appointments table is not created yet. You can still prepare appointments from this screen, but they will stay local until the table exists.",
        );
      });
      return;
    }

    startTransition(() => {
      setAppointments([]);
      setLoadError(`Appointments: ${appointmentsError.message}`);
    });
  }, [
    appointmentsError,
    loadedAppointments,
    setAppointments,
    setIsAppointmentTableReady,
    setLoadError,
    setTableMessage,
  ]);

  useEffect(() => {
    if (tableMessage) notify.info(tableMessage);
  }, [tableMessage]);

  useEffect(() => {
    if (saveError) notify.error(saveError);
  }, [saveError]);

  useEffect(() => {
    if (saveSuccess) notify.success(saveSuccess);
  }, [saveSuccess]);

  useEffect(() => {
    let isMounted = true;

    const loadOwnerData = async () => {
      if (!ownerId) return;

      setIsLoading(true);
      setLoadError("");

      const [staffRes, workingHoursRes, clientsRes] = await Promise.all([
        supabase
          .from("staff")
          .select("id, name, role, is_on_shift, owner_id")
          .eq("owner_id", ownerId),
        supabase
          .from("working_hours")
          .select(
            "day_of_week, day_name, is_open, open_time, close_time, owner_id",
          )
          .eq("owner_id", ownerId),
        supabase.from("profiles").select("*").eq("owner_id", ownerId),
      ]);

      if (!isMounted) return;

      const issues = [];

      if (staffRes.error) {
        issues.push(`Staff: ${staffRes.error.message}`);
        setStaffMembers([]);
      } else {
        setStaffMembers((staffRes.data ?? []).map(mapStaffRow));
      }

      if (workingHoursRes.error) {
        issues.push(`Working hours: ${workingHoursRes.error.message}`);
        setWorkingHours(getDefaultWorkingHours());
      } else {
        setWorkingHours(mergeWorkingHours(workingHoursRes.data ?? []));
      }

      if (clientsRes.error) {
        console.warn("Could not load clients:", clientsRes.error.message);
        setClients([]);
      } else {
        setClients(clientsRes.data ?? []);
      }

      if (issues.length > 0) {
        setLoadError(issues.join(" "));
      }

      setIsLoading(false);
    };

    loadOwnerData();

    // ──  Only subscribe when ownerId is available ──────────────
    if (!ownerId) {
      return () => {
        isMounted = false;
      };
    }

    // ──  Unique channel name per owner to avoid conflicts ───────
    const channel = supabase
      .channel(`owner-appointments-${ownerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
          filter: `owner_id=eq.${ownerId}`,
        },
        (payload) => {
          if (!isMounted) return;

          setAppointments((prev) => {
            const alreadyExists = prev.some((a) => a.id === payload.new.id);
            if (alreadyExists) return prev;
            return [payload.new, ...prev];
          });
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [
    ownerId,
    setAppointments,
    setClients,
    setIsLoading,
    setLoadError,
    setStaffMembers,
    setWorkingHours,
  ]);
  const pageIsLoading = isAppointmentsLoading;
  const displayedLoadError = [
    loadError,
    serviceLoadError,
    appointmentsError?.message,
  ]
    .filter(Boolean)
    .join(" ");
  const dateOptions = useMemo(
    () => buildDateOptions(workingHours, 14),
    [workingHours],
  );

  const staffOptions = useMemo(() => {
    if (staffMembers.length === 0) return [];
    return [
      ...staffMembers,
      {
        id: "no-preference",
        name: "No Preference",
        role: "Any available staff",
        isOnShift: true,
        isSynthetic: true,
      },
    ];
  }, [staffMembers]);

  const servicesById = useMemo(
    () =>
      Object.fromEntries(
        services.map((service) => [String(service.id), service]),
      ),
    [services],
  );

  const staffById = useMemo(
    () =>
      Object.fromEntries(
        staffMembers.map((staff) => [String(staff.id), staff]),
      ),
    [staffMembers],
  );

  const allAppointmentRows = useMemo(
    () =>
      sortAppointments(
        [...localDraftAppointments, ...appointments]
          .map((row, index) =>
            mapAppointmentRow(
              row,
              index,
              servicesById,
              staffById,
              displayCurrencyCode,
            ),
          )
          .filter(Boolean),
      ),
    [
      appointments,
      displayCurrencyCode,
      localDraftAppointments,
      servicesById,
      staffById,
    ],
  );

  const filteredAppointments = useMemo(() => {
    return allAppointmentRows.filter((appointment) => {
      const matchesDate =
        !selectedDate || appointment.appointmentDate === selectedDate;
      const matchesStatus =
        selectedStatus === "all" || appointment.status === selectedStatus;
      return matchesDate && matchesStatus;
    });
  }, [allAppointmentRows, selectedDate, selectedStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE),
  );
  const displayedPage = Math.min(currentPage, totalPages);
  const visibleAppointments = useMemo(
    () =>
      filteredAppointments.slice(
        (displayedPage - 1) * APPOINTMENTS_PER_PAGE,
        displayedPage * APPOINTMENTS_PER_PAGE,
      ),
    [displayedPage, filteredAppointments],
  );

  const handleSelectedDateChange = (date) => {
    setCurrentPage(1);
    setSelectedDate(date);
  };

  const handleSelectedStatusChange = (status) => {
    setCurrentPage(1);
    setSelectedStatus(status);
  };

  const formTimeSlots = useMemo(
    () => buildTimeSlots(formState.appointmentDate, workingHours),
    [formState.appointmentDate, workingHours],
  );

  const selectedServices = useMemo(
    () =>
      services.filter((service) =>
        formState.serviceIds.includes(String(service.id)),
      ),
    [services, formState.serviceIds],
  );

  const filteredServices = useMemo(() => {
    const normalizedQuery = serviceSearchQuery.trim().toLowerCase();
    if (!normalizedQuery) return services;

    return services.filter((service) =>
      service.title.toLowerCase().includes(normalizedQuery),
    );
  }, [services, serviceSearchQuery]);

  const totalPrice = useMemo(
    () =>
      selectedServices.reduce((sum, service) => sum + service.priceValue, 0),
    [selectedServices],
  );

  const totalDuration = useMemo(
    () =>
      selectedServices.reduce((sum, service) => sum + service.durationValue, 0),
    [selectedServices],
  );

  const selectedStaff = useMemo(
    () =>
      staffOptions.find(
        (staff) => String(staff.id) === String(formState.staffId),
      ),
    [formState.staffId, staffOptions],
  );

  const staffSelectOptions = useMemo(
    () =>
      staffOptions.map((staff) => ({
        value: staff.id,
        label: getStaffOptionLabel(staff),
      })),
    [staffOptions],
  );

  const canSaveAppointment = Boolean(
    ownerId &&
    formState.clientName.trim() &&
    formState.serviceIds.length > 0 &&
    formState.staffId &&
    formState.appointmentDate &&
    formState.appointmentTime &&
    !isSaving &&
    services.length > 0 &&
    staffOptions.length > 0 &&
    formTimeSlots.length > 0,
  );

  const getDefaultFormState = () => {
    const appointmentDate = dateOptions[0]?.value ?? getTodayIsoDate();
    const availableSlots = buildTimeSlots(appointmentDate, workingHours);
    const defaultStaffId =
      staffOptions.find((staff) => String(staff.id) === "no-preference")?.id ??
      staffOptions[0]?.id ??
      "";

    return {
      ...EMPTY_APPOINTMENT_FORM,
      serviceIds: services.length > 0 ? [String(services[0]?.id)] : [],
      staffId: defaultStaffId,
      appointmentDate,
      appointmentTime: availableSlots[0] ?? "",
    };
  };

  const handleOpenForm = () => {
    const defaultFormState = getDefaultFormState();
    const defaultStaff = staffOptions.find(
      (staff) => String(staff.id) === String(defaultFormState.staffId),
    );

    setShowForm(true);
    setSaveError("");
    setSaveSuccess("");
    setServiceSearchQuery("");
    setStaffSearchValue(defaultStaff ? getStaffOptionLabel(defaultStaff) : "");
    setFormState(defaultFormState);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSaveError("");
    setSaveSuccess("");
    setServiceSearchQuery("");
    setStaffSearchValue("");
    setFormState(EMPTY_APPOINTMENT_FORM);
  };

  const handleStaffSearchChange = (nextValue) => {
    const normalizedValue = nextValue.trim().toLowerCase();
    const exactMatch = staffSelectOptions.find((option) => {
      const label = option.label.toLowerCase();
      return (
        label === normalizedValue || label.split(" - ")[0] === normalizedValue
      );
    });

    setStaffSearchValue(nextValue);
    setFormState((prev) => ({
      ...prev,
      staffId: exactMatch ? exactMatch.value : "",
    }));
  };

  const handleSelectStaffOption = (option) => {
    setFormState((prev) => ({ ...prev, staffId: option.value }));
    setStaffSearchValue(option.label);
  };

  const handleSelectStatusOption = (option) => {
    setFormState((prev) => ({ ...prev, status: option.value }));
  };

  const handleToggleService = (serviceId) => {
    setFormState((prev) => {
      const id = String(serviceId);
      const newServiceIds = prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id];
      return { ...prev, serviceIds: newServiceIds };
    });
  };

  const handleSelectDate = (dateValue) => {
    const nextSlots = buildTimeSlots(dateValue, workingHours);
    setFormState((prev) => ({
      ...prev,
      appointmentDate: dateValue,
      appointmentTime: nextSlots[0] ?? "",
    }));
  };

  const createLocalDraft = (payload) => ({
    ...payload,
    id: `local-${Date.now()}`,
    source: "local-draft",
  });

  const handleSubmitAppointment = (formData) => {
    if (!canSaveAppointment) return;

    handleBooking({
      ownerId,
      clientId: formState.clientId || null,
      services: selectedServices, // already { id, title, priceValue, durationValue }
      staff: selectedStaff ?? null,
      appointmentDate: formState.appointmentDate,
      appointmentTime: formState.appointmentTime,
      clientName: formState.clientName.trim(),
      clientPhone: formData.clientPhone.trim() || null,
      clientEmail: formData.clientEmail.trim() || null,
      status: formState.status,
      notes: formData.notes.trim() || null,
      isAppointmentTableReady,

      // ─ Callbacks: owner side ke UI update ───────────────────────────────
      onLocalDraft: (payloads) => {
        setLocalDraftAppointments((prev) => [
          ...payloads.map(createLocalDraft),
          ...prev,
        ]);
        setSelectedDate(payloads[0].appointment_date);
      },

      onMissingTable: (payloads) => {
        setIsAppointmentTableReady(false);
        setTableMessage("Appointments table not found. Saving locally.");
        setLocalDraftAppointments((prev) => [
          ...payloads.map(createLocalDraft),
          ...prev,
        ]);
        setSelectedDate(payloads[0].appointment_date);
      },

      onSuccess: (data) => {
        setAppointments((prev) => [...data, ...prev]);
        setSelectedDate(data[0].appointment_date);
      },

      onDone: () => {
        setShowForm(false);
        setServiceSearchQuery("");
        setStaffSearchValue("");
        setFormState(EMPTY_APPOINTMENT_FORM);
      },
    });
  };

  return (
    <section className="flex h-full flex-col">
      <AppHeader
        eyebrow="Appointments"
        title="Appointments"
        description="Manage your appointment schedule and create bookings using your real services, staff, and working hours."
      >
        <Button
          variant="primary"
          type="button"
          onClick={showForm ? handleCancelForm : handleOpenForm}
        >
          {showForm ? "Close" : "New Appointment"}
        </Button>
      </AppHeader>

      {showForm && (
        <CreateAppointmentForm
          handleCancelForm={handleCancelForm}
          handleSubmitAppointment={handleSubmitAppointment}
          formState={formState}
          setFormState={setFormState}
          clients={clients}
          staffMembers={staffMembers}
          services={services}
          serviceSearchQuery={serviceSearchQuery}
          setServiceSearchQuery={setServiceSearchQuery}
          staffSearchValue={staffSearchValue}
          handleToggleService={handleToggleService}
          filteredServices={filteredServices}
          dateOptions={dateOptions}
          formTimeSlots={formTimeSlots}
          isSaving={isSaving}
          saveError={saveError}
          saveSuccess={saveSuccess}
          isAppointmentTableReady={isAppointmentTableReady}
          STATUS_OPTIONS={STATUS_OPTIONS}
          handleStaffSearchChange={handleStaffSearchChange}
          handleSelectStatusOption={handleSelectStatusOption}
          handleSelectStaffOption={handleSelectStaffOption}
          handleSelectDate={handleSelectDate}
          selectedServices={selectedServices}
          totalPrice={totalPrice}
          totalDuration={totalDuration}
          displayCurrencyCode={displayCurrencyCode}
          canSaveAppointment={canSaveAppointment}
          staffSelectOptions={staffSelectOptions}
        />
      )}

      {displayedLoadError && (
        <div className="border-danger/40 bg-danger/10 text-danger mb-3 border-2 p-3 text-sm">
          {displayedLoadError}
        </div>
      )}

      {tableMessage && (
        <div className="mb-3 border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          {tableMessage}
        </div>
      )}

      <AppointmentStats appointments={allAppointmentRows} />

      <AppointmentsView
        activeView={activeView}
        setActiveView={setActiveView}
        selectedDate={selectedDate}
        setSelectedDate={handleSelectedDateChange}
        getTodayIsoDate={getTodayIsoDate}
        selectedStatus={selectedStatus}
        setSelectedStatus={handleSelectedStatusChange}
        filteredAppointments={filteredAppointments}
        visibleAppointments={visibleAppointments}
        pageIsLoading={pageIsLoading}
        currentPage={displayedPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        formatDateLabel={formatDateLabel}
        onSelectAppointment={setSelectedAppointment}
      />
      <AppointmentDetails
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onAppointmentUpdated={(appointmentId, status) => {
          setAppointments((prev) =>
            prev.map((appointment) =>
              appointment.id === appointmentId
                ? { ...appointment, status }
                : appointment,
            ),
          );
        }}
        onAppointmentDeleted={(appointmentId) => {
          setAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== appointmentId),
          );
        }}
      />
    </section>
  );
};

export default AppointmentPage;
