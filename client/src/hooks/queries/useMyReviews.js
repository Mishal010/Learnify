import { useQuery } from "@tanstack/react-query";
import { myReviewsApi } from "../../api/reviewApi";

export const useMyReviews = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["my-reviews", page, limit],
    queryFn: () => myReviewsApi({ page, limit }),
    staleTime: 1000 * 60 * 5,
  });
};
