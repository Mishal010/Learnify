import { Router } from "express";
import { sendContactToAdmin } from "../controllers/contactController.js";

const router = Router();

// Public route to submit contact form
router.post("/", sendContactToAdmin);

export default router;
