import { useQuery } from "@tanstack/react-query";
import { getCourseByIdApi } from "../../api/courseApi";

export const useCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ["course-details", courseId],
    queryFn: () => getCourseByIdApi(courseId),
    enabled: !!courseId,
  });
};
