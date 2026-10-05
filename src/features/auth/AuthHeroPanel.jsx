import { useTranslation } from "react-i18next";
function AuthHeroPanel({ role, imageSrc, content }) {
  const { t } = useTranslation();
  return (
    <div className="auth-hero relative hidden min-h-[240px] md:block md:min-h-full">
      <img
        src={imageSrc}
        alt={role === "owner" ? t("common.ownerLogin") : t("auth.clientLogin")}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 to-black/10" />

      <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-0 -bottom-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col p-10 text-white">
        <h1 className="mb-4 text-4xl tracking-[0.4em] text-white/70 uppercase">
          LUNARA
        </h1>

        <div className="mt-auto">
          <p className="text-4xl font-bold">{content.heroTitle}</p>
          <p className="mt-4 max-w-md text-lg text-white/85">
            {content.heroBody}
          </p>

          <div className="mt-6 grid gap-4 text-xs tracking-[0.2em] text-white/80 uppercase sm:grid-cols-3">
            {content.steps.map((step, index) => (
              <div
                key={`${step}-${index}`}
                className="rounded-xl bg-white/30 px-4 py-3"
              >
                <p className="text-[10px] text-white/60">{t("booking.step")} {index + 1}</p>
                <p className="mt-2 text-sm font-semibold normal-case">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthHeroPanel;
