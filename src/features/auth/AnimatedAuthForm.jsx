import { useEffect, useRef } from "react";
import AuthForm from "./AuthForm";

export default function AnimatedAuthForm({ role, mode, onModeChange }) {
  const container = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = container.current?.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 200, easing: "ease-out" },
    );
    return () => animation?.cancel();
  }, [role, mode]);
  return (
    <div ref={container}>
      <AuthForm
        key={`${role}-${mode}`}
        role={role}
        mode={mode}
        onModeChange={onModeChange}
      />
    </div>
  );
}
