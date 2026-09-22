import { useEffect, useRef, useState } from "react";
import { readQrFrame } from "./qrScanner.js";

export default function BookingCamera({ onScan, onStop }) {
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
            "Could not read the camera. Try uploading a screenshot or pasting the reference.",
          );
        stopTracks();
      }
    }
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error(
            "Camera scanning needs HTTPS and a browser with camera access. You can upload a screenshot instead.",
          );
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
              ? "Camera access was denied. Allow it in your browser, or upload a screenshot."
              : cause.name === "NotFoundError"
                ? "No camera found. Upload an image or paste the reference instead."
                : cause.message || "The camera could not start.",
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
          aria-label="QR scanner camera preview"
          className="aspect-square w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-[18%] rounded-2xl border-2 border-white/80" />
        <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white">
          {ready ? "Hold the QR inside the frame" : "Starting camera..."}
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
      >
        Stop camera
      </button>
    </div>
  );
}
