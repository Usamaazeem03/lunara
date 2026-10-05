import { localizedError } from "../i18n/localizedError.js";
import i18n from "../i18n/i18n.js";
import { supabase } from "./supabase";
import { invalidatePublicCache } from "./apiCache";

const getServiceMutationError = (error, fallbackMessage) => {
  const errorText =
    `${error?.message ?? ""} ${error?.details ?? ""}`.toLowerCase();

  if (
    error?.code === "23503" &&
    errorText.includes("appointments_service_id_fkey")
  ) {
    const bookingConflict = localizedError("services.thisServiceHasExistingBookingsSoItCannotBeDeleted");

    bookingConflict.isServiceBookingConflict = true;

    return bookingConflict;
  }

  return new Error(error?.message || fallbackMessage);
};

// ─────────────────────────────────────────────
// Get services
// ─────────────────────────────────────────────

export async function getServices(ownerId) {
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, name, description, category, price, duration_minutes, image, is_active, owner_id, created_at",
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    throw localizedError("services.servicesCouldNotBeLoaded");
  }

  return data;
}

// ─────────────────────────────────────────────
// Create service
// ─────────────────────────────────────────────

export async function createService(payload) {
  let imagePath = null;
  let imageName = null;

  // Upload image first
  if (payload.image) {
    imageName = `${Math.random()}-${payload.image.name}`.replaceAll("/", "");

    const { error: storageError } = await supabase.storage
      .from("Service_images")
      .upload(imageName, payload.image);

    if (storageError) {
      console.error("IMAGE UPLOAD ERROR:", storageError);

      throw new Error(storageError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("Service_images")
      .getPublicUrl(imageName);

    imagePath = publicUrlData.publicUrl;
  }

  // Save service
  const { data, error } = await supabase
    .from("services")
    .insert([
      {
        ...payload,
        image: imagePath,
      },
    ])
    .select(
      "id, name, description, category, price, duration_minutes, image, is_active, owner_id",
    )
    .single();

  if (error) {
    // Database failed after image was uploaded.
    // Remove unused image.
    if (imageName) {
      await supabase.storage.from("Service_images").remove([imageName]);
    }

    throw new Error(error.message || i18n.t("services.unableToSaveTheService"));
  }

  // Database changed successfully.
  // Old public Redis cache is now outdated.
  await invalidatePublicCache("services");

  return {
    data,
    success: true,
    message: i18n.t("services.serviceAdded"),
  };
}

// ─────────────────────────────────────────────
// Update service
// ─────────────────────────────────────────────

export async function updateService(serviceId, payload) {
  const updatePayload = {
    ...payload,
  };

  let uploadedImageName = null;

  // User selected a new image
  if (payload.image instanceof File) {
    uploadedImageName = `${Math.random()}-${payload.image.name}`.replaceAll(
      "/",
      "",
    );

    const { error: storageError } = await supabase.storage
      .from("Service_images")
      .upload(uploadedImageName, payload.image);

    if (storageError) {
      throw new Error(storageError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("Service_images")
      .getPublicUrl(uploadedImageName);

    updatePayload.image = publicUrlData.publicUrl;
  } else {
    // No new image selected.
    // Keep existing database image.
    delete updatePayload.image;
  }

  const { data, error } = await supabase
    .from("services")
    .update(updatePayload)
    .eq("id", serviceId)
    .select(
      "id, name, description, category, price, duration_minutes, image, is_active, owner_id",
    )
    .single();

  if (error) {
    // If we uploaded a new image but DB update failed,
    // remove that newly uploaded unused image.
    if (uploadedImageName) {
      await supabase.storage.from("Service_images").remove([uploadedImageName]);
    }

    throw getServiceMutationError(error, i18n.t("services.unableToUpdateTheService"));
  }

  // Service changed → remove stale public cache
  await invalidatePublicCache("services");

  return {
    data,
    success: true,
    message: i18n.t("services.serviceUpdated"),
  };
}

// ─────────────────────────────────────────────
// Delete service
// ─────────────────────────────────────────────

export async function deleteService(serviceId) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    throw getServiceMutationError(error, i18n.t("services.unableToDeleteTheService"));
  }

  // Service deleted → remove stale public cache
  await invalidatePublicCache("services");

  return {
    success: true,
    message: i18n.t("services.serviceDeleted"),
  };
}
