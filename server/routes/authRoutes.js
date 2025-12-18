import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
  requestReset,
  resetPassword,
} from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimitter.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);

router.post("/logout", isAuthenticated, logout);

router.post("/refresh", refresh);

router.post("/request-reset", requestReset);

router.post("/reset-password/:token", resetPassword);

export default router;
