import { Router } from "express";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/authMiddleware.js";
import {
  createLecture,
  deleteLecture,
  getCourseLectures,
  getParticularLecture,
  updateLecture,
} from "../controllers/lectureController.js";

const router = Router();

router.get(
  "/course/:courseId",
  isAuthenticated,
  authorizeRoles(["student", "admin", "teacher"]),
  getCourseLectures
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRoles(["student", "admin", "teacher"]),
  getParticularLecture
);

router.post(
  "/:courseId/upload-lecture",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  createLecture
);

router.patch(
  "/:lectureId",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  updateLecture
);

router.delete(
  "/:lectureId",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  deleteLecture
);

export default router;
