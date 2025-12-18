import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReviewApi } from "../../api/reviewApi";
import toast from "react-hot-toast";

export const useUpdateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateReviewApi,
    onSuccess: () => {
      toast.success("Review updated successfully");
      qc.invalidateQueries(["course-reviews"]);
      qc.invalidateQueries(["my-reviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update review");
    },
  });
};
