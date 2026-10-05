import { useTranslation } from "react-i18next";

export default function LocalizedMessageView({ translationKey, options }) {
  const { t } = useTranslation();
  return t(translationKey, options);
}
