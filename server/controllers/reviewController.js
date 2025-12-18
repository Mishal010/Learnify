import Review from "../model/Review.js";
import Course from "../model/Course.js";
import Enrollment from "../model/Enrollment.js";
import { updateCourseRating } from "../helper/updateCourseRating.js";
import { paginate } from "../utils/paginate.js";

export const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    const { comment, rating } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found." });
    }

    const isEnrolledInCourse = await Enrollment.findOne({
      course: courseId,
      user: user._id,
    });

    if (!isEnrolledInCourse) {
      return res.status(403).json({
        success: false,
        message: "You have no authority to review this course",
      });
    }

    const alreadyReviewed = await Review.findOne({
      user: user._id,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course once.",
      });
    }

    const review = await Review.create({
      user: user._id,
      course: courseId,
      comment,
      rating,
    });

    await updateCourseRating(courseId);

    res.status(200).json({ success: true, message: "Review Created" });
  } catch (error) {
    console.error(`Create Review Error : ${error}`);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page, limit } = req.query;

    const query = { course: courseId };
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    const reviews = await paginate(Review, query, {
      page,
      limit,
      sort: { rating: -1 },
      populate: {
        path: "user",
        select: "name",
      },
    });

    res.status(200).json({ success: true, ...reviews });
  } catch (error) {
    console.error(`Get All Review Error : ${error}`);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

// DELETE - Owner/Admin
export const deleteReview = async (req, res) => {
  try {
    const { courseId, reviewId } = req.params;
    const user = req.user;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isAdmin = user.role === "admin";
    const isOwner = review.user.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    await review.deleteOne();

    await updateCourseRating(courseId);

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error(`Delete Review Error : ${error}`);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ user: userId })
      .populate("course", "title thumbnail _id") // optional
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(`Get My Reviews Error: ${error}`);
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { courseId, reviewId } = req.params;
    const user = req.user;
    const { comment, rating } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review",
      });
    }

    if (comment) review.comment = comment;
    if (rating) review.rating = rating;

    await review.save();

    await updateCourseRating(courseId);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error(`Update Review Error: ${error}`);
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
