import { useState } from "react";
import { useRateStaff } from "./useRateStaff";

export default function StaffRatingForm({ appointment }) {
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
        <p role="status" className="text-ink text-sm">
          You rated {appointment.staff_name || "your stylist"}{" "}
          <span className="font-semibold">{savedRating}/5 stars</span>. Thank
          you!
        </p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!rating || isPending) return;
            mutate({ appointmentId: appointment.id, rating });
          }}
        >
          <fieldset disabled={isPending}>
            <legend className="text-ink font-semibold">
              Rate {appointment.staff_name || "your stylist"}{" "}
              <span className="text-ink-muted text-sm font-normal">
                (optional)
              </span>
            </legend>
            <p className="text-ink-muted mt-1 text-sm">
              How was your completed visit?
            </p>
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
                {rating} out of 5 stars selected
              </p>
            )}
            <button
              type="submit"
              disabled={!rating || isPending}
              className="bg-ink text-cream mt-3 min-h-11 rounded-xl px-4 text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Submit rating"}
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
