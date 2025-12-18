import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../api/authApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: ({ user, accessToken }) => {
      useAuthStore.getState().setAuth(user, accessToken);
      toast.success("✅Logged in");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "❌Login failed");
    },
  });
};
