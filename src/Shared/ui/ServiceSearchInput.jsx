import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
function ServiceSearchInput({
  value,
  onChange,
  placeholder = i18n.t("services.searchByNameEGFacialHaircut"),
  className = "",
  ...props
}) {
  useTranslation();
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-2 w-full border-2 border-[#2d2620]/30 bg-white px-3 py-2 text-[0.7rem] tracking-widest text-[#2d2620] uppercase placeholder:text-[#5f544b]/70 placeholder:normal-case focus:border-[#2d2620] focus:outline-none sm:px-4 sm:text-xs ${className}`}
      {...props}
    />
  );
}

export default ServiceSearchInput;
