import { useQuery } from "@tanstack/react-query";
import { enrolledCourseApi } from "../../api/userApi";

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: enrolledCourseApi,
    staleTime: 1000 * 60 * 5,
  });
};
