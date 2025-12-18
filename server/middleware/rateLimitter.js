import { rateLimit } from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: {
    success: false,
    message: "To many request from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false, // Set to false if you ONLY want to support modern clients (RFC 6585) else set to true.
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many login attempts,please try again after 1 minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
