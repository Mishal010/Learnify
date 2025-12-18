import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosClient";

export const useStudentAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "student"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/dashboard/student`);
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });
};
