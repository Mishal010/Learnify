import { useQuery } from "@tanstack/react-query";
import { allReviewsApi } from "../../api/reviewApi";

export const useCourseReviews = ({ page, limit, courseId }) => {
  return useQuery({
    queryKey: ["course-reviews", page, limit, courseId],
    queryFn: () => allReviewsApi({ page, limit, courseId }),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 2,
  });
};
