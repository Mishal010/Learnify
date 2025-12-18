import { useQuery } from "@tanstack/react-query";
import { getCourseLectureApi } from "../../api/lectureApi";

export const useCourseLectures = (courseId) => {
  return useQuery({
    queryKey: ["lectures", courseId],
    queryFn: () => getCourseLectureApi({ courseId }),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
};
