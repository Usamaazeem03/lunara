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
  ...rest
}) {
  const baseStyles = unstyled
    ? ""
    : "px-4  py-2  text-[0.8rem] uppercase tracking-widest transition duration-300 ease-in-out";

  const variants = {
    primary: "border border-ink hover:bg-ink hover:text-cream",
    secondary: "border border-ink/30 bg-white/70 hover:border-ink",
    custom: "",
  };
  const variantStyles = variants[variant] ?? "";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
      className={`
        ${baseStyles}
        ${variantStyles}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
