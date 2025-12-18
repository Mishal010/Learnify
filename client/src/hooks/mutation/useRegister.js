import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../../api/authApi";
import toast from "react-hot-toast";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("🎉 Account Registered");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to register user");
    },
  });
};
