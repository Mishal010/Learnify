import Cart from "../model/Cart.js";
import Course from "../model/Course.js";
import Enrollment from "../model/Enrollment.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.course",
      select: "-description",
      populate: {
        path: "instructor",
        select:
          "-password -createdAt -updatedAt -resetToken -resetExpiry -role",
      },
    });
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty.",
        cart: { items: [] },
      });
    }

    if (cart.items.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "Cart is empty.", cart, total: 0 });
    }

    const totalPrice = cart.items.reduce(
      (sum, items) => sum + items.course?.price,
      0
    );

    res.status(200).json({
      success: true,
      message: "Fetched cart items",
      cart,
      totalAmount: totalPrice,
    });
  } catch (error) {
    console.error("Get Cart Error: ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const enrolledCourse = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (enrolledCourse) {
      return res.status(400).json({
        success: false,
        message: "You already enrolled in this course.",
      });
    }

    // Check current cart items count
    const userCart = await Cart.findOne({ user: req.user._id });
    if (userCart && userCart.items.length >= 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum 4 courses allowed in cart at a time.",
      });
    }

    const result = await Cart.findOneAndUpdate(
      {
        user: req.user._id,
        "items.course": { $ne: courseId },
      },
      {
        $push: { items: { course: courseId } },
      },
      {
        new: true,
        upsert: true,
      }
    );

    // If the course was already in cart
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Course already in cart",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Course added to cart successfully",
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    // Handle duplicate key error (race condition creating the cart)
    if (
      error &&
      (error.code === 11000 ||
        (error.message && error.message.includes("E11000")))
    ) {
      return res.status(400).json({
        success: false,
        message: "Course already in cart",
      });
    }

    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// DELETE - student:
export const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const index = cart.items.findIndex(
      (i) => String(i.course) === String(courseId)
    );

    if (index === -1) {
      return res.status(400).json({ message: "Course not in cart" });
    }

    cart.items.splice(index, 1);
    await cart.save();

    res.status(200).json({
      message: "Course removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove from Cart Error: ", error);
    res
      .status(500)
      .json({ success: false, message: `Server Error : ${error.message}` });
  }
};
