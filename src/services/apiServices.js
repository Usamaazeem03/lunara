import { supabase } from "./supabase";

const getServiceMutationError = (error, fallbackMessage) => {
  const errorText =
    `${error?.message ?? ""} ${error?.details ?? ""}`.toLowerCase();

  if (
    error?.code === "23503" &&
    errorText.includes("appointments_service_id_fkey")
  ) {
    const bookingConflict = new Error(
      "This service has existing bookings, so it cannot be deleted. Mark it inactive instead.",
    );
    bookingConflict.isServiceBookingConflict = true;
    return bookingConflict;
  }

  return new Error(error?.message || fallbackMessage);
};

// get services
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
    throw new Error("Services could not be loaded!");
  }

  return data;
}

// Create new service
// export async function createService(payload) {
//   const { data, error } = await supabase
//     .from("services")
//     .insert([payload])
//     .select(
//       "id, name, description, category, price, duration_minutes, is_active, owner_id",
//     )
//     .single();

//   if (error) {
//     throw new Error(error.message || "Unable to save the service.");
//   }

//   return { data, success: true, message: "Service added." };
// }
export async function createService(payload) {
  let imagePath = null;

  if (payload.image) {
    const imageName = `${Math.random()}-${payload.image.name}`.replaceAll(
      "/",
      "",
    );

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

  const { data, error } = await supabase
    .from("services")
    .insert([{ ...payload, image: imagePath }])
    .select(
      "id, name, description, category, price, duration_minutes, image, is_active, owner_id",
    )
    .single();

  if (error) {
    if (imagePath) {
      await supabase.storage.from("Service_images").remove([imageName]);
    }
    throw new Error(error.message || "Unable to save the service.");
  }

  return { data, success: true, message: "Service added." };
}
// Update existing service
// export async function updateService(serviceId, payload) {
//   const { data, error } = await supabase
//     .from("services")
//     .update(payload)
//     .eq("id", serviceId)
//     .select(
//       "id, name, description, category, price, duration_minutes, image, is_active, owner_id",
//     )
//     .single();

//   if (error) {
//     throw getServiceMutationError(error, "Unable to update the service.");
//   }

//   return { data, success: true, message: "Service updated." };
// }
export async function updateService(serviceId, payload) {
  let updatePayload = { ...payload };

  if (payload.image instanceof File) {
    const imageName = `${Math.random()}-${payload.image.name}`.replaceAll(
      "/",
      "",
    );

    const { error: storageError } = await supabase.storage
      .from("Service_images")
      .upload(imageName, payload.image);

    if (storageError) throw new Error(storageError.message);

    const { data: publicUrlData } = supabase.storage
      .from("Service_images")
      .getPublicUrl(imageName);

    updatePayload.image = publicUrlData.publicUrl;
  } else {
    delete updatePayload.image; // no new file picked, don't overwrite existing image
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
    throw getServiceMutationError(error, "Unable to update the service.");
  }

  return { data, success: true, message: "Service updated." };
}

// Delete service
export async function deleteService(serviceId) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    throw getServiceMutationError(error, "Unable to delete the service.");
  }

  return { success: true, message: "Service deleted." };
}
