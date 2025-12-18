import Course from "../model/Course.js";
import Enrollment from "../model/Enrollment.js";
import User from "../model/User.js";
import Review from "../model/Review.js";
import mongoose from "mongoose";

// GET - Instructor analytics
// Returns: { courseCount, totalEnrolled (unique students), avgRating, revenue }
export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user && req.user._id;
    if (!instructorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find courses for instructor
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id price rating"
    );

    const courseCount = courses.length;

    if (courseCount === 0) {
      return res.status(200).json({
        success: true,
        courseCount: 0,
        totalEnrolled: 0,
        avgRating: 0,
        revenue: 0,
      });
    }

    const courseIds = courses.map((c) => c._id);

    // Total unique enrolled students across instructor's courses
    const uniqueStudents = await Enrollment.distinct("user", {
      course: { $in: courseIds },
    });
    const totalEnrolled = uniqueStudents.length;

    // Average rating across instructor's courses (use course.rating field)
    const ratings = courses.map((c) =>
      typeof c.rating === "number" ? c.rating : 0
    );
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    // Fake revenue: sum of (course.price * numberOfEnrollmentsForThatCourse)
    // We'll aggregate enrollments by course and multiply by price
    const enrollmentAgg = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]);

    // Map counts by course id string
    const countsByCourse = enrollmentAgg.reduce((acc, item) => {
      acc[String(item._id)] = item.count;
      return acc;
    }, {});

    let revenue = 0;
    for (const course of courses) {
      const cnt = countsByCourse[String(course._id)] || 0;
      const price = typeof course.price === "number" ? course.price : 0;
      revenue += price * cnt;
    }

    // Round avgRating to 2 decimals
    const roundedAvgRating =
      Math.round((avgRating + Number.EPSILON) * 100) / 100;

    res.status(200).json({
      success: true,
      courseCount,
      totalEnrolled,
      avgRating: roundedAvgRating,
      revenue,
    });
  } catch (error) {
    console.error("Get Instructor Analytics Error:", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// GET - Student analytics
// Returns: { enrolledCount, reviewCount, recentEnrolledCourses }
export const getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Total enrolled courses count
    const enrolledCount = await Enrollment.countDocuments({ user: userId });

    // Total reviews by student
    const reviewCount = await Review.countDocuments({ user: userId });

    // Suggestion implemented: include recent enrolled courses (last 5)
    const recentEnrollments = await Enrollment.find({ user: userId })
      .sort({ enrolledDate: -1 })
      .limit(5)
      .populate({
        path: "course",
        select: "_id title thumbnail instructor",
        populate: { path: "instructor", select: "name" },
      })
      .lean();

    const recentEnrolledCourses = recentEnrollments.map((e) => ({
      courseId: e.course?._id,
      title: e.course?.title,
      thumbnail: e.course?.thumbnail,
      instructor: e.course?.instructor?.name,
      enrolledDate: e.enrolledDate,
    }));

    res.status(200).json({
      success: true,
      enrolledCount,
      reviewCount,
      recentEnrolledCourses,
    });
  } catch (error) {
    console.error("Get Student Analytics Error:", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// GET - Global analytics (admin)
// Returns: { totalUsers: { students, teachers, admins, total }, totalCourses, totalRevenue }
export const getGlobalAnalytics = async (req, res) => {
  try {
    // optional: ensure requester is authenticated
    const requester = req.user && req.user._id;
    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Users counts
    const studentsCount = await User.countDocuments({ role: "student" });
    const teachersCount = await User.countDocuments({ role: "teacher" });
    const adminsCount = await User.countDocuments({ role: "admin" });
    const totalUsers = studentsCount + teachersCount + adminsCount;

    // Courses count
    const totalCourses = await Course.countDocuments();

    // Revenue (fake): sum of (course.price * enrollments count)
    const courses = await Course.find({}).select("_id price");
    const courseIds = courses.map((c) => c._id);

    if (courseIds.length === 0) {
      return res.status(200).json({
        success: true,
        totalUsers: {
          students: studentsCount,
          teachers: teachersCount,
          admins: adminsCount,
          total: totalUsers,
        },
        totalCourses: 0,
        totalRevenue: 0,
      });
    }

    const enrollmentAgg = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]);

    const countsByCourse = enrollmentAgg.reduce((acc, item) => {
      acc[String(item._id)] = item.count;
      return acc;
    }, {});

    let totalRevenue = 0;
    for (const course of courses) {
      const cnt = countsByCourse[String(course._id)] || 0;
      const price = typeof course.price === "number" ? course.price : 0;
      totalRevenue += price * cnt;
    }

    res.status(200).json({
      success: true,
      totalUsers: {
        students: studentsCount,
        teachers: teachersCount,
        admins: adminsCount,
        total: totalUsers,
      },
      totalCourses,
      totalRevenue,
    });
  } catch (error) {
    console.error("Get Global Analytics Error:", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};
