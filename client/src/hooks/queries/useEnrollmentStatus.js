import { useQuery } from "@tanstack/react-query";
import { enrolledCourseApi } from "../../api/userApi";
import { useAuthStore } from "../../store/useAuthStore";

export const useEnrollmentStatus = (courseId) => {
  const { isAuthenticated } = useAuthStore();

  const { data: enrolledData, isLoading } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: enrolledCourseApi,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });

  const isEnrolled =
    enrolledData?.enrolledCourses?.some((enrollment) => {
      // API returns enrollment objects with a nested `course` document
      // but keep fallback if enrolledCourses contains course objects directly
      const courseObj = enrollment?.course || enrollment;
      return String(courseObj?._id || courseObj) === String(courseId);
    }) || false;

  return {
    isEnrolled,
    isLoading,
    enrolledCourses: enrolledData?.enrolledCourses || [],
  };
};
