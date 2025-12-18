import { useQuery } from "@tanstack/react-query";
import { getAllUserApi } from "../../api/userApi";

export const useAllUsers = ({ page, limit, role }) => {
  return useQuery({
    queryKey: ["users", { page, limit, role }],
    queryFn: () => getAllUserApi({ page, limit, role }),
    staleTime: 1000 * 60 * 5,
  });
};
