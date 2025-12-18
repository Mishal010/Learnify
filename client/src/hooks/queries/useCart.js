import { useQuery } from "@tanstack/react-query";
import { getCartApi } from "../../api/cartApi";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
    staleTime: 1000 * 60 * 5,
  });
};
