import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromCartApi } from "../../api/cartApi";
import toast from "react-hot-toast";

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFromCartApi,
    onSuccess: () => {
      toast.success("Course Removed From Cart.");
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to remove course from cart."
      );
    },
  });
};
