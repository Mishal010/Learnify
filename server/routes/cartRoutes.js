import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", isAuthenticated, getCart);

router.patch("/:courseId", isAuthenticated, addToCart);

router.delete("/:courseId", isAuthenticated, removeFromCart);

export default router;
