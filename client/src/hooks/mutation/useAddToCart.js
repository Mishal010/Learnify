import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartApi } from "../../api/cartApi";
import toast from "react-hot-toast";

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToCartApi,
    onSuccess: () => {
      toast.success("Course Added to cart.");
      qc.invalidateQueries("cart");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    },
  });
};
