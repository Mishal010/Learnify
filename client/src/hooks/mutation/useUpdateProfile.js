import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "../../api/userApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      // if API returns updated user, update store
      if (data?.user) {
        const currentToken = useAuthStore.getState().accessToken;
        useAuthStore.getState().setAuth(data.user, currentToken);
      }
      toast.success("Profile updated successfully");
      qc.invalidateQueries(["profile"]);
      qc.invalidateQueries(["users"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    },
  });
};
