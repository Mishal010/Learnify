import express from "express";
import {
  getInstructorAnalytics,
  getGlobalAnalytics,
  getStudentAnalytics,
} from "../controllers/dashboardController.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Instructor analytics (teacher or admin)
router.get(
  "/instructor",
  isAuthenticated,
  authorizeRoles(["teacher", "admin"]),
  getInstructorAnalytics
);

// Student analytics (student)
router.get(
  "/student",
  isAuthenticated,
  authorizeRoles(["student"]),
  getStudentAnalytics
);

// Global analytics (admin)
router.get(
  "/global",
  isAuthenticated,
  authorizeRoles(["admin"]),
  getGlobalAnalytics
);

export default router;
