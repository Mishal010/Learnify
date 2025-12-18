import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLectureApi } from "../../api/lectureApi";
import toast from "react-hot-toast";

export const useUpdateLecture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateLectureApi,
    onSuccess: (_data, variables) => {
      toast.success("Lecture updated successfully");
      // variables may contain id and courseId
      if (variables?.courseId) {
        qc.invalidateQueries(["lectures", variables.courseId]);
        qc.invalidateQueries(["course-details", variables.courseId]);
      } else if (variables?.id) {
        qc.invalidateQueries(["lecture", variables.id]);
      } else {
        qc.invalidateQueries(["lectures"]);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update lecture");
    },
  });
};
