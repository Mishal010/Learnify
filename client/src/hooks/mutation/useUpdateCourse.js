import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseApi } from "../../api/courseApi";
import toast from "react-hot-toast";

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCourseApi,
    onSuccess: () => {
      toast.success("Course Updated Successfully");
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to course course");
    },
  });
};
