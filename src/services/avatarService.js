import { supabase } from "../Shared/lib/supabaseClient";

/**
 * Avatar Service - Handles avatar image uploads and retrieval
 * Stores images in Supabase Storage and metadata in database
 */

// Upload avatar image to Supabase Storage
export const uploadAvatar = async (userId, file) => {
  if (!userId) throw new Error("User ID is required");
  if (!file) throw new Error("File is required");

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  try {
    // Create unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `${userId}_${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
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

// Get avatar URL from storage
export const getAvatarUrl = (filename) => {
  if (!filename) return null;
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(`public/${filename}`);
  return publicUrl;
};

// Delete old avatar image
export const deleteAvatar = async (filename) => {
  if (!filename) return;

  try {
    await supabase.storage.from("avatars").remove([`public/${filename}`]);
  } catch (error) {
    console.error("Avatar delete error:", error);
    // Don't throw - just log. We still want to save new avatar even if old delete fails
  }
};

// Get avatar by user ID
export const getAvatarByUserId = async (userId) => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_img")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.avatar_img;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return null;
  }
};
