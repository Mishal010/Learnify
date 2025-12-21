import { Router } from "express";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  enrollments,
  getAllUsers,
  profile,
  updateProfile,
} from "../controllers/userController.js";

const router = Router();

router.get("/all", isAuthenticated, authorizeRoles(["admin"]), getAllUsers);

router.get("/profile", isAuthenticated, profile);

router.get(
  "/enrollments",
  isAuthenticated,
  authorizeRoles(["admin", "teacher"]),
  enrollments
);

// Student-only endpoint to get the authenticated student's enrollments
router.get(
  "/my-enrollments",
  isAuthenticated,
  authorizeRoles(["student", "teacher"]),
  enrollments
);

router.put("/profile", isAuthenticated, updateProfile);

router.delete("/:id", isAuthenticated, authorizeRoles(["admin"]), deleteUser); // Also the owner of the account should be able to delete his/her profile - refactor

export default router;
