import { localizedError } from "../../../i18n/localizedError.js";
let decoderPromise;
function getDecoder() {
  decoderPromise ??= import("jsqr").then((module) => module.default);
  return decoderPromise;
}

export async function readQrFrame(source, width, height) {
  if (!width || !height) return null;
  const decode = await getDecoder();
  const scale = Math.min(1, 1200 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  return decode(pixels.data, pixels.width, pixels.height)?.data ?? null;
}

export async function readQrImage(file) {
  if (!file || !file.type.startsWith("image/"))
    throw localizedError("bookingPass.chooseAPhotoOrScreenshotOfTheBookingPass");
  if (file.size > 15 * 1024 * 1024)
    throw localizedError("bookingPass.chooseAnImageSmallerThan15Mb");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () =>
        reject(
          localizedError("bookingPass.thisImageCouldNotBeOpenedTryAPngOr"),
        );
      image.src = url;
    });
    const reference = await readQrFrame(
      image,
      image.naturalWidth,
      image.naturalHeight,
    );
    if (!reference)
      throw localizedError("bookingPass.noQrCodeFoundTryAClearCloseUpPhoto");
    return reference;
  } finally {
    URL.revokeObjectURL(url);
  }
}
