import { useId, useState } from "react";
import Icon from "../../Shared/ui/Icon";
import PasswordInput from "../../Shared/ui/PasswordInput";

export default function AuthField({
  label,
  error,
  type = "text",
  iconName,
  registration,
  ...props
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const Input = isPassword ? PasswordInput : "input";
  return (
    <div className="auth-field mt-4 md:mt-5">
      <label
        htmlFor={id}
        className="text-ink/60 text-xs tracking-[0.2em] uppercase"
      >
        {label}
      </label>
      <div className="relative mt-2">
        {iconName && (
          <span className="text-ink/40 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
            <Icon name={iconName} size={18} />
          </span>
        )}
        <Input
          {...props}
          {...registration}
          id={id}
          type={isPassword && visible ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`autofill-input border-ink/20 text-ink focus:border-ink/60 w-full rounded-xl border bg-white/90 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-inset ${iconName ? "pl-11" : ""} ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            disabled={props.disabled}
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="text-ink/50 absolute top-1/2 right-4 -translate-y-1/2"
          >
            <Icon name={visible ? "eye" : "eye-crossed"} size={18} />
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
