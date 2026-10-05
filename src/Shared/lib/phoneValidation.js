import i18n from "../../i18n/i18n.js";
import {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from "react-phone-number-input";

export function internationalPhoneRules(setValue, name = "phone") {
  return {
    validate: validateInternationalPhone,
    onBlur: (event) => {
      const phone = event.target.value.trim();
      if (validateInternationalPhone(phone) === true) {
        setValue(name, formatPhoneNumberIntl(phone), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
  };
}

export function validateInternationalPhone(value) {
  const phone = String(value ?? "").trim();
  if (!phone) return i18n.t("common.phoneNumberIsRequired");
  if (!phone.startsWith("+")) {
    return i18n.t("common.useTheFullInternationalFormatEG441234567890");
  }
  return (
    isValidPhoneNumber(phone) || i18n.t("common.enterAValidInternationalPhoneNumber")
  );
}
