import { toast } from "react-hot-toast";

const normalizeMessage = (message) => {
  if (message instanceof Error) {
    return message.message || "Something went wrong.";
  }

  if (typeof message === "string") {
    return message.trim();
  }

  if (message === null || message === undefined) {
    return "";
  }

  return String(message).trim();
};

export const notify = {
  success(message, options) {
    return toast.success(normalizeMessage(message), options);
  },
  error(message, options) {
    return toast.error(normalizeMessage(message), options);
  },
  info(message, options) {
    return toast(normalizeMessage(message), options);
  },
  loading(message, options) {
    return toast.loading(normalizeMessage(message), options);
  },
  dismiss(id) {
    return toast.dismiss(id);
  },
};

export const confirmToast = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "danger",
}) =>
  new Promise((resolve) => {
    let toastId;

    const close = (value) => {
      if (toastId) {
        toast.dismiss(toastId);
      }
      resolve(value);
    };

    toastId = toast.custom(
      (t) => (
        <div
          className={`w-[min(92vw,20rem)] rounded-[20px] border border-ink/10 bg-white/95 p-4 shadow-[0_18px_50px_rgba(45,38,32,0.18)] backdrop-blur-xl transition-all duration-200 ${
            t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                confirmTone === "danger" ? "bg-[#b0412e]" : "bg-ink"
              }`}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{title}</p>
              {description ? (
                <p className="text-ink/60 mt-1 text-sm leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => close(false)}
              className="border-ink/20 text-ink hover:border-ink flex-1 rounded-xl border bg-white px-3 py-2 text-xs tracking-[0.2em] uppercase transition"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => close(true)}
              className={`flex-1 rounded-xl px-3 py-2 text-xs tracking-[0.2em] uppercase transition ${
                confirmTone === "danger"
                  ? "bg-[#b0412e] text-white hover:bg-[#9c3627]"
                  : "bg-ink text-cream hover:bg-ink/90"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  });
