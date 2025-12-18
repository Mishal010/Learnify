import { useQuery } from "@tanstack/react-query";
import { myReviewsApi } from "../../api/reviewApi";

export const useMyReviews = () => {
  return useQuery({
    queryKey: ["my-reviews"],
    queryFn: myReviewsApi,
    staleTime: 1000 * 60 * 5,
  });
};
