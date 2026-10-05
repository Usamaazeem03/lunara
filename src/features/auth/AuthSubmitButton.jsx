import { useTranslation } from "react-i18next";
import ButtonSpinner from "../../Shared/ui/ButtonSpinner";
export default function AuthSubmitButton({ pending, children, disabled }) {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className="bg-ink text-cream hover:bg-ink/90 mt-5 w-full py-3 text-sm tracking-[0.3em] uppercase transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? <span className="inline-flex items-center justify-center gap-2"><ButtonSpinner />{t("auth.pleaseWait")}</span> : children}
    </button>
  );
}
