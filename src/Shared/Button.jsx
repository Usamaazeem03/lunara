import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonSpinner from "./ui/ButtonSpinner";

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
  unstyled = false,
  to,
  href,
  target,
  rel,
  ...rest
}) {
  const { t } = useTranslation();
  const baseStyles = unstyled
    ? ""
    : "px-4  py-2  text-[0.8rem] uppercase tracking-widest transition duration-300 ease-in-out";

  const variants = {
    primary: "border border-ink hover:bg-ink hover:text-cream",
    secondary: "border border-ink/30 bg-white/70 hover:border-ink",
    custom: "",
  };
  const variantStyles = variants[variant] ?? "";
  const isButton = !to && !href;
  const Component = isButton ? "button" : to ? Link : "a";
  const isDisabled = disabled || loading;

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const linkProps = to ? { to } : href ? { href } : {};
  const buttonProps = isButton ? { type, disabled: isDisabled } : {};
  const accessibilityProps =
    !isButton && isDisabled ? { "aria-disabled": true, tabIndex: -1 } : {};

  return (
    <Component
      onClick={handleClick}
      {...linkProps}
      {...buttonProps}
      {...accessibilityProps}
      {...(!isButton ? { target, rel } : {})}
      {...rest}
      aria-busy={loading || undefined}
      className={`
        ${baseStyles}
        ${variantStyles}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? <span className="inline-flex items-center justify-center gap-2"><ButtonSpinner />{t("dashboard.loading")}</span> : children}
    </Component>
  );
}

export default Button;
