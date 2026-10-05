import { localizedError } from "../../../i18n/localizedError.js";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { readQrFrame } from "./qrScanner.js";

export default function BookingCamera({ onScan, onStop }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false;
    let stream;
    let timer;
    const stopTracks = () =>
      stream?.getTracks().forEach((track) => track.stop());
    async function scan() {
      if (disposed) return;
      try {
        const video = videoRef.current;
        if (video?.readyState >= 2) {
          const value = await readQrFrame(
            video,
            video.videoWidth,
            video.videoHeight,
          );
          if (disposed) return;
          if (value) {
            stopTracks();
            onScan(value);
            return;
          }
        }
        timer = setTimeout(scan, 250);
      } catch {
        if (!disposed)
          setError(
            t("bookingPass.couldNotReadTheCameraTryUploadingAScreenshotOr"),
          );
        stopTracks();
      }
    }
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw localizedError("bookingPass.cameraScanningNeedsHttpsAndABrowserWithCameraAccess");
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
          },
          audio: false,
        });
        if (disposed) {
          stopTracks();
          return;
        }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        if (disposed) return;
        setReady(true);
        scan();
      } catch (cause) {
        stopTracks();
        if (!disposed)
          setError(
            cause.name === "NotAllowedError"
              ? t("bookingPass.cameraAccessWasDeniedAllowItInYourBrowserOr")
              : cause.name === "NotFoundError"
                ? t("bookingPass.noCameraFoundUploadAnImageOrPasteTheReference")
                : cause.message || t("bookingPass.theCameraCouldNotStart"),
          );
      }
    }
    start();
    return () => {
      disposed = true;
      clearTimeout(timer);
      stopTracks();
    };
  }, [onScan]);

  return (
    <div className="space-y-3">
      <div className="bg-ink relative overflow-hidden rounded-2xl">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-label={t("bookingPass.qrScannerCameraPreview")}
          className="aspect-square w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-[18%] rounded-2xl border-2 border-white/80" />
        <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white">
          {ready ? t("bookingPass.holdTheQrInsideTheFrame") : t("bookingPass.startingCamera")}
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onStop}
        className="border-ink/20 min-h-11 w-full rounded-xl border text-sm"
      > {t("bookingPass.stopCamera")} </button>
    </div>
  );
}
