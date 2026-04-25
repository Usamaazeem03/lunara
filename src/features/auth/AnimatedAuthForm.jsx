import { useEffect, useState } from "react";
import AuthForm from "./AuthForm";

function AnimatedAuthForm({ role, mode, onModeChange }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mode]);

  return (
    <div
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <AuthForm role={role} mode={mode} onModeChange={onModeChange} />
    </div>
  );
}

export default AnimatedAuthForm;
