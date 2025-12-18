import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  getSignature,
  updateCourse,
  verifyEnrollment,
} from "../controllers/courseController.js";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllCourses);

router.get(
  "/instructor",
  isAuthenticated,
  authorizeRoles(["teacher"]),
  getInstructorCourses
);

router.get(
  "/signature",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  getSignature
);

router.get("/:courseId/verify-enrollment", isAuthenticated, verifyEnrollment);

router.get("/:id", getCourseById);

router.post(
  "/",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  createCourse
);

router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  updateCourse
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  deleteCourse
);

export default router;
