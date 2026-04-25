import AnimatedAuthForm from "./AnimatedAuthForm";
import AuthBranding from "./AuthBranding";
import AuthHeader from "./AuthHeader";
import AuthRoleToggle from "./AuthRoleToggle";

const MAIN_PANEL_CLASSES = [
  "flex flex-col justify-start",
  "md:justify-center",
  "p-4 sm:p-6",
  "md:p-12 md:bg-[#f7f5f0]",
].join(" ");

function AuthMainPanel({
  role,
  mode,
  content,
  roleOptions,
  onRoleChange,
  onModeChange,
}) {
  return (
    <div className={MAIN_PANEL_CLASSES}>
      <div className="mx-auto w-full max-w-md">
        {/* <AuthBranding /> */}
        <AuthHeader
          eyebrow={content.eyebrow}
          headline={content.headline[mode]}
          subhead={content.subhead[mode]}
        />
        <AuthRoleToggle
          value={role}
          options={roleOptions}
          onChange={onRoleChange}
        />
        <div className="mt-3">
          <AnimatedAuthForm
            role={role}
            mode={mode}
            onModeChange={onModeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AuthMainPanel;
