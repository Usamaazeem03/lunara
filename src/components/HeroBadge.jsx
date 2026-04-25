import React from "react";

/**
 * Reusable HeroBadge Component with optional dot
 * @param {string} text - The main text inside the badge
 * @param {string} bgColor - Background color for the badge
 * @param {string} borderColor - Border color for the badge
 * @param {string} textColor - Text color inside the badge
 * @param {string} dotColor - Color of the small dot
 * @param {boolean} showDot - Whether to display the dot
 * @param {string} className - Additional custom classes
 */
function HeroBadge({
  text = "Booking platform for salons",
  bgColor = "bg-white/70",
  borderColor = "border-black/10",
  textColor = "text-black/60",
  dotColor = "bg-black/70",
  showDot = true,
  className = "",
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${borderColor} ${bgColor} px-4 py-2 text-[11px] uppercase tracking-[0.35em] ${textColor} ${className}`}
    >
      {showDot && <span className={`h-2 w-2 rounded-full ${dotColor}`} />}
      {text}
    </div>
  );
}

export default HeroBadge;
