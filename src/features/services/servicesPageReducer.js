const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  category: "",
  price: "",
  duration: "",
  isActive: true,
};
export const initialServicesPageState = {
  activeCategory: "All",
  showForm: false,
  formState: EMPTY_FORM,
  saveError: "",
  saveSuccess: "",
  actionError: "",
  actionSuccess: "",
};

export function servicesPageReducer(state, action) {
  switch (action.type) {
    case "selectCategory":
      return { ...state, activeCategory: action.category };
    case "openCreateForm":
      return {
        ...initialServicesPageState,
        showForm: true,
      };
    case "closeForm":
      return {
        ...state,
        showForm: false,
        formState: EMPTY_FORM,
        saveError: "",
        saveSuccess: "",
      };
    case "editService":
      return {
        ...initialServicesPageState,
        showForm: true,
        formState: action.formState,
      };
    case "clearActionError":
      return { ...state, actionError: "" };
    default:
      return state;
  }
}


export const getFormValues = (service) => ({
  id: service.id,
  name: service.name ?? "",
  description: service.description ?? "",
  category: service.category ?? "",
  price:
    service.price !== null && service.price !== undefined
      ? String(service.price)
      : "",
  duration:
    service.duration_minutes !== null && service.duration_minutes !== undefined
      ? String(service.duration_minutes)
      : "",
  isActive: service.is_active ?? true,
});
