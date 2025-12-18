import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosClient";

export const useGlobalAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "global"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/dashboard/global`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // global analytics can be cached longer
  });
};
