import { useState } from "react";
import Icon from "./Icon";

export default function UserAvatar({
  src,
  alt = "User profile",
  className = "h-full w-full",
  iconSize = 24,
  fallback,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  return src && src !== failedSrc ? (
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className={`${className} object-cover`}
    />
  ) : (
    <span
      className={`${className} bg-cream text-ink flex items-center justify-center`}
      role="img"
      aria-label={alt}
    >
      {fallback ?? <Icon name="user-profile" size={iconSize} aria-hidden="true" />}
    </span>
  );
}
