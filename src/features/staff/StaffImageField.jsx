import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import StaffAvatar from "../../Shared/ui/StaffAvatar";
import Icon from "../../Shared/ui/Icon";
import {
  STAFF_IMAGE_TYPES,
  validateStaffImage,
} from "../../Shared/lib/staffImage";

export default function StaffImageField({
  register,
  control,
  error,
  image,
  name,
}) {
  const files = useWatch({ control, name: "image" });
  const file = files?.[0];
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file || validateStaffImage(file) !== true) return;
    const reader = new FileReader();
    reader.onload = () => setPreview({ file, url: reader.result });
    reader.readAsDataURL(file);
    return () => {
      reader.onload = null;
      reader.abort();
    };
  }, [file]);

  return (
    <div className="sm:col-span-2">
      <span className="text-ink-muted text-xs tracking-widest uppercase">
        Staff Image (optional)
      </span>
      <div className="mt-2 flex items-center gap-4">
        <StaffAvatar
          image={file && preview?.file === file ? preview.url : image}
          name={name}
          className="h-20 w-20"
        />
        <div className="min-w-0 flex-1">
          <label
            htmlFor="staff-image"
            className="border-ink/20 text-ink focus-within:border-ink hover:border-ink relative flex cursor-pointer items-center justify-center gap-2 border-2 px-3 py-2 text-sm"
          >
            <Icon name="add-image" size={16} />
            <span className="truncate">
              {file?.name || (image ? "Change Image" : "Upload Image")}
            </span>
            <input
              id="staff-image"
              type="file"
              accept={STAFF_IMAGE_TYPES.join(",")}
              {...register("image", {
                validate: (files) => validateStaffImage(files?.[0]),
              })}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? "staff-image-error" : "staff-image-help"
              }
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            />
          </label>
          <p id="staff-image-help" className="text-ink-muted mt-2 text-xs">
            JPEG, PNG, WebP, or GIF. Maximum 5 MB.
          </p>
          {error && (
            <p
              id="staff-image-error"
              role="alert"
              className="text-danger mt-1 text-xs"
            >
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
