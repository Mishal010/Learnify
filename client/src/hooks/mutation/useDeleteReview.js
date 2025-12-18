import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewApi } from "../../api/reviewApi";
import toast from "react-hot-toast";

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: () => {
      toast.success("Review deleted successfully");
      qc.invalidateQueries(["course-reviews"]);
      qc.invalidateQueries(["my-reviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete review");
    },
  });
};
