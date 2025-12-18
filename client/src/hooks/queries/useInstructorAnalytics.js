import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosClient";

export const useInstructorAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "instructor"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/dashboard/instructor`);
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
