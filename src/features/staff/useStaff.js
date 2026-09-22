import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../../services/apiStaff";
import { mapStaffRow } from "./staffUtils";
const EMPTY_STAFF = [];
export const staffQueryKey = (ownerId) => ["staff", ownerId];
const selectStaff = (rows) => rows.map(mapStaffRow);
export function useStaff(ownerId) {
  const query = useQuery({
    queryKey: staffQueryKey(ownerId),
    queryFn: () => getStaff(ownerId),
    enabled: Boolean(ownerId),
    select: selectStaff,
  });
  return { ...query, staffMembers: query.data ?? EMPTY_STAFF };
}
