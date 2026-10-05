import i18n from "../../i18n/i18n.js";
export const getServiceSummary = (serviceName) => {
  if (!serviceName) return i18n.t("common.service");

  const list = serviceName.split(",").map((service) => service.trim());

  if (list.length === 1) return list[0];

  return `${list[0]} +${list.length - 1}`;
};
