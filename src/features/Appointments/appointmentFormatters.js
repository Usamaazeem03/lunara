export const getServiceSummary = (serviceName) => {
  if (!serviceName) return "Service";

  const list = serviceName.split(",").map((service) => service.trim());

  if (list.length === 1) return list[0];

  return `${list[0]} +${list.length - 1}`;
};
