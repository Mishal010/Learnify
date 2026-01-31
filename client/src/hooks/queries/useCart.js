import { useQuery } from "@tanstack/react-query";
import { getCartApi } from "../../api/cartApi";

export const useCart = (options = {}) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled ?? true,
    ...options,
  });
};
