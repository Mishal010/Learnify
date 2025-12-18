import { create } from "zustand";

export const useCourseStore = create((set) => ({
  lectureModalState: false,
  selectedCourseId: null,
  setSelectedCourseId: (courseId) =>
    set(() => ({ selectedCourseId: courseId })),
  setLectureModalState: (state) => set(() => ({ lectureModalState: state })),
}));
