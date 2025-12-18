import Cart from "../model/Cart.js";
import Enrollment from "../model/Enrollment.js";
import Payment from "../model/Payment.js";
import Course from "../model/Course.js";
import stripe from "../config/stripe.js";

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { user } = req;
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in cart",
      });
    }

    // Get full cart details with course information
    const cart = await Cart.findOne({ user: user._id }).populate({
      path: "items.course",
      model: "Course",
      select: "_id title price thumbnail instructor",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare line items for Stripe
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.course.title,
          description: `Instructor: ${item.course.instructor.name}`,
          images: [item.course.thumbnail],
          metadata: {
            courseId: item.course._id.toString(),
          },
        },
        unit_amount: Math.round(item.course.price * 100), // Convert to paise
      },
      quantity: 1,
    }));

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.course.price,
      0
    );

    // Create Stripe session
    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment-failed`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        cartItems: cart.items
          .map((item) => item.course._id.toString())
          .join(","),
      },
    });

    // Create payment record in database
    const payment = await Payment.create({
      user: user._id,
      courses: cart.items.map((item) => item.course._id),
      amount: totalAmount,
      currency: "inr",
      stripeSessionId: session.id,
      status: "pending",
      metadata: {
        itemCount: cart.items.length,
      },
    });

    res.status(200).json({
      success: true,
      id: session.id,
      url: session.url,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Handle Stripe Webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;
      case "checkout.session.expired":
        await handleSessionExpired(event.data.object);
        break;
      case "charge.failed":
        await handleChargeFailed(event.data.object);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

// Process completed session
async function handleSessionCompleted(session) {
  const payment = await Payment.findOne({ stripeSessionId: session.id });

  if (!payment) {
    console.error("Payment record not found for session:", session.id);
    return;
  }

  // Update payment status
  payment.status = "completed";
  payment.stripePaymentIntentId = session.payment_intent;
  await payment.save();

  // Enroll user in all courses
  for (const courseId of payment.courses) {
    const isAlreadyEnrolled = await Enrollment.findOne({
      user: payment.user,
      course: courseId,
    });

    if (!isAlreadyEnrolled) {
      await Enrollment.create({
        user: payment.user,
        course: courseId,
        enrolledDate: new Date(),
      });
    }
  }

  // Clear user's cart
  await Cart.findOneAndUpdate(
    { user: payment.user },
    { items: [] },
    { new: true }
  );

  console.log(`Payment completed and user enrolled for courses`);
}

// Handle refunded charge
async function handleChargeRefunded(charge) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: charge.payment_intent,
  });

  if (payment) {
    payment.status = "refunded";
    payment.refundAmount = charge.amount_refunded / 100; // Convert from paise to rupees
    payment.refundedAt = new Date();
    await payment.save();

    console.log(`Payment refunded for user: ${payment.user}`);
  }
}

// Handle expired checkout session
async function handleSessionExpired(session) {
  const payment = await Payment.findOne({ stripeSessionId: session.id });

  if (payment) {
    payment.status = "failed";
    payment.failureReason =
      "Checkout session expired - User did not complete payment within time limit";
    await payment.save();

    console.log(
      `Checkout session expired for user: ${payment.user}, Session ID: ${session.id}`
    );
  }
}

// Handle failed charge
async function handleChargeFailed(charge) {
  const payment = await Payment.findOne({
    stripePaymentIntentId: charge.payment_intent,
  });

  if (payment) {
    payment.status = "failed";
    payment.failureReason =
      charge.failure_message || "Payment declined by card issuer";
    await payment.save();

    console.log(
      `Payment failed for user: ${payment.user}, Reason: ${charge.failure_message}`
    );
  }
}

// Get session details (for verification on frontend)
export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const { user } = req;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment belongs to current user
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
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        courses: payment.courses,
        createdAt: payment.createdAt,
      },
      sessionStatus: session.status,
    });
  } catch (error) {
    console.error("Session details error:", error);
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// Get payment history for user
export const getPaymentHistory = async (req, res) => {
  try {
    const { user } = req;

    const payments = await Payment.find({ user: user._id })
      .populate("courses", "title thumbnail")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Payment history error:", error);
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};
