import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet"],
    },
    failureReason: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundedAt: {
      type: Date,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ stripeSessionId: 1 });
paymentSchema.index({ status: 1 });

// Auto-delete pending payments after a fixed TTL (default: 1 hour)
const ttlSeconds = parseInt(process.env.PAYMENT_TTL_SECONDS, 10) || 60 * 15;
paymentSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: ttlSeconds,
    partialFilterExpression: { status: "pending" },
  }
);

export default mongoose.model("Payment", paymentSchema);
