import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInstructorsCourseApi } from "../../api/courseApi";

export const useInstructorsCourse = ({ page, limit }) => {
  return useQuery({
    queryKey: ["instructor-courses", { page, limit }],
    queryFn: getInstructorsCourseApi,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes - data won't be refetched unless stale
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes even if unused
  });
};
