import { useQuery } from "@tanstack/react-query";
import { enrolledCourseApi } from "../../api/userApi";

export const useEnrollmentStatus = (courseId) => {
  const { data: enrolledData, isLoading } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: enrolledCourseApi,
    staleTime: 1000 * 60 * 5,
  });

  const isEnrolled =
    enrolledData?.data?.some((course) => course._id === courseId) || false;

  return { isEnrolled, isLoading, enrolledCourses: enrolledData?.data || [] };
};
