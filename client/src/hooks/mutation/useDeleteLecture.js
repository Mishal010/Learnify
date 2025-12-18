import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLectureApi } from "../../api/lectureApi";
import toast from "react-hot-toast";

export const useDeleteLecture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLectureApi,
    onSuccess: (_data, variables) => {
      toast.success("Lecture deleted successfully");
      // variables may include id or courseId
      if (variables?.courseId) {
        qc.invalidateQueries(["lectures", variables.courseId]);
        qc.invalidateQueries(["course-details", variables.courseId]);
      } else {
        qc.invalidateQueries(["lectures"]);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete lecture");
    },
  });
};
