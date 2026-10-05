import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRateStaff } from "./useRateStaff";

export default function StaffRatingForm({ appointment }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const { mutate, isPending, isSuccess, error } = useRateStaff(
    appointment.owner_id,
  );
  if (
    appointment.status?.trim().toLowerCase() !== "completed" ||
    !appointment.staff_id
  )
    return null;

  const savedRating = appointment.staff_rating ?? (isSuccess ? rating : null);
  return (
    <div className="border-ink/10 mt-3 rounded-2xl border bg-white/70 p-4 sm:p-5">
      {savedRating ? (
        <p role="status" className="text-ink text-sm"> {t("staff.youRated")} {appointment.staff_name || t("staff.yourStylist")}{" "}
          <span className="font-semibold">{savedRating}{t("staff.5Stars")}</span>{t("staff.thankYou")} </p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!rating || isPending) return;
            mutate({ appointmentId: appointment.id, rating });
          }}
        >
          <fieldset disabled={isPending}>
            <legend className="text-ink font-semibold"> {t("staff.rate")} {appointment.staff_name || t("staff.yourStylist")}{" "}
              <span className="text-ink-muted text-sm font-normal"> {t("staff.optional")} </span>
            </legend>
            <p className="text-ink-muted mt-1 text-sm"> {t("staff.howWasYourCompletedVisit")} </p>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`staff-rating-${appointment.id}`}
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    className="peer sr-only"
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-11 w-11 items-center justify-center rounded-lg text-3xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${value <= rating ? "text-amber-600" : "text-ink/25"}`}
                  >
                    ★
                  </span>
                </label>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-ink-muted mt-1 text-xs">
                {rating} {t("staff.outOf5StarsSelected")} </p>
            )}
            <button
              type="submit"
              disabled={!rating || isPending}
              className="bg-ink text-cream mt-3 min-h-11 rounded-xl px-4 text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? t("common.saving") : t("staff.submitRating")}
            </button>
          </fieldset>
          {error && (
            <p role="alert" className="text-danger mt-2 text-sm">
              {error.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
