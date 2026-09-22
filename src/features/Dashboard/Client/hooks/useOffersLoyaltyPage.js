import { rewards, earnWays } from "../data/offersLoyaltyPageData.js";

// Demo dashboard data is kept here until these screens have API endpoints.
export function useOffersLoyaltyPage() {
  const loyaltyPoints = 550;
  const nextRewardPoints = 600;
  const pointsToGo = Math.max(0, nextRewardPoints - loyaltyPoints);
  const progress = Math.min(
    100,
    Math.round((loyaltyPoints / nextRewardPoints) * 100),
  );

  return { loyaltyPoints, pointsToGo, progress, rewards, earnWays };
}
