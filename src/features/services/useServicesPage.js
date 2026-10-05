import { translatedMessage } from "../../i18n/translatedMessage.jsx";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import { useEffect, useMemo, useReducer } from "react";

import { confirmToast, notify } from "../../Shared/lib/toast.jsx";
import { useOwnerId } from "../../globalHooks/useOwnerId.js";
import { useCurrencyCode } from "../settings/useCurrencyCode.js";
import { useDeleteService } from "./useDeleteService.js";
import { useServices } from "./useServices.js";
import {
  initialServicesPageState,
  servicesPageReducer,
  getFormValues,
} from "./servicesPageReducer.js";

export function useServicesPage() {
  useTranslation();
  const { ownerId } = useOwnerId();
  const { currencyCode } = useCurrencyCode(ownerId);
  const { services, isLoading, error } = useServices(ownerId, currencyCode);
  const {
    isPending: isDeleting,
    deletingServiceId,
    deleteService,
  } = useDeleteService(ownerId);

  const [pageState, dispatch] = useReducer(
    servicesPageReducer,
    initialServicesPageState,
  );
  const {
    activeCategory,
    showForm,
    formState,
    saveError,
    saveSuccess,
    actionError,
    actionSuccess,
  } = pageState;

  const loadError = error?.message ?? "";

  useEffect(() => {
    if (loadError) notify.error(loadError);
  }, [loadError]);

  useEffect(() => {
    if (saveError) notify.error(saveError);
  }, [saveError]);

  useEffect(() => {
    if (saveSuccess) notify.success(saveSuccess);
  }, [saveSuccess]);

  useEffect(() => {
    if (actionError) notify.error(actionError);
  }, [actionError]);

  useEffect(() => {
    if (actionSuccess) notify.success(actionSuccess);
  }, [actionSuccess]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((service) => service.category).filter(Boolean),
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [services, i18n.resolvedLanguage]);

  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : "All";

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") return services;
    return services.filter((service) => service.category === selectedCategory);
  }, [selectedCategory, services, i18n.resolvedLanguage]);

  const openCreateForm = () => {
    dispatch({ type: "openCreateForm" });
  };

  const closeForm = () => {
    dispatch({ type: "closeForm" });
  };

  const editService = (service) => {
    dispatch({
      type: "editService",
      formState: getFormValues(service),
    });
  };

  const deleteServiceWithConfirmation = async (service) => {
    const confirmed = await confirmToast({
      title: translatedMessage("services.delete", { value1: service.title }),
      description: translatedMessage("common.thisCannotBeUndone"),
      confirmLabel: translatedMessage("services.deleteService"),
      cancelLabel: translatedMessage("services.keepService"),
      confirmTone: "danger",
    });

    if (!confirmed) return;

    dispatch({ type: "clearActionError" });
    deleteService(service.id, {
      onError: (deleteError) => {
        if (deleteError.isServiceBookingConflict) {
          notify.warning(deleteError);
          return;
        }

        notify.error(deleteError);
      },
    });
  };

  return {
    categories,
    selectedCategory,
    setActiveCategory: (category) =>
      dispatch({ type: "selectCategory", category }),
    filteredServices,
    isLoading,
    loadError,
    showForm,
    formState,
    saveError,
    saveSuccess,
    actionError,
    actionSuccess,
    isDeleting,
    deletingServiceId,
    openCreateForm,
    closeForm,
    editService,
    deleteService: deleteServiceWithConfirmation,
  };
}
