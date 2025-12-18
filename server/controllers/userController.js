import User from "../model/User.js";
import Enrollment from "../model/Enrollment.js";
import { paginate } from "../utils/paginate.js";

// GET - Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query;

    const query = role ? { role } : {};

    const data = await paginate(User, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password",
    });

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE - Admin

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET - Any user

export const profile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userDetails = await User.findById(userId)
      .select("-password -__v")
      .lean();

    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: userDetails });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT - Any user

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user?._id;
    const updatedName = req.body.name || user.name;
    const updatedEmail = req.body.email || user.email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name: updatedName, email: updatedEmail } },
      { new: true, runValidators: true, select: "-password -__v" }
    ).lean();

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET - Teacher/Students

export const enrollments = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const courses = await Enrollment.find({ user: userId })
      .populate({
        path: "course",
        select: "title category thumbnail instructor",
        populate: {
          path: "instructor",
          select: "name", // nested populate
        },
      })
      .sort({ enrolledDate: -1 })
      .lean();

    res.status(200).json({
      success: true,
      totalEnrolled: courses.length,
      enrolledCourses: courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
