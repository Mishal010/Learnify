import Course from "../model/Course.js";
import Lecture from "../model/Lecture.js";
import Enrollment from "../model/Enrollment.js";
import { imagekit } from "../config/imagekit.js";

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, order, fileId, url } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found" });
    }

    const isOwner = String(course.instructor) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add lectures to this course",
      });
    }

    const lecture = await Lecture.create({
      title,
      order,
      url,
      fileId,
      course: course._id,
    });

    res.status(201).json({ success: true, message: "Lecture created" });
  } catch (error) {
    console.error("Create Lecture Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

// PATCH - instructor/Admin
export const updateLecture = async (req, res) => {
  const { lectureId } = req.params;
  const { title, order, url, fileId } = req.body;
  try {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Associated course not found" });
    }

    const isOwner = String(course.instructor) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this lecture",
      });
    }
    // Read and understand again
    if (order && lecture.order !== order) {
      const existingLecture = await Lecture.findOne({
        course: lecture.course,
        order: order,
        _id: { $ne: lectureId }, // Ensure it's not this same lecture
      });

      if (existingLecture) {
        return res.status(409).json({
          success: false,
          message: `Order ${order} is already taken. Please choose another order number.`,
        });
      }
      lecture.order = order;
    }

    if (fileId && fileId !== lecture.fileId) {
      try {
        await imagekit.deleteFile(lecture.fileId); // Pass the OLD fileId to be deleted
      } catch (deleteError) {
        console.error("Failed to delete old file from ImageKit: ", deleteError);
        // We won't block the update, but we will log the error.
      }

      // Update the lecture with the new file informations
      lecture.url = url;
      lecture.fileId = fileId;
    }

    if (title) {
      lecture.title = title;
    }

    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A lecture with this order number already exists in this course.",
      });
    }
    console.error("Update Lecture Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

// DELETE - instructor/Admin
export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not foud" });
    }

    const course = await Course.findById(lecture.course);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const isOwner = String(course.instructor) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this lecture",
      });
    }

    await imagekit.deleteFile(lecture.fileId);
    await lecture.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Lecture deleted from DB and ImageKit" });
  } catch (error) {
    console.error("Delete Lecture Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

// GET - enrolled student/instructor/admin:

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const isEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });
    const isOwner = String(course.instructor) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isEnrolled && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view the lectures of this course",
      });
    }

    const lectures = await Lecture.find({ course: courseId }).sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      message: "Fetched all the lectures of the course successfully",
      lectures,
    });
  } catch (error) {
    console.error("Get Lectures Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

// GET - enrolled student:

export const getParticularLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    const course = await Course.findById(lecture.course);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = course.instructor.equals(req.user._id);

    const isEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (!isAdmin && !isOwner && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this lecture",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched lecture successfully",
      lecture,
    });
  } catch (error) {
    console.error("Get Lecture Error : ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};
