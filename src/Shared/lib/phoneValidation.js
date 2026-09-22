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
  if (!phone) return "Phone number is required.";
  if (!phone.startsWith("+")) {
    return "Use the full international format, e.g. +44 1234 567890";
  }
  return (
    isValidPhoneNumber(phone) || "Enter a valid international phone number"
  );
}
