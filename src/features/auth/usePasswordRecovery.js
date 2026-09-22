import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordReset,
  resetRecoveredPassword,
} from "../../services/apiAuth";

export function usePasswordRecovery(role) {
  const request = useMutation({
    mutationFn: (values) => requestPasswordReset({ ...values, role }),
    retry: false,
    gcTime: 0,
  });
  const update = useMutation({
    mutationFn: resetRecoveredPassword,
    retry: false,
    gcTime: 0,
  });
  return { request, update };
}
