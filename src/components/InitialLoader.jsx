import { useEffect, useRef, useState } from "react";

function InitialLoader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef(0);
  const fadeTimerRef = useRef(0);
  const doneTimerRef = useRef(0);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(function () {
    const DURATION_MS = 2200;
    const HOLD_MS = 220;
    const FADE_MS = 500;
    let start = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      fadeTimerRef.current = window.setTimeout(() => {
        setIsFading(true);
      }, HOLD_MS);

      doneTimerRef.current = window.setTimeout(() => {
        setDone(true);
        if (onFinishRef.current) {
          onFinishRef.current();
        }
      }, HOLD_MS + FADE_MS);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fadeTimerRef.current);
      clearTimeout(doneTimerRef.current);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f3efe9] bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f3efe9_45%,_#ede2d3_100%)] transition-opacity duration-[500ms] ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-[min(520px,90vw)]">
        <div className="mb-4 flex items-end justify-between text-[#1a1a1a]">
          <span className="font-orbitron text-xs uppercase tracking-[0.35em]">
            Initializing
          </span>
          <span className="font-orbitron text-4xl tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-black/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-black via-[#111] to-black shadow-[0_0_18px_rgba(0,0,0,0.35)] transition-[width] duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-black/60">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-black animate-pulse"></span>
          <span className="font-orbitron">Crafting your experience</span>
        </div>
      </div>
    </div>
  );
}

export default InitialLoader;
