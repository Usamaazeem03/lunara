import i18n from "../../i18n/i18n.js";
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
    return i18n.t("staff.chooseAJpegPngWebpOrGifImage");
  if (file.size > STAFF_IMAGE_MAX_SIZE)
    return i18n.t("staff.chooseAnImageSmallerThan5Mb");
  return true;
}
