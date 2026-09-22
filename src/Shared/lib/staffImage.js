export const STAFF_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const STAFF_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export function validateStaffImage(file) {
  if (!file) return true;
  if (!STAFF_IMAGE_TYPES.includes(file.type))
    return "Choose a JPEG, PNG, WebP, or GIF image.";
  if (file.size > STAFF_IMAGE_MAX_SIZE)
    return "Choose an image smaller than 5 MB.";
  return true;
}
