import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLectureApi } from "../../api/lectureApi";
import toast from "react-hot-toast";

export const useCreateLecture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLectureApi,
    onSuccess: (_data, variables) => {
      toast.success("Lecture created successfully");
      // variables should contain courseId
      if (variables?.courseId) {
        qc.invalidateQueries(["lectures", variables.courseId]);
        qc.invalidateQueries(["course-details", variables.courseId]);
      } else {
        qc.invalidateQueries(["lectures"]);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create lecture");
    },
  });
};
