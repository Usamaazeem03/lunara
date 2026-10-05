import { localizedError } from "../i18n/localizedError.js";
import i18n from "../i18n/i18n.js";
import { supabase } from "./supabase";

export async function getRewards({ ownerId, clientId, profileId } = {}) {
  let query = supabase.from("client_rewards").select("*").order("created_at", { ascending: false });
  if (ownerId) query = query.eq("owner_id", ownerId);
  if (profileId && clientId) {
    query = query.or(`salon_client_id.eq.${JSON.stringify(String(profileId))},client_id.eq.${JSON.stringify(String(clientId))}`);
  } else if (clientId) query = query.eq("client_id", clientId);
  const { data, error } = await query;
  if (error) throw localizedError("services.rewardsCouldNotBeLoadedPleaseTryAgainOrContact");
  return data ?? [];
}

export async function issueReward({ clientId, percent, days }) {
  const { data, error } = await supabase.rpc("issue_client_reward", {
    p_client_id: String(clientId), p_percent: Number(percent), p_days: Number(days),
  });
  if (error) {
    if (error.message?.includes("needs a linked booking account")) {
      throw localizedError("services.theSalonClientRewardsUpdateIsNotInstalledYetPlease");
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
    ? i18n.t("services.onlineRewardSharingNeedsTheLatestDatabaseUpdatePleaseContact")
    : error.message);
  return data;
}

export function rewardStatus(reward) {
  if (reward.redeemed_at) return i18n.t("services.used");
  if (reward.revoked_at) return i18n.t("services.revoked");
  if (new Date(reward.expires_at).getTime() <= Date.now()) return i18n.t("services.expired");
  return i18n.t("services.available");
}
