import { useEffect, useMemo, useState } from "react";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import Button from "../../Shared/Button";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import { supabase } from "../../Shared/lib/supabaseClient";
import StatCards from "../Client/StatCards";
import {
  formatNumber,
  getInitials,
  parseTimeToMinutes,
} from "../../Shared/utils/appointmentUtils";
import Icon from "../../Shared/ui/Icon";
import ServiceSearchInput from "../../Shared/ui/ServiceSearchInput";
import SearchableSelectBox from "../../Shared/ui/SearchableSelectBox";
import { getServiceIcon } from "../../Shared/lib/serviceCategories";
import { useBookingSubmit } from "../../Shared/hook/useBookingSubmit";
import { confirmToast, notify } from "../../Shared/lib/toast.jsx";
const CURRENCY_CODE = "GBP";
const TABLE_NOT_FOUND_CODE = "42P01";

const VIEW_TABS = [
  { key: "list", label: "List View" },
  { key: "calendar", label: "Calendar View" },
];

const APPOINTMENT_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];
const STATUS_OPTIONS = APPOINTMENT_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

const EMPTY_FORM = {
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  serviceIds: [],
  staffId: "",
  appointmentDate: "",
  appointmentTime: "",
  status: "Confirmed",
  notes: "",
};

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

// const formatNumber = (value) =>
//   Number.isInteger(value) ? value.toString() : value.toFixed(2);

const formatPrice = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "N/A";
  return `${CURRENCY_CODE} ${formatNumber(numeric)}`;
};

// const getInitials = (name) => {
//   if (!name) return "??";
//   return name
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// };

// const parseTimeToMinutes = (value) => {
//   if (value === null || value === undefined) return null;

//   const raw = String(value).trim();
//   if (!raw) return null;

//   const fromDateTime = raw.match(/T(\d{2}):(\d{2})/);
//   if (fromDateTime) {
//     const hours = Number(fromDateTime[1]);
//     const minutes = Number(fromDateTime[2]);
//     return hours * 60 + minutes;
//   }

//   const amPmMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
//   if (amPmMatch) {
//     let hours = Number(amPmMatch[1]) % 12;
//     const minutes = Number(amPmMatch[2]);
//     const period = amPmMatch[3].toUpperCase();
//     if (period === "PM") {
//       hours += 12;
//     }
//     return hours * 60 + minutes;
//   }

//   const twentyFourMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
//   if (twentyFourMatch) {
//     const hours = Number(twentyFourMatch[1]);
//     const minutes = Number(twentyFourMatch[2]);
//     if (hours > 23 || minutes > 59) return null;
//     return hours * 60 + minutes;
//   }

//   return null;
// };

const formatMinutesToTimeLabel = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};

// const toTime24 = (value) => {
//   const minutes = parseTimeToMinutes(value);
//   if (minutes === null) return "";
//   const hours = Math.floor(minutes / 60)
//     .toString()
//     .padStart(2, "0");
//   const mins = (minutes % 60).toString().padStart(2, "0");
//   return `${hours}:${mins}`;
// };

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

const mapServiceRow = (service) => {
  const priceValue = Number(service.price);
  const durationValue = Number(service.duration_minutes ?? service.duration);

  return {
    id: String(service.id),
    title: service.name ?? "Untitled Service",
    description: service.description ?? "",
    category: service.category ?? "General",
    iconName: getServiceIcon(service.category),
    priceValue: Number.isFinite(priceValue) ? priceValue : 0,
    durationValue: Number.isFinite(durationValue) ? durationValue : 0,
    priceLabel: formatPrice(priceValue),
    durationLabel: Number.isFinite(durationValue)
      ? `${durationValue} min`
      : "N/A",
    isActive: service.is_active !== false,
  };
};

const mapStaffRow = (staff) => ({
  id: staff.id,
  name: staff.name ?? "Unknown Staff",
  role: staff.role ?? "Staff",
  isOnShift: staff.is_on_shift ?? false,
  initials: getInitials(staff.name),
});

const getStaffOptionLabel = (staff) => `${staff.name} - ${staff.role}`;

const mapAppointmentRow = (row, index, servicesById, staffById) => {
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
      ? formatPrice(priceValue)
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

/////temporary function fix later
const getServiceSummary = (serviceName) => {
  if (!serviceName) return "Service";

  const list = serviceName.split(",").map((s) => s.trim());

  if (list.length === 1) return list[0];

  return `${list[0]} +${list.length - 1}`;
};

const AppointmentPage = () => {
  const [activeView, setActiveView] = useState(VIEW_TABS[0].key);
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate());

  const [ownerId, setOwnerId] = useState(null);
  const [services, setServices] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [workingHours, setWorkingHours] = useState(getDefaultWorkingHours());
  const [appointments, setAppointments] = useState([]);
  const [localDraftAppointments, setLocalDraftAppointments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isAppointmentTableReady, setIsAppointmentTableReady] = useState(true);
  const [tableMessage, setTableMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [staffSearchValue, setStaffSearchValue] = useState("");
  // const [isSaving, setIsSaving] = useState(false);
  // const [saveError, setSaveError] = useState("");
  // const [saveSuccess, setSaveSuccess] = useState("");
  // /////////////////////////////////////////////////////////////////
  // fix owner side booking logic i add code theas line 21 , 324 901 to 994
  ///////////////////////////////////////////////////////////////////////
  //// for editing existing appointments in the future
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  ///////////////////////////////////////////////////
  const {
    handleBooking,
    isSaving,
    saveError,
    setSaveError,
    saveSuccess,
    setSaveSuccess,
  } = useBookingSubmit("owner");

  useEffect(() => {
    if (loadError) notify.error(loadError);
  }, [loadError]);

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
    const getOwnerId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setOwnerId(user.id);
      }
    };

    getOwnerId();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadOwnerData = async () => {
      if (!ownerId) return;

      setIsLoading(true);
      setLoadError("");

      const [servicesRes, staffRes, workingHoursRes, appointmentsRes] =
        await Promise.all([
          supabase
            .from("services")
            .select(
              "id, name, description, category, price, duration_minutes, is_active, owner_id",
            )
            .eq("owner_id", ownerId),
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
          supabase.from("appointments").select("*").eq("owner_id", ownerId),
        ]);

      if (!isMounted) return;

      const issues = [];

      if (servicesRes.error) {
        issues.push(`Services: ${servicesRes.error.message}`);
        setServices([]);
      } else {
        const mappedServices = (servicesRes.data ?? [])
          .map(mapServiceRow)
          .filter((service) => service.isActive);
        setServices(mappedServices);
      }

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

      if (appointmentsRes.error) {
        if (isMissingAppointmentsTableError(appointmentsRes.error)) {
          setAppointments([]);
          setIsAppointmentTableReady(false);
          setTableMessage(
            "Appointments table is not created yet. You can still prepare appointments from this screen, but they will stay local until the table exists.",
          );
        } else {
          issues.push(`Appointments: ${appointmentsRes.error.message}`);
          setAppointments([]);
        }
      } else {
        setAppointments(appointmentsRes.data ?? []);
        setIsAppointmentTableReady(true);
        setTableMessage("");
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
  }, [ownerId]);
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
            mapAppointmentRow(row, index, servicesById, staffById),
          )
          .filter(Boolean),
      ),
    [appointments, localDraftAppointments, servicesById, staffById],
  );

  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return allAppointmentRows;
    return allAppointmentRows.filter(
      (appointment) => appointment.appointmentDate === selectedDate,
    );
  }, [allAppointmentRows, selectedDate]);

  const stats = useMemo(() => {
    const todayIso = getTodayIsoDate();
    const startOfToday = toStartOfDay(todayIso);
    const endOfWeek = new Date(startOfToday ?? new Date());
    endOfWeek.setDate((startOfToday ?? new Date()).getDate() + 6);

    const todayCount = allAppointmentRows.filter(
      (appointment) => appointment.appointmentDate === todayIso,
    ).length;

    const weekCount = allAppointmentRows.filter((appointment) => {
      const date = toStartOfDay(appointment.appointmentDate);
      if (!date || !startOfToday) return false;
      return date >= startOfToday && date <= endOfWeek;
    }).length;

    const confirmedCount = allAppointmentRows.filter(
      (appointment) => appointment.status.toLowerCase() === "confirmed",
    ).length;
    const pendingCount = allAppointmentRows.filter(
      (appointment) => appointment.status.toLowerCase() === "pending",
    ).length;

    return [
      {
        title: "Today's Appointments",
        value: todayCount.toString(),
        subtitle: "On the calendar",
        icon: calendarIcon,
      },
      {
        title: "This Week",
        value: weekCount.toString(),
        subtitle: "Upcoming visits",
        icon: clockIcon,
      },
      {
        title: "Confirmed",
        value: confirmedCount.toString(),
        subtitle: "Ready to start",
        icon: giftIcon,
      },
      {
        title: "Pending",
        value: pendingCount.toString(),
        subtitle: "Needs review",
        icon: creditCardIcon,
      },
    ];
  }, [allAppointmentRows]);

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
      ...EMPTY_FORM,
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
    setFormState(EMPTY_FORM);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
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
  // /////////////////////////////////////////////////
  // const handleSubmitAppointment = async (event) => {
  //   event.preventDefault();
  //   if (!canSaveAppointment) return;

  //   setIsSaving(true);
  //   setSaveError("");
  //   setSaveSuccess("");

  //   // Create one appointment per selected service
  //   const payloads = selectedServices.map((service) => ({
  //     owner_id: ownerId,
  //     client_name: formState.clientName.trim(),
  //     client_phone: formState.clientPhone.trim() || null,
  //     client_email: formState.clientEmail.trim() || null,
  //     service_id: service.id ?? null,
  //     service_name: service.title ?? null,
  //     staff_id:
  //       selectedStaff && selectedStaff.id !== "no-preference"
  //         ? selectedStaff.id
  //         : null,
  //     staff_name: selectedStaff?.name ?? null,
  //     appointment_date: formState.appointmentDate,
  //     appointment_time: toTime24(formState.appointmentTime),
  //     duration_minutes: service.durationValue ?? null,
  //     price: service.priceValue ?? null,
  //     status: formState.status,
  //     notes: formState.notes.trim() || null,
  //   }));

  //   if (!isAppointmentTableReady) {
  //     setLocalDraftAppointments((prev) => [
  //       ...payloads.map(createLocalDraft),
  //       ...prev,
  //     ]);
  //     setSelectedDate(payloads[0].appointment_date);
  //     setSaveSuccess(
  //       `Saved locally (${payloads.length} service${payloads.length > 1 ? "s" : ""}). Create the appointments table in Supabase to persist this permanently.`,
  //     );
  //     setIsSaving(false);
  //     setShowForm(false);
  //     setServiceSearchQuery("");
  //     setStaffSearchValue("");
  //     setFormState(EMPTY_FORM);
  //     return;
  //   }

  //   try {
  //     const { data, error } = await supabase
  //       .from("appointments")
  //       .insert(payloads)
  //       .select("*");

  //     if (error) {
  //       if (isMissingAppointmentsTableError(error)) {
  //         setIsAppointmentTableReady(false);
  //         setTableMessage(
  //           "Appointments table is not created yet. New appointments are being kept locally in this session.",
  //         );
  //         setLocalDraftAppointments((prev) => [
  //           ...payloads.map(createLocalDraft),
  //           ...prev,
  //         ]);
  //         setSelectedDate(payloads[0].appointment_date);
  //         setSaveSuccess(
  //           `Saved locally for now (${payloads.length} service${payloads.length > 1 ? "s" : ""}).`,
  //         );
  //         setShowForm(false);
  //         setServiceSearchQuery("");
  //         setStaffSearchValue("");
  //         setFormState(EMPTY_FORM);
  //       } else {
  //         setSaveError(error.message || "Unable to save appointment.");
  //       }
  //       setIsSaving(false);
  //       return;
  //     }

  //     if (data && data.length > 0) {
  //       setAppointments((prev) => [...data, ...prev]);
  //       setSelectedDate(payloads[0].appointment_date);
  //     }

  //     setSaveSuccess(
  //       `${payloads.length} appointment${payloads.length > 1 ? "s" : ""} created successfully.`,
  //     );
  //     setIsSaving(false);
  //     setShowForm(false);
  //     setServiceSearchQuery("");
  //     setStaffSearchValue("");
  //     setFormState(EMPTY_FORM);
  //   } catch (err) {
  //     setSaveError(err?.message || "An error occurred while saving.");
  //     setIsSaving(false);
  //   }
  // };
  const handleSubmitAppointment = (event) => {
    event.preventDefault();
    if (!canSaveAppointment) return;

    handleBooking({
      ownerId,
      services: selectedServices, // already { id, title, priceValue, durationValue }
      staff: selectedStaff ?? null,
      appointmentDate: formState.appointmentDate,
      appointmentTime: formState.appointmentTime,
      clientName: formState.clientName.trim(),
      clientPhone: formState.clientPhone.trim() || null,
      clientEmail: formState.clientEmail.trim() || null,
      status: formState.status,
      notes: formState.notes.trim() || null,
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
        setFormState(EMPTY_FORM);
      },
    });
  };

  const handleConfirm = async (id) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "Confirmed" })
      .eq("id", id);

    if (error) {
      notify.error(error.message || "Unable to confirm appointment.");
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Confirmed" } : a)),
    );
    setSelectedAppointment(null);
    notify.success("Appointment confirmed.");
  };

  const handleComplete = async (id) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "Completed" })
      .eq("id", id);

    if (error) {
      notify.error(error.message || "Unable to complete appointment.");
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a)),
    );
    setSelectedAppointment(null);
    notify.success("Appointment marked as completed.");
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmToast({
      title: "Delete this appointment?",
      description: "This cannot be undone.",
      confirmLabel: "Delete appointment",
      cancelLabel: "Keep appointment",
      confirmTone: "danger",
    });

    if (!confirmed) return;

    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      notify.error(error.message || "Unable to delete appointment.");
      return;
    }

    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setSelectedAppointment(null);
    notify.success("Appointment deleted.");
  };
  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
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
      </DashboardHeader>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCancelForm}
          />

          {/* Modal Panel - larger size with header and close button */}
          <div className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-6xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]">
            {/* Top accent bar */}
            <div className="bg-ink h-1 w-full" />

            {/* Header with Close Button */}
            <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
              <div>
                <p className="text-ink text-base leading-tight font-semibold">
                  Add New Appointment
                </p>
              </div>

              <button
                onClick={handleCancelForm}
                className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {/* ///////////////////////////////////////////////////////// */}
            {/* Form Content */}
            <div className="overflow-y-auto p-4 sm:p-5">
              <form onSubmit={handleSubmitAppointment} className="space-y-4">
                <p className="text-ink-muted text-xs tracking-widest uppercase">
                  Add New Appointment
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Client Name *
                    <input
                      name="clientName"
                      value={formState.clientName}
                      onChange={handleFormChange}
                      type="text"
                      placeholder="e.g. Emily Parker"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Phone
                    <input
                      name="clientPhone"
                      value={formState.clientPhone}
                      onChange={handleFormChange}
                      type="tel"
                      placeholder="(555) 111-2222"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Email
                    <input
                      name="clientEmail"
                      value={formState.clientEmail}
                      onChange={handleFormChange}
                      type="email"
                      placeholder="client@email.com"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Status
                    <SearchableSelectBox
                      value={formState.status}
                      options={STATUS_OPTIONS}
                      selectedValue={formState.status}
                      onOptionSelect={handleSelectStatusOption}
                      placeholder="Select status"
                      searchable={false}
                      className="mt-2"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Staff *
                    <SearchableSelectBox
                      value={staffSearchValue}
                      onValueChange={handleStaffSearchChange}
                      options={staffSelectOptions}
                      selectedValue={formState.staffId}
                      onOptionSelect={handleSelectStaffOption}
                      placeholder="Search and select staff"
                      required
                      noOptionsText="No staff found"
                      className="mt-2"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Search Services
                    <ServiceSearchInput
                      value={serviceSearchQuery}
                      onChange={(event) =>
                        setServiceSearchQuery(event.target.value)
                      }
                      aria-label="Search services"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full bg-white px-3 py-2 text-sm tracking-normal normal-case placeholder:text-[#5f544b]/70 sm:px-3 sm:text-sm"
                    />
                  </label>
                </div>

                {/* Services Selection with Cards */}
                <div>
                  <p className="text-ink-muted mb-3 text-xs tracking-widest uppercase">
                    Select Services * (Choose one or more)
                  </p>
                  {services.length > 0 ? (
                    filteredServices.length > 0 ? (
                      <div className="scrollbar-hidden flex gap-3 overflow-x-auto pb-2">
                        {filteredServices.map((service) => {
                          const isSelected = formState.serviceIds.includes(
                            String(service.id),
                          );
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => handleToggleService(service.id)}
                              className={`flex min-w-[250px] flex-col gap-3 border-2 p-3 text-left transition sm:min-w-[280px] sm:gap-4 sm:p-4 ${
                                isSelected
                                  ? "border-ink bg-cream"
                                  : "border-ink/30 hover:border-ink/50 bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="border-ink/30 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white sm:h-11 sm:w-11">
                                  <Icon
                                    name={service.iconName}
                                    size={18}
                                    className="text-ink/70"
                                  />
                                </div>
                                {isSelected && (
                                  <span className="text-ink text-[0.65rem] tracking-widest uppercase sm:text-xs">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold sm:text-base">
                                  {service.title}
                                </p>
                                <p className="text-ink-muted mt-1 text-xs sm:text-sm">
                                  {service.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-[0.65rem] tracking-widest uppercase sm:text-xs">
                                <span>{service.priceLabel}</span>
                                <span>{service.durationLabel}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border-ink/30 bg-cream-soft text-ink-muted border-2 border-dashed p-4 text-center text-sm sm:p-6">
                        No services found. Try a different search.
                      </div>
                    )
                  ) : (
                    <div className="border-ink/30 bg-cream-soft text-ink-muted border-2 border-dashed p-4 text-center text-sm sm:p-6">
                      No services available. Add services first.
                    </div>
                  )}
                </div>

                {/* Selected Services Summary */}
                {selectedServices.length > 0 && (
                  <div className="border-ink/20 bg-cream grid gap-2 border-2 p-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                        Services Selected
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedServices.length} service
                        {selectedServices.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                        Total Price
                      </p>
                      <p className="text-sm font-semibold">
                        {CURRENCY_CODE} {formatNumber(totalPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                        Total Duration
                      </p>
                      <p className="text-sm font-semibold">
                        {totalDuration} min
                      </p>
                    </div>
                    <div>
                      <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
                        Selected Items
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedServices.map((service) => (
                          <span
                            key={service.id}
                            className="text-ink bg-ink/10 rounded px-2 py-1 text-[0.7rem] font-medium tracking-wider uppercase"
                          >
                            {service.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-ink-muted mb-2 text-xs tracking-widest uppercase">
                    Select Date *
                  </p>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
                    {dateOptions.map((option) => {
                      const isSelected =
                        option.value === formState.appointmentDate;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelectDate(option.value)}
                          className={`border-2 px-3 py-2 text-left text-xs tracking-widest uppercase transition ${
                            isSelected
                              ? "border-ink bg-cream"
                              : "border-ink/20 hover:border-ink/50 bg-white"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-ink-muted mb-2 text-xs tracking-widest uppercase">
                    Select Time *
                  </p>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-2">
                    {formTimeSlots.map((slot) => {
                      const isSelected = slot === formState.appointmentTime;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              appointmentTime: slot,
                            }))
                          }
                          className={`border-2 px-2 py-2 text-xs tracking-widest uppercase transition ${
                            isSelected
                              ? "border-ink bg-cream"
                              : "border-ink/20 hover:border-ink/50 bg-white"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="text-ink-muted block text-xs tracking-widest uppercase">
                  Notes
                  <textarea
                    name="notes"
                    value={formState.notes}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Add extra details for this appointment"
                    className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                  />
                </label>

                {services.length === 0 && (
                  <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
                    No active services found. Add services first.
                  </div>
                )}

                {staffMembers.length === 0 && (
                  <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
                    No staff found. Add staff members first.
                  </div>
                )}

                {dateOptions.length === 0 && (
                  <div className="border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
                    No open schedule found. Please set working hours first.
                  </div>
                )}

                {!isAppointmentTableReady && (
                  <div className="border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                    Appointments table is missing. Saves will be local only
                    until you create that table in Supabase.
                  </div>
                )}

                {(saveError || saveSuccess) && (
                  <div
                    className={`border-2 p-3 text-sm ${
                      saveError
                        ? "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]"
                        : "border-green-600/40 bg-green-600/10 text-green-700"
                    }`}
                  >
                    {saveError || saveSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSaving}
                    disabled={!canSaveAppointment}
                  >
                    Save Appointment
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelForm}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {loadError && (
        <div className="mb-3 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 p-3 text-sm text-[#b0412e]">
          {loadError}
        </div>
      )}

      {tableMessage && (
        <div className="mb-3 border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          {tableMessage}
        </div>
      )}

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 grid gap-3">
        <div className="border-ink/20 flex flex-wrap items-center justify-between gap-3 border-2 bg-white/90 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            {VIEW_TABS.map((tab, index) => {
              const isActive = tab.key === activeView;
              const isLast = index === VIEW_TABS.length - 1;
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
            <label className="border-ink/30 flex items-center gap-2 border-2 bg-white px-3 py-2 text-xs tracking-widest uppercase">
              <img src={calendarIcon} alt="" className="h-4 w-4 opacity-70" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="text-ink bg-transparent text-xs tracking-widest uppercase focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="border-ink/30 hover:border-ink border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase transition"
            >
              All Dates
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(getTodayIsoDate())}
              className="border-ink/30 hover:border-ink border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase transition"
            >
              Today
            </button>
          </div>
        </div>

        {activeView === "calendar" ? (
          <div className="border-ink/30 bg-cream-soft border-2 border-dashed p-6 text-center text-sm">
            Calendar view is coming soon. You currently have{" "}
            <span className="font-semibold">{filteredAppointments.length}</span>{" "}
            appointment(s) for{" "}
            <span className="font-semibold">
              {selectedDate
                ? formatDateLabel(selectedDate)
                : "all selected dates"}
            </span>
            .
          </div>
        ) : (
          <div className="border-ink/20 relative flex min-h-0 flex-1 flex-col border-2 bg-white/90">
            <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
            <div className="border-ink/10 bg-cream text-ink-muted hidden border-b-2 px-4 py-3 text-xs tracking-widest uppercase sm:grid sm:grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr]">
              <span>Date & Time</span>
              <span>Client</span>
              <span>Service</span>
              <span>Staff</span>
              <span>Duration</span>
              <span>Price</span>
              <span>Status</span>
            </div>

            <div className="scrollbar-hidden flex-1 overflow-y-auto">
              {isLoading && (
                <div className="p-4 text-sm text-[#5f544b]">
                  Loading appointments...
                </div>
              )}

              {!isLoading && filteredAppointments.length === 0 && (
                <div className="border-ink/30 bg-cream text-ink-muted m-4 border-2 border-dashed p-4 text-center text-sm">
                  No appointments found for{" "}
                  <span className="font-semibold">
                    {selectedDate
                      ? formatDateLabel(selectedDate)
                      : "the selected range"}
                  </span>
                  .
                </div>
              )}

              {!isLoading &&
                filteredAppointments.map((appointment) => (
                  <AppointmentRow
                    key={`${appointment.id}-${appointment.appointmentDate}-${appointment.timeLabel}`}
                    appointment={appointment}
                    onSelect={setSelectedAppointment}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
      {selectedAppointment &&
        (() => {
          const statusStyles = {
            Confirmed: "border-ink bg-ink text-cream",
            Pending: "border-ink/30 bg-cream text-ink",
            Completed: "border-ink text-ink",
            Cancelled: "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]",
          };

          const statusBadgeClass =
            statusStyles[selectedAppointment.status] ??
            "border-ink/30 text-ink-muted";

          return (
            <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setSelectedAppointment(null)}
              />

              {/* Panel */}
              <div className="border-ink/20 relative z-10 w-full max-w-lg border-2 bg-white sm:mx-4">
                {/* Top accent bar */}
                <div className="bg-ink h-1 w-full" />

                {/* Header */}
                <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
                  <div className="flex items-center gap-4">
                    {/* Initials avatar */}
                    <span className="border-ink/20 bg-cream text-ink-muted flex h-11 w-11 shrink-0 items-center justify-center border text-sm font-semibold tracking-widest uppercase">
                      {selectedAppointment.initials}
                    </span>
                    <div>
                      <p className="text-ink text-base leading-tight font-semibold">
                        {selectedAppointment.client}
                      </p>
                      <p className="text-ink-muted mt-0.5 text-xs tracking-widest uppercase">
                        Appointment Details
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Body — info grid */}
                <div className="bg-ink/10 border-ink/10 grid grid-cols-2 gap-px border-b-2">
                  {/* Service */}
                  <div className="bg-white px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Service
                    </p>
                    <p className="text-ink text-sm font-semibold">
                      {selectedAppointment.service}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="bg-white px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Status
                    </p>
                    <span
                      className={`inline-block rounded-full border-2 px-3 py-0.5 text-[0.65rem] tracking-widest uppercase ${statusBadgeClass}`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="bg-cream/60 px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Date
                    </p>
                    <p className="text-ink text-sm font-semibold">
                      {selectedAppointment.dateLabel}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="bg-cream/60 px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Time
                    </p>
                    <p className="text-ink text-sm font-semibold">
                      {selectedAppointment.timeLabel}
                    </p>
                  </div>

                  {/* Staff */}
                  <div className="bg-white px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Staff
                    </p>
                    <p className="text-ink text-sm font-semibold">
                      {selectedAppointment.staff}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="bg-white px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Duration
                    </p>
                    <p className="text-ink text-sm font-semibold">
                      {selectedAppointment.duration}
                    </p>
                  </div>

                  {/* Price — full width */}
                  <div className="bg-cream col-span-2 px-5 py-4">
                    <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                      Price
                    </p>
                    <p className="text-ink text-base font-semibold">
                      {selectedAppointment.price}
                    </p>
                  </div>
                  {/* Notes — full width, only if present */}
                  {selectedAppointment.notes && (
                    <div className="col-span-2 bg-white px-5 py-4">
                      <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                        Notes
                      </p>
                      <p className="text-ink text-sm leading-relaxed">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-0">
                  {selectedAppointment.status === "Pending" && (
                    <button
                      onClick={() => handleConfirm(selectedAppointment.id)}
                      className="border-ink/20 text-ink hover:bg-ink hover:text-cream flex-1 border-r-2 px-4 py-3 text-xs tracking-widest uppercase transition"
                    >
                      Confirm
                    </button>
                  )}

                  {selectedAppointment.status === "Confirmed" && (
                    <button
                      onClick={() => handleComplete(selectedAppointment.id)}
                      className="border-ink/20 text-ink hover:bg-ink hover:text-cream flex-1 border-r-2 px-4 py-3 text-xs tracking-widest uppercase transition"
                    >
                      Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(selectedAppointment.id)}
                    className="flex-1 px-4 py-3 text-xs tracking-widest text-[#b0412e] uppercase transition hover:bg-[#b0412e] hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </section>
  );
};

const AppointmentRow = ({ appointment, onSelect }) => {
  const statusStyles = {
    Confirmed: "border-ink bg-ink text-cream",
    Pending: "border-ink/30 bg-cream text-ink",
    Completed: "border-ink text-ink",
    Cancelled: "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]",
  };

  return (
    <div
      onClick={() => onSelect(appointment)}
      className="border-ink/10 hover:bg-cream/50 grid cursor-pointer gap-3 border-b px-4 py-3 text-sm transition sm:grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr] sm:items-center"
    >
      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Date & Time
      </p>
      <div className="flex items-center gap-2">
        <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
          <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
        </span>
        <div>
          <p className="font-semibold">{appointment.timeLabel}</p>
          <p className="text-ink-muted text-xs">{appointment.dateLabel}</p>
        </div>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Client
      </p>
      <div className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold uppercase">
          {appointment.initials}
        </span>
        <span className="font-semibold">{appointment.client}</span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Service
      </p>
      <span>{getServiceSummary(appointment.service)}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Staff
      </p>
      <span>{appointment.staff}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Duration
      </p>
      <span>{appointment.duration}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Price
      </p>
      <span className="font-semibold">{appointment.price}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Status
      </p>
      <div className="flex items-center gap-2">
        <span
          className={`w-fit rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase ${
            statusStyles[appointment.status] ?? "border-ink/30 text-ink-muted"
          }`}
        >
          {appointment.status}
        </span>
        {appointment.isLocalDraft && (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-[0.55rem] tracking-widest text-amber-700 uppercase">
            Local
          </span>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;

// show this not box
// {appointment.notes && (
//         <div className="sm:col-span-7 flex items-start gap-2 border-t border-ink/10 pt-2 mt-1">
//           <span className="text-ink-muted text-[0.65rem] tracking-widest uppercase shrink-0">
//             Notes:
//           </span>
//           <span className="text-xs text-ink-muted italic">{appointment.notes}</span>
//         </div>
//       )}
//     </div>
//   );
