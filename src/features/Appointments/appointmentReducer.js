export const EMPTY_APPOINTMENT_FORM = {
  clientId: "",
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

export const createAppointmentInitialState = (
  today,
  initialWorkingHours = [],
  initialAppointments = [],
) => ({
  activeView: "list",
  selectedDate: today,
  selectedStatus: "all",
  currentPage: 1,
  staffMembers: [],
  workingHours: initialWorkingHours,
  appointments: initialAppointments,
  localDraftAppointments: [],
  clients: [],
  isLoading: true,
  loadError: "",
  isAppointmentTableReady: true,
  tableMessage: "",
  showForm: false,
  formState: EMPTY_APPOINTMENT_FORM,
  serviceSearchQuery: "",
  staffSearchValue: "",
  selectedAppointment: null,
});

export function appointmentReducer(state, action) {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "update":
      return {
        ...state,
        [action.field]:
          typeof action.value === "function"
            ? action.value(state[action.field])
            : action.value,
      };
    case "setFilter":
      return {
        ...state,
        currentPage: 1,
        [action.field]: action.value,
      };
    case "updateForm":
      return {
        ...state,
        formState:
          typeof action.value === "function"
            ? action.value(state.formState)
            : { ...state.formState, ...action.value },
      };
    case "openForm":
      return {
        ...state,
        showForm: true,
        formState: action.formState,
        serviceSearchQuery: "",
        staffSearchValue: action.staffSearchValue,
      };
    case "closeForm":
      return {
        ...state,
        showForm: false,
        formState: EMPTY_APPOINTMENT_FORM,
        serviceSearchQuery: "",
        staffSearchValue: "",
      };
    case "addLocalDrafts":
      return {
        ...state,
        localDraftAppointments: [
          ...action.appointments,
          ...state.localDraftAppointments,
        ],
        selectedDate: action.selectedDate ?? state.selectedDate,
      };
    case "replaceAppointments":
      return { ...state, appointments: action.appointments };
    case "updateAppointmentStatus":
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment.id === action.id
            ? { ...appointment, status: action.status }
            : appointment,
        ),
      };
    case "deleteAppointment":
      return {
        ...state,
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== action.id,
        ),
      };
    default:
      return state;
  }
}
