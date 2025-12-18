import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../../api/authApi";
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success("Password reset email sent if the account exists.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send reset email");
    },
  });
};
