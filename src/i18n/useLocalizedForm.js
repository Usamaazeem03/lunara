import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

function invalidFields(errors, prefix = "") {
  return Object.entries(errors).flatMap(([name, error]) => {
    const path = prefix ? `${prefix}.${name}` : name;
    if (!error || typeof error !== "object") return [];
    return error.type ? [path] : invalidFields(error, path);
  });
}

// Refresh only visible validation errors; retain values, touched state and focus.
export function useLocalizedForm(options) {
  const form = useForm(options);
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;
  const previousLanguage = useRef(language);
  const { errors } = form.formState;
  const { trigger } = form;

  useEffect(() => {
    if (previousLanguage.current === language) return;
    previousLanguage.current = language;
    const fields = invalidFields(errors);
    if (fields.length) void trigger(fields);
  }, [language, errors, trigger]);

  return form;
}
