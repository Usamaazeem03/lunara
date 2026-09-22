import { useState } from "react";
import staffIcon from "../assets/icons/staff.svg";

export default function StaffAvatar({ image, name, className = "h-12 w-12" }) {
  const [failedImage, setFailedImage] = useState(null);
  const showImage = image && image !== failedImage;

  return (
    <span
      className={`border-ink/20 bg-cream flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${className}`}
    >
      {showImage ? (
        <img
          src={image}
          alt={name || "Staff member"}
          className="h-full w-full object-cover"
          onError={() => setFailedImage(image)}
        />
      ) : (
        <img
          src={staffIcon}
          alt=""
          aria-hidden="true"
          className="h-1/2 w-1/2 object-contain opacity-70"
        />
      )}
    </span>
  );
}
