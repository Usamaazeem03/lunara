import PasswordRecoveryForm from "./PasswordRecoveryForm";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  role = "client",
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        className="bg-cream w-full max-w-md p-6"
      >
        <h2 id="forgot-password-title" className="text-xl font-semibold">
          Reset password
        </h2>
        <PasswordRecoveryForm role={role} onBackToLogin={onClose} />
      </section>
    </div>
  );
}
