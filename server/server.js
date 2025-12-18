import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { connectDB } from "./config/db.js";
import { globalRateLimiter } from "./middleware/rateLimitter.js";
import reviewRoute from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import { handleStripeWebhook } from "./controllers/paymentController.js";
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(globalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/review", reviewRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/currency", currencyRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
