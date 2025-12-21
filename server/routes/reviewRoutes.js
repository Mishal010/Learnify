import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getMyReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/my-reviews", isAuthenticated, getMyReviews);
router.get("/course/:courseId", getAllReviews);

router.post("/create/course/:courseId", isAuthenticated, createReview);

router.patch("/:reviewId/course/:courseId", isAuthenticated, updateReview);

router.delete("/:reviewId/course/:courseId", isAuthenticated, deleteReview);

export default router;
