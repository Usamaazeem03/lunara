import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AUTH_IMAGE_SOURCES,
  ROLE_CONTENT,
  ROLE_IMAGES,
  ROLE_OPTIONS,
} from "./authContent";
import AuthCard from "./AuthCard";
import AuthHeroPanel from "./AuthHeroPanel";
import AuthMainPanel from "./AuthMainPanel";
import AuthResetPanel from "./AuthResetPanel";
import AuthShell from "./AuthShell";
import usePreloadImages from "./usePreloadImages";

const VALID_ROLES = ["client", "owner"];
const VALID_MODES = ["signin", "signup", "login", "reset-password"];
const DEFAULT_ROLE = "client";
const DEFAULT_MODE = "signup";

function AuthModal() {
  const navigate = useNavigate();
  const { role: roleParam, mode: modeParam } = useParams();

  usePreloadImages(AUTH_IMAGE_SOURCES);

  const role = VALID_ROLES.includes(roleParam) ? roleParam : DEFAULT_ROLE;
  const pathMode =
    modeParam === "signin" || modeParam === "login"
      ? "signin"
      : modeParam === "signup"
        ? "signup"
        : modeParam === "reset-password"
          ? "reset-password"
        : DEFAULT_MODE;
  const mode =
    pathMode === "reset-password"
      ? "reset-password"
      : pathMode === "signup"
        ? "signup"
        : "login";
  const content = ROLE_CONTENT[role];

  const goTo = (nextRole = role, nextMode = mode) =>
    navigate(
      `/auth/${VALID_ROLES.includes(nextRole) ? nextRole : DEFAULT_ROLE}/${
        nextMode === "reset-password"
          ? "reset-password"
          : nextMode === "signup"
            ? "signup"
            : "signin"
      }`,
    );

  const handleModeChange = (nextMode) => goTo(role, nextMode);
  const handleRoleChange = (nextRole) => goTo(nextRole, mode);
  const handleClose = () => navigate("/");

  useEffect(() => {
    const shouldCanonicalizeRole = roleParam && !VALID_ROLES.includes(roleParam);
    const shouldCanonicalizeMode = modeParam && !VALID_MODES.includes(modeParam);

    if (
      !modeParam ||
      modeParam === "login" ||
      shouldCanonicalizeRole ||
      shouldCanonicalizeMode
    ) {
      navigate(`/auth/${role}/${pathMode}`, { replace: true });
    }
  }, [modeParam, navigate, pathMode, role, roleParam]);

  return (
    <AuthShell>
      <AuthCard onClose={handleClose}>
        <AuthHeroPanel
          role={role}
          imageSrc={ROLE_IMAGES[role]}
          content={content}
        />
        {mode === "reset-password" ? (
          <AuthResetPanel
            role={role}
            roleOptions={ROLE_OPTIONS}
            onRoleChange={handleRoleChange}
            onBackToLogin={() => goTo(role, "login")}
          />
        ) : (
          <AuthMainPanel
            role={role}
            mode={mode}
            content={content}
            roleOptions={ROLE_OPTIONS}
            onRoleChange={handleRoleChange}
            onModeChange={handleModeChange}
          />
        )}
      </AuthCard>
    </AuthShell>
  );
}

export default AuthModal;
