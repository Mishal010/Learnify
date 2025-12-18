import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../../api/authApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      useAuthStore.getState().logout();
      qc.clear();
      toast.success("Logged out");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to logout");
    },
  });
};
