import mongoose from "mongoose";

import Review from "../model/Review.js";
import Course from "../model/Course.js";

export const updateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(String(courseId)) } },
    {
      $group: {
        _id: "$course",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      rating: stats[0].avgRating,
      numberOfReviews: stats[0].count,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      rating: 0,
      numberOfReviews: 0,
    });
  }
};
