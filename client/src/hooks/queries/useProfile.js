import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../../api/userApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi,
    staleTime: 1000 * 60 * 5,
  });
};
