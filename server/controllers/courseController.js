import Course from "../model/Course.js";
import { paginate } from "../utils/paginate.js";
import { imagekit } from "../config/imagekit.js";
import Lecture from "../model/Lecture.js";
import Enrollment from "../model/Enrollment.js";

// GET - public
export const getAllCourses = async (req, res) => {
  try {
    const { page, limit, category, search } = req.query;
    const query = {};

    if (category && category.trim() !== "") {
      query.category = category.trim();
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    if (category && category.trim() !== "" && search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query = {
        category: category.trim(),
        $or: [{ title: { $regex: regex } }, { category: { $regex: regex } }],
      };
    }

    const data = await paginate(Course, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-description",
      populate: {
        path: "instructor",
        select: "name", // Return only name/email instead of password etc.
      },
    });

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Course Error: ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// GET - public
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate({
      path: "instructor",
      select: "name",
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Course Error: ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// POST - instructor

export const createCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, price, thumbnail, category } = req.body;

    if (!title || !description || !price || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existing = await Course.findOne({
      title: title.trim(),
      instructor: userId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a course with this title.",
      });
    }

    const newCourse = await Course.create({
      title,
      description,
      price,
      thumbnail,
      category,
      instructor: userId,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already created a course with this title",
      });
    }
    console.error("Create Course Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// PUT - instructor:
export const updateCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, price, thumbnail, category } = req.body;

    if (!title && !description && !price && !thumbnail && !category) {
      return res
        .status(400)
        .json({ success: false, message: "At least one field is required" });
    }

    const existing = await Course.findOne({ _id: id, instructor: userId });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Course not found or the course is not yours",
      });
    }

    existing.title = title ?? existing.title;
    existing.description = description ?? existing.description;
    existing.price = price ?? existing.price;
    existing.thumbnail = thumbnail ?? existing.thumbnail;
    existing.category = category ?? existing.category;
    await existing.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: existing,
    });
  } catch (error) {
    console.error("Update Course Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// DELETE - instructor/Admin

export const deleteCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (String(course.instructor) !== String(userId) && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    const lectures = await Lecture.find({ course: id });

    for (const lec of lectures) {
      try {
        await imagekit.deleteFile(lec.fileId);
      } catch (error) {
        console.error(`Failed to delete ${lec.fileId}`, error.message);
      }
    }
    await Lecture.deleteMany({ course: id });

    await course.deleteOne();
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete Course Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// GET - instructor:

export const getInstructorCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;
    const data = await paginate(
      Course,
      { instructor: userId },
      { page, limit, sort: { createdAt: -1 } }
    );

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Get Instructor Courses Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// GET - instructor:
export const getSignature = async (req, res) => {
  try {
    const authParam = await imagekit.getAuthenticationParameters();
    res.status(200).json({ success: true, authParam });
  } catch (error) {
    console.error("Get Signature Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

// GET - Check if user is enrolled in a course or is the instructor
export const verifyEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    // Check if user is the instructor of the course
    const course = await Course.findById(courseId);
    const isInstructor = course && String(course.instructor) === String(userId);

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment || isInstructor,
    });
  } catch (error) {
    console.error("Verify Enrollment Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};
