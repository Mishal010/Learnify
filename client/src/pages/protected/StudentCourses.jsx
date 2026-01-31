import React from "react";
import Loader from "../Loader";
import CourseCard from "../../components/CourseCard";
import { useEnrolledCourses } from "../../hooks/queries/useEnrolledCourses";

const StudentCourses = () => {
  const { data, isLoading } = useEnrolledCourses();
  if (isLoading) return <Loader />;

  const courses = data?.enrolledCourses || data?.courses || data || [];

  const courseList = courses.map((item) => {
    if (item && item.course) {
      return { ...item.course, isOwned: true };
    }
    return { ...item, isOwned: true };
  });

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-3xl font-semibold mb-3">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courseList.length ? (
          courseList.map((c, idx) => (
            <CourseCard key={c._id || idx} course={c} index={idx} />
          ))
        ) : (
          <p className="text-gray-600">
            You are not enrolled in any courses yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
