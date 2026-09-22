import { getStaffRatingSummaries } from "./apiStaffRatings";
import { supabase } from "./supabase";
import { validateStaffImage } from "../Shared/lib/staffImage";

const STAFF_COLUMNS =
  "id, name, image, phone, email, role, schedule, is_on_shift, created_at, specialties, rating, appointments_count, owner_id";

function requireOwner(ownerId) {
  if (!ownerId) throw new Error("Please sign in to manage staff.");
}

export async function getStaff(ownerId) {
  requireOwner(ownerId);
  const { data, error } = await supabase
    .from("staff")
    .select(STAFF_COLUMNS)
    .eq("owner_id", ownerId)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message || "Unable to load staff members.");
  const ratings = await getStaffRatingSummaries(ownerId);
  return Promise.all(
    (data ?? []).map(async (member) => {
      const { count, error: countError } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("staff_id", member.id);
      if (countError) {
        throw new Error(
          countError.message || "Unable to load staff appointment counts.",
        );
      }
      return {
        ...member,
        ...(ratings.get(String(member.id)) ?? { rating: 0, rating_count: 0 }),
        appointments_count: count ?? 0,
      };
    }),
  );
}

const STAFF_IMAGE_BUCKET = "Staff_images";

async function saveStaff(payload, id = null) {
  requireOwner(payload.owner_id);
  const { image, ...staffPayload } = payload;
  let uploadedPath = null;

  if (image instanceof File) {
    const validation = validateStaffImage(image);
    if (validation !== true) throw new Error(validation);
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    }[image.type];
    uploadedPath = `${payload.owner_id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(STAFF_IMAGE_BUCKET)
      .upload(uploadedPath, image);
    if (error)
      throw new Error(error.message || "Unable to upload staff image.");
    const { data } = supabase.storage
      .from(STAFF_IMAGE_BUCKET)
      .getPublicUrl(uploadedPath);
    staffPayload.image = data.publicUrl;
  }

  // Omitting image on update preserves the saved photo.
  try {
    const query = id
      ? supabase
          .from("staff")
          .update(staffPayload)
          .eq("id", id)
          .eq("owner_id", payload.owner_id)
      : supabase.from("staff").insert([staffPayload]);
    const { data, error } = await query.select(STAFF_COLUMNS).single();
    if (error) throw new Error(error.message || "Unable to save staff member.");
    return data;
  } catch (error) {
    if (uploadedPath) {
      // A failed database save must not leave the new upload behind.
      try {
        await supabase.storage.from(STAFF_IMAGE_BUCKET).remove([uploadedPath]);
      } catch {
        /* Preserve the original save error. */
      }
    }
    throw error;
  }
}

export function createStaff(payload) {
  return saveStaff(payload);
}

export function updateStaff(id, payload) {
  return saveStaff(payload, id);
}

export async function deleteStaff(id, ownerId) {
  requireOwner(ownerId);
  const { data, error } = await supabase
    .from("staff")
    .delete()
    .eq("id", id)
    .eq("owner_id", ownerId)
    .select("id")
    .single();
  if (error) throw new Error(error.message || "Unable to delete staff member.");
  return data;
}
