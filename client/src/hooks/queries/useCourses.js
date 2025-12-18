import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllCourseApi } from "../../api/courseApi";

export const useCourses = ({ page, limit, category, search }) => {
  return useQuery({
    queryKey: ["courses", page, limit, category, search],
    queryFn: () =>
      getAllCourseApi({
        page,
        limit,
        category,
        search,
      }),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData, // Review this before actual implementation
  });
};
