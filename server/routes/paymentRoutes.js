import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  getSessionDetails,
  getPaymentHistory,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
router.get("/session-details", isAuthenticated, getSessionDetails);
router.get("/history", isAuthenticated, getPaymentHistory);
// router.post("/enroll", isAuthenticated, demoEnroll);

export default router;
