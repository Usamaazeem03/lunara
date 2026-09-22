import { supabase } from "./supabase";

export async function getRewards({ ownerId, clientId, profileId } = {}) {
  let query = supabase.from("client_rewards").select("*").order("created_at", { ascending: false });
  if (ownerId) query = query.eq("owner_id", ownerId);
  if (profileId && clientId) {
    query = query.or(`salon_client_id.eq.${JSON.stringify(String(profileId))},client_id.eq.${JSON.stringify(String(clientId))}`);
  } else if (clientId) query = query.eq("client_id", clientId);
  const { data, error } = await query;
  if (error) throw new Error("Rewards could not be loaded. Please try again or contact your salon.");
  return data ?? [];
}

export async function issueReward({ clientId, percent, days }) {
  const { data, error } = await supabase.rpc("issue_client_reward", {
    p_client_id: String(clientId), p_percent: Number(percent), p_days: Number(days),
  });
  if (error) {
    if (error.message?.includes("needs a linked booking account")) {
      throw new Error("The salon-client rewards update is not installed yet. Please ask your administrator to finish the rewards update, then try again.");
    }
    throw new Error(error.message);
  }
  return data;
}

export async function revokeReward(id) {
  const { error } = await supabase.rpc("revoke_client_reward", { p_reward_id: id });
  if (error) throw new Error(error.message);
}

export async function linkRewardAccount({ rewardId, email }) {
  const { data, error } = await supabase.rpc("link_reward_account", {
    p_reward_id: rewardId, p_email: email.trim(),
  });
  if (error) throw new Error(error.code === "PGRST202"
    ? "Online reward sharing needs the latest database update. Please contact your administrator."
    : error.message);
  return data;
}

export function rewardStatus(reward) {
  if (reward.redeemed_at) return "Used";
  if (reward.revoked_at) return "Revoked";
  if (new Date(reward.expires_at).getTime() <= Date.now()) return "Expired";
  return "Available";
}
