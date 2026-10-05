import { localizedError } from "../i18n/localizedError.js";
import { supabase } from "./supabase";

/**
 * Avatar Service - Handles avatar image uploads and retrieval
 * Stores images in Supabase Storage and metadata in database
 */

// Upload avatar image to Supabase Storage
export const uploadAvatar = async (userId, file) => {
  if (!userId) throw localizedError("services.userIdIsRequired");
  if (!file) throw localizedError("services.fileIsRequired");

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw localizedError("services.onlyJpegPngWebpAndGifImagesAreAllowed");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw localizedError("services.fileSizeMustBeLessThan5mb");
  }

  try {
    // Create unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `${userId}_${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("avatars") // bucket name
      .upload(`public/${filename}`, file, {
        cacheControl: "3600",
        upsert: false, // Don't overwrite, create new versions
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(`public/${filename}`);

    // Save avatar_img URL to profiles table
    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        avatar_img: publicUrl,
      })
      .eq("id", userId);

    if (dbError) {
      // If DB update fails, delete the uploaded file
      await supabase.storage.from("avatars").remove([`public/${filename}`]);
      throw dbError;
    }

    return {
      filename,
      publicUrl,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw error;
  }
};
