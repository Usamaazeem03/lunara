import AuthHeader from "./AuthHeader";
import AuthRoleToggle from "./AuthRoleToggle";
import PasswordRecoveryForm from "./PasswordRecoveryForm";
import { useAuth } from "../../hooks/useAuth";

export default function AuthResetPanel({
  role,
  roleOptions,
  onRoleChange,
  onBackToLogin,
}) {
  const { isRecoverySession } = useAuth();
  return (
    <div className="auth-main flex flex-col justify-start p-4 sm:p-6 md:justify-center md:bg-[#f7f5f0] md:p-12">
      <div className="mx-auto w-full max-w-md">
        <AuthHeader
          eyebrow={`${role === "owner" ? "Owner" : "Client"} Reset Password`}
          headline="Reset Password"
          subhead={
            isRecoverySession
              ? "Choose and confirm your new password."
              : "Enter your email to receive a password reset link."
          }
        />
        {!isRecoverySession && (
          <AuthRoleToggle
            value={role}
            options={roleOptions}
            onChange={onRoleChange}
          />
        )}
        <PasswordRecoveryForm
          key={role}
          role={role}
          onBackToLogin={onBackToLogin}
        />
      </div>
    </div>
  );
}
