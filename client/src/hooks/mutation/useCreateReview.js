import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewApi } from "../../api/reviewApi";
import toast from "react-hot-toast";

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      toast.success("Review created successfully");
      // invalidate course reviews and my reviews
      qc.invalidateQueries(["course-reviews"]);
      qc.invalidateQueries(["my-reviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create review");
    },
  });
};
