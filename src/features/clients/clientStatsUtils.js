export function getClientStats(clients = [], now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 90);
  const activeClients = clients.filter((client) => {
    if (!client.lastVisit || client.lastVisit === "No visits") return false;
    const [year, month, day] = client.lastVisit
      .split("T")[0]
      .split("-")
      .map(Number);
    const lastVisit = new Date(year, month - 1, day);
    return lastVisit >= cutoff && lastVisit <= today;
  }).length;
  const totalRevenue = clients.reduce((sum, client) => {
    const amount = Number(client.totalSpent);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  return {
    totalClients: clients.length,
    activeClients,
    totalRevenue,
    avgValue: clients.length ? totalRevenue / clients.length : 0,
  };
}
