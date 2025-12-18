import { useQuery } from "@tanstack/react-query";
import { getLectureApi } from "../../api/lectureApi";

export const useLecture = (id) => {
  return useQuery({
    queryKey: ["lecture", id],
    queryFn: () => getLectureApi({ id }),
    enabled: !!id,
  });
};
