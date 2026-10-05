import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { isRecoverySession } = useAuth();
  return (
    <div className="auth-main flex flex-col justify-start p-4 sm:p-6 md:justify-center md:bg-[#f7f5f0] md:p-12">
      <div className="mx-auto w-full max-w-md">
        <AuthHeader
          eyebrow={t("auth.resetPassword", { value1: role === "owner" ? t("auth.owner") : t("common.client") })}
          headline={t("auth.resetPasswordHeading")}
          subhead={
            isRecoverySession
              ? t("auth.chooseAndConfirmYourNewPassword")
              : t("auth.enterYourEmailToReceiveAPasswordResetLink")
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
