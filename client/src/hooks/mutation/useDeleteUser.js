import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserApi } from "../../api/userApi";
import toast from "react-hot-toast";

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success("User deleted successfully");
      qc.invalidateQueries(["users"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    },
  });
};
