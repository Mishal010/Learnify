import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseApi } from "../../api/courseApi";
import toast from "react-hot-toast";

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCourseApi,
    onSuccess: () => {
      toast.success("Course created successfully");
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course-details"] });
      qc.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create course");
    },
  });
};
