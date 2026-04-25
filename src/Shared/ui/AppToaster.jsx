import { useEffect, useRef } from "react";
import { useToaster, toast } from "react-hot-toast";

// ─── Individual Toast Card ───────────────────────────────────────────────────
const ToastCard = ({ t, handlers }) => {
  const { startPause, endPause } = handlers;
  const progressRef = useRef(null);

  const isSuccess = t.type === "success";
  const isError = t.type === "error";
  const isLoading = t.type === "loading";
  const isCustom = t.type === "custom";

  // Accent color per type
  const accentColor = isError ? "#b0412e" : isLoading ? "#b68a4f" : "#2d2620";

  // Label per type
  const typeLabel = isError
    ? "Error"
    : isSuccess
      ? "Success"
      : isLoading
        ? "Loading"
        : "Notice";

  // Icon per type
  const Icon = () => {
    if (isLoading) {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            animation: "lunara-spin 0.8s linear infinite",
            flexShrink: 0,
          }}
        >
          <circle
            cx="7"
            cy="7"
            r="5.5"
            stroke="#b68a4f"
            strokeWidth="1.5"
            strokeDasharray="20 14"
          />
        </svg>
      );
    }
    if (isError) {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <circle cx="7" cy="7" r="6" stroke="#b0412e" strokeWidth="1.5" />
          <path
            d="M7 4v3.5M7 9.5v.5"
            stroke="#b0412e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    if (isSuccess) {
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <circle cx="7" cy="7" r="6" stroke="#2d2620" strokeWidth="1.5" />
          <path
            d="M4.5 7l2 2 3-3"
            stroke="#2d2620"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <circle cx="7" cy="7" r="6" stroke="#2d2620" strokeWidth="1.5" />
        <path
          d="M7 6.5v4M7 4.5v.5"
          stroke="#2d2620"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Animate progress bar
  useEffect(() => {
    if (!progressRef.current || isLoading || t.duration === Infinity) return;
    const el = progressRef.current;
    el.style.transition = "none";
    el.style.width = "100%";
    // Force reflow
    void el.offsetWidth;
    el.style.transition = `width ${t.duration}ms linear`;
    el.style.width = "0%";
  }, [t.id, t.duration, isLoading]);

  // If it's a fully custom toast (like confirmToast), render it directly
  if (isCustom) {
    return (
      <div
        style={{
          opacity: t.visible ? 1 : 0,
          transform: t.visible
            ? "translateX(0) scale(1)"
            : "translateX(100%) scale(0.95)",
          transition:
            "opacity 220ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {typeof t.message === "function" ? t.message(t) : t.message}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      onClick={() => toast.dismiss(t.id)}
      style={{
        width: "min(380px, calc(100vw - 2rem))",
        background: isError
          ? "rgba(255, 248, 246, 0.98)"
          : "rgba(247, 245, 240, 0.98)",
        border: "2px solid rgba(45, 38, 32, 0.12)",
        borderLeft: `3px solid ${accentColor}`,
        boxShadow:
          "0 8px 40px rgba(45, 38, 32, 0.14), 0 2px 8px rgba(45, 38, 32, 0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "pointer",
        overflow: "hidden",
        opacity: t.visible ? 1 : 0,
        transform: t.visible
          ? "translateX(0) scale(1)"
          : "translateX(100%) scale(0.96)",
        transition:
          "opacity 240ms ease, transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
        position: "relative",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "2px",
          background: accentColor,
          width: "100%",
          opacity: 0.7,
        }}
      />

      {/* Body */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          padding: "12px 14px 14px",
        }}
      >
        {/* Icon */}
        <div style={{ paddingTop: "1px" }}>
          <Icon />
        </div>

        {/* Text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 600,
              marginBottom: "3px",
              opacity: 0.85,
            }}
          >
            {typeLabel}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              color: "#2d2620",
              lineHeight: 1.5,
              fontWeight: 500,
              wordBreak: "break-word",
            }}
          >
            {typeof t.message === "function" ? t.message(t) : t.message}
          </p>
        </div>

        {/* Dismiss "×" */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          style={{
            flexShrink: 0,
            background: "none",
            border: "1.5px solid rgba(45,38,32,0.15)",
            color: "rgba(45,38,32,0.45)",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6rem",
            cursor: "pointer",
            padding: 0,
            marginTop: "1px",
            transition: "border-color 150ms, color 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(45,38,32,0.5)";
            e.currentTarget.style.color = "rgba(45,38,32,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(45,38,32,0.15)";
            e.currentTarget.style.color = "rgba(45,38,32,0.45)";
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      {!isLoading && t.duration !== Infinity && (
        <div
          style={{
            height: "2px",
            background: "rgba(45,38,32,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            ref={progressRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "100%",
              background: accentColor,
              opacity: 0.35,
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─── Toaster Container ───────────────────────────────────────────────────────
function AppToaster() {
  const { toasts, handlers } = useToaster();

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes lunara-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Fixed container — bottom-right on desktop, bottom-center on mobile */}
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          bottom: "1.25rem",
          right: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
        // Mobile override via inline media isn't possible — use a wrapper trick
        className="lunara-toaster-root"
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastCard t={t} handlers={handlers} />
          </div>
        ))}
      </div>

      {/* Mobile centering override */}
      <style>{`
        @media (max-width: 480px) {
          .lunara-toaster-root {
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            align-items: center !important;
            padding: 0 1rem 1rem !important;
          }
        }
      `}</style>
    </>
  );
}

export default AppToaster;
