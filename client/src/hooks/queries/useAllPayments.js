import { useQuery } from "@tanstack/react-query";
import { getAllPaymentsApi } from "../../api/paymentApi";

export const useAllPayments = ({ page, limit, status }) => {
  return useQuery({
    queryKey: ["payments", page, limit, status],
    queryFn: () => getAllPaymentsApi({ page, limit, status }),
    staleTime: 1000 * 60 * 2,
  });
};
