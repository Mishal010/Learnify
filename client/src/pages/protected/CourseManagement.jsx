import { Plus } from "lucide-react";
import React, { useState } from "react";
import DashboardCourseCard from "../../components/dashboard/DashboardCourseCard";
import CreateCourseModal from "../../components/dashboard/CreateCourseModal";
import UpdateCourseModal from "../../components/dashboard/UpdateCourseModal";
import { useCourseStore } from "../../store/useCourseStore";
import CreateLectureModal from "../../components/dashboard/CreateLectureModal";
import { useInstructorsCourse } from "../../hooks/queries/useInstructorsCourse";
import Loader from "../Loader";

const CourseManagement = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const lectureModalState = useCourseStore((state) => state.lectureModalState);
  const setLectureModalState = useCourseStore(
    (state) => state.setLectureModalState
  );

  const { data, isLoading } = useInstructorsCourse({ page, limit });

  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (isLoading) return <Loader />;
  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-200 px-4 py-5 md:px-10 overflow-y-scroll">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-5 ">
        <h1 className="text-4xl font-semibold">Course Management</h1>

        <button
          className="px-3 py-2 text-white bg-blue-500 rounded-md text-lg font-semibold flex items-center gap-1 hover:bg-blue-600 transition max-sm:rounded-full max-sm:p-3"
          onClick={() => setOpenModal(true)}
        >
          <span className="max-sm:hidden">Create</span>
          <Plus className="w-5 h-5 rounded-full" />
        </button>
      </div>

      {/* Course Card */}
      <div className="flex flex-col gap-2">
        {data.result.map((course) => (
          <DashboardCourseCard
            name={course.title}
            description={course.description}
            thumbnail={course.thumbnail}
            rating={course.rating}
            courseId={course._id}
            course={course}
            onEdit={(c) => {
              setSelectedCourse(c);
              setEditModalOpen(true);
            }}
            key={course._id}
          />
        ))}
      </div>

      <CreateCourseModal open={openModal} onClose={() => setOpenModal(false)} />
      <UpdateCourseModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        course={selectedCourse}
      />
      <CreateLectureModal
        open={lectureModalState}
        onClose={() => setLectureModalState(false)}
      />
    </div>
  );
};

export default CourseManagement;
