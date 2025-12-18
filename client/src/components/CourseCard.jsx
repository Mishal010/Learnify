import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Star, User, ShoppingCart } from "lucide-react";
import { useAddToCart } from "../hooks/mutation/useAddToCart";

const CourseCard = ({ course, index }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => `₹${price}`;

  const addToCart = useAddToCart();

  const goToCourse = () => navigate(`/course/${course._id}`);
  const viewCourse = () => navigate(`/explore/${course._id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (addToCart.isLoading) return;
    addToCart.mutate({ courseId: course._id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="cursor-default"
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden w-full">
        {/* Thumbnail */}
        <div className="h-52 bg-white px-3 pt-3">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover rounded-md "
          />
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <User className="w-3.5 h-3.5" />
            <span className="truncate">
              {course.instructor?.name || "John Doe"}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(course.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 gap-3">
            <span className="text-sm font-semibold text-indigo-600">
              {course.isOwned ? "Enrolled" : formatPrice(course.price)}
            </span>

            {course.isOwned ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToCourse();
                }}
                className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-600"
              >
                Go to course
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    viewCourse();
                  }}
                  className="text-xs px-3 py-1 rounded-full font-medium bg-indigo-500 text-white hover:cursor-pointer"
                >
                  View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
