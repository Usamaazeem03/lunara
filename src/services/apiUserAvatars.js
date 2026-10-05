import { supabase } from "./supabase";

export async function getUserAvatars(ids) {
  const records = [];
  const read = async (keys) => {
    for (let index = 0; index < keys.length; index += 100) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, auth_id, avatar_img")
        .in("id", keys.slice(index, index + 100));
      if (error) throw error;
      records.push(...(data ?? []));
    }
  };
  await read(ids);
  const loaded = new Set(records.map((record) => String(record.id)));
  const linkedIds = [
    ...new Set(
      records
        .map((record) => record.auth_id)
        .filter((id) => id && !loaded.has(String(id))),
    ),
  ];
  await read(linkedIds);
  const byId = new Map(records.map((record) => [String(record.id), record]));
  return Object.fromEntries(
    ids.map((id) => {
      const profile = byId.get(String(id));
      const account = byId.get(String(profile?.auth_id));
      return [id, account?.avatar_img || profile?.avatar_img || null];
    }),
  );
}
