import { forwardRef, useState } from "react";

// The initial read-only state prevents saved credentials filling on page load.
const PasswordInput = forwardRef(function PasswordInput(
  { onFocus, readOnly, ...props },
  ref,
) {
  const [isActivated, setIsActivated] = useState(false);

  return (
    <input
      {...props}
      ref={ref}
      autoComplete="off"
      readOnly={readOnly || !isActivated}
      onFocus={(event) => {
        setIsActivated(true);
        onFocus?.(event);
      }}
    />
  );
});

export default PasswordInput;
