import express from "express";
import Cart from "../model/Cart.js";
import Enrollment from "../model/Enrollment.js";
import Payment from "../model/Payment.js";
import Course from "../model/Course.js";
import stripe from "../config/stripe.js";
import { paginate } from "../utils/paginate.js";

/* ======================================================
   CREATE STRIPE CHECKOUT SESSION
====================================================== */
export const createCheckoutSession = async (req, res) => {
  try {
    const { user } = req;

    // Fetch cart with populated course + instructor
    const cart = await Cart.findOne({ user: user._id }).populate({
      path: "items.course",
      select: "_id title price thumbnail instructor",
      populate: {
        path: "instructor",
        select: "name",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.course.title,
          description: `Instructor: ${item.course.instructor?.name || "N/A"}`,
          images: [item.course.thumbnail],
        },
        unit_amount: Math.round(item.course.price * 100),
      },
      quantity: 1,
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.course.price,
      0,
    );

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${frontendUrl}/explore`,
      cancel_url: `${frontendUrl}/payment-failed`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        courseIds: cart.items.map((i) => i.course._id.toString()).join(","),
      },
    });

    const payment = await Payment.create({
      user: user._id,
      courses: cart.items.map((i) => i.course._id),
      amount: totalAmount,
      currency: "inr",
      stripeSessionId: session.id,
      status: "pending",
      stripeEventIds: [],
    });

    res.status(200).json({
      success: true,
      url: session.url,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   STRIPE WEBHOOK HANDLER
====================================================== */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;

      case "checkout.session.expired":
        await handleSessionExpired(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log("Unhandled Stripe event:", event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ success: false });
  }
};

/* ======================================================
   WEBHOOK HELPERS
====================================================== */
async function handleCheckoutCompleted(event) {
  const session = event.data.object;

  const payment = await Payment.findOne({
    stripeSessionId: session.id,
  });

  if (!payment) return;

  // Idempotency check
  if (payment.stripeEventIds?.includes(event.id)) return;

  if (payment.status === "completed") return;

  payment.status = "completed";
  payment.stripePaymentIntentId = session.payment_intent;
  payment.stripeEventIds.push(event.id);
  await payment.save();

  for (const courseId of payment.courses) {
    const exists = await Enrollment.findOne({
      user: payment.user,
      course: courseId,
    });

    if (!exists) {
      await Enrollment.create({
        user: payment.user,
        course: courseId,
        enrolledDate: new Date(),
      });
    }
  }

  await Cart.findOneAndUpdate({ user: payment.user }, { items: [] });

  console.log("Payment completed & enrollment successful");
}

async function handleSessionExpired(session) {
  const payment = await Payment.findOne({
    stripeSessionId: session.id,
  });

  if (!payment || payment.status !== "pending") return;

  payment.status = "failed";
  payment.failureReason = "Checkout session expired";
  await payment.save();
}

async function handlePaymentFailed(intent) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: intent.id,
  });

  if (!payment) return;

  payment.status = "failed";
  payment.failureReason =
    intent.last_payment_error?.message || "Payment failed";
  await payment.save();
}

/* ======================================================
   GET SESSION DETAILS (FRONTEND VERIFY)
====================================================== */
export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const { user } = req;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID required",
      });
    }

    const payment = await Payment.findOne({
      stripeSessionId: sessionId,
      user: user._id,
    }).populate("courses", "title thumbnail");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Session details error:", error);
    res.status(500).json({ success: false });
  }
};

/* ======================================================
   PAYMENT HISTORY
====================================================== */
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("courses", "title thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Payment history error:", error);
    res.status(500).json({ success: false });
  }
};

// GET - Admin: list all payments with pagination
export const getAllPayments = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const query = status ? { status } : {};

    const data = await paginate(Payment, query, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [
        { path: "user", select: "name email" },
        { path: "courses", select: "title" },
      ],
    });

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
