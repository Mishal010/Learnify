import React from "react";
import { useCourseStore } from "../../store/useCourseStore";

const DashboardCourseCard = ({
  name,
  description,
  rating,
  thumbnail,
  courseId,
  course,
  onEdit,
}) => {
  const setLectureModalState = useCourseStore(
    (state) => state.setLectureModalState
  );
  const setSelectedCourseId = useCourseStore(
    (state) => state.setSelectedCourseId
  );
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex gap-4 max-lg:flex-col w-full">
      {/* Image */}
      <img
        className="rounded-md object-cover w-60  max-lg:w-full max-lg:h-45"
        src={thumbnail}
        alt="course"
      />

      {/* Right Section */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>

          <p className="mt-2 text-sm md:text-base font-medium text-gray-700 line-clamp-4">
            {description}
          </p>
        </div>

        {/* Bottom Action Row */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold text-gray-800 max-sm:text-sm">
            ⭐ {rating}
          </span>

          <div className="flex items-center gap-2">
            <button
              className="px-6 py-1 bg-amber-300 rounded-md text-lg font-medium hover:bg-amber-400 transition max-sm:text-sm"
              onClick={() => onEdit && onEdit(course)}
            >
              Edit
            </button>

            <button
              className="px-4 py-1 bg-green-400 rounded-md text-lg font-medium hover:bg-green-500 transition max-sm:text-sm"
              onClick={() => {
                setSelectedCourseId(courseId);
                setLectureModalState(true);
              }}
            >
              Add lectures
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseCard;
