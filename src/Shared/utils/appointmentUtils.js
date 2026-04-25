// this function is used in multiple places, this function work (make like this name usama azeem) ==> us
export const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
// format number 45 → "45", 45.5 → "45.50"
export const formatNumber = (value) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(2);

export const parseTimeToMinutes = (value) => {
  if (value === null || value === undefined) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const fromDateTime = raw.match(/T(\d{2}):(\d{2})/);
  if (fromDateTime) {
    const hours = Number(fromDateTime[1]);
    const minutes = Number(fromDateTime[2]);
    return hours * 60 + minutes;
  }

  const amPmMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hours = Number(amPmMatch[1]) % 12;
    const minutes = Number(amPmMatch[2]);
    const period = amPmMatch[3].toUpperCase();
    if (period === "PM") {
      hours += 12;
    }
    return hours * 60 + minutes;
  }

  const twentyFourMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourMatch) {
    const hours = Number(twentyFourMatch[1]);
    const minutes = Number(twentyFourMatch[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  return null;
};

// convert normal time to 24-hour format "09:30 AM" → "09:30"
export const toTime24 = (value) => {
  const minutes = parseTimeToMinutes(value);
  if (minutes === null) return "";
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

// const CURRENCY_CODE = "GBP";
// const formatPrice = (value) => {
//   const numeric = Number(value);
//   if (!Number.isFinite(numeric)) return "N/A";
//   return `${CURRENCY_CODE} ${formatNumber(numeric)}`;
// };

// export const mapServiceRow = (service) => {
//   const priceValue = Number(service.price);
//   const durationValue = Number(service.duration_minutes ?? service.duration);

//   return {
//     id: String(service.id),
//     title: service.name ?? "Untitled Service",
//     description: service.description ?? "",
//     category: service.category ?? "General",
//     priceValue: Number.isFinite(priceValue) ? priceValue : 0,
//     durationValue: Number.isFinite(durationValue) ? durationValue : 0,
//     priceLabel: formatPrice(priceValue),
//     durationLabel: Number.isFinite(durationValue)
//       ? `${durationValue} min`
//       : "N/A",
//     isActive: service.is_active !== false,
//   };
// };
