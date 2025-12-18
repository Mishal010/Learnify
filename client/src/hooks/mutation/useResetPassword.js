import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../../api/authApi";
import toast from "react-hot-toast";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successful");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    },
  });
};
