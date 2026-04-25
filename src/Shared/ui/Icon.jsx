import spriteUrl from "../assets/icons/sprite.svg?url";

/**
 * Icon Component - Displays SVG icons from sprite.svg
 * @param {string} name - The icon name (matches the symbol id in sprite.svg)
 * @param {number} size - Width and height of the icon (default 24)
 * @param {string} color - Fill color (default "currentColor")
 * @param {string} stroke - Stroke color (optional)
 * @param {string} className - Additional CSS classes (optional)
 */
export default function Icon({
  name,
  size = 24,
  color = "currentColor",
  stroke,
  className = "",
  ...props
}) {
  if (!name) {
    console.warn('Icon component: "name" prop is required');
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`icon icon-${name} ${className}`.trim()}
      style={{
        fill: color,
        ...(stroke && { stroke }),
      }}
      {...props}
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  );
}
