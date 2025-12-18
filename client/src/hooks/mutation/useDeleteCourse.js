import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourseApi } from "../../api/courseApi";
import toast from "react-hot-toast";

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseApi,
    onSuccess: () => {
      toast.success("Course Deleted Successfully");
      qc.invalidateQueries("courses");
      qc.invalidateQueries("instructor-courses");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete course");
    },
  });
};
