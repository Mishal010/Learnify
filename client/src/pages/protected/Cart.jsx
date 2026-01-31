import {
  BookCheckIcon,
  ShoppingCart,
  Trash2,
  CreditCard,
  Package,
} from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/queries/useCart";
import { createCheckoutSessionApi } from "../../api/cartApi";
import toast from "react-hot-toast";
import Loadin from "../../components/Loadin";
import { useRemoveFromCart } from "../../hooks/mutation/useRemoveFromCart";

const Cart = () => {
  const { data, isLoading } = useCart();
  const removeMutation = useRemoveFromCart();

  if (isLoading) return <Loadin />;

  const cartItems = data?.cart?.items || [];
  const validItems = cartItems.filter((c) => c && c.course && c.course._id);
  const totalAmount =
    validItems.reduce((sum, item) => sum + (item.course?.price || 0), 0) ||
    data?.totalAmount ||
    0;

  const makePayment = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      const response = await createCheckoutSessionApi(cartItems);

      if (!response?.success || !response?.url) {
        toast.error("Failed to create payment session");
        return;
      }

      window.location.href = response.url;
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <ShoppingCart className="w-12 h-12" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Shopping Cart
              </h1>
              <p className="text-xl text-indigo-100">
                {validItems.length}{" "}
                {validItems.length === 1 ? "course" : "courses"} in your cart
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-12 md:p-16 text-center border border-slate-200"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Add some courses to get started with your learning journey!
            </p>
            <Link
              to="/explore"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Browse Courses
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ---------------- Cart Items ---------------- */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Courses
                  </h2>
                </div>

                <div className="space-y-4">
                  {validItems.map((c, index) => (
                    <motion.div
                      key={c.course?._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex gap-4">
                          <img
                            src={
                              c.course?.thumbnail || "/placeholder-course.png"
                            }
                            alt={c.course?.title || "Course"}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover flex-shrink-0 shadow-md"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                              {c.course?.title || "Untitled Course"}
                            </h3>

                            <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                              <span className="font-medium">Instructor:</span>
                              {c.course?.instructor?.name || "Unknown"}
                            </p>

                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ₹{c.course?.price || 0}
                              </span>

                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-yellow-600 font-semibold bg-yellow-50 px-3 py-1 rounded-lg">
                                  ⭐ {c.course.rating}
                                </span>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    removeMutation.mutate({
                                      courseId: c.course?._id,
                                    })
                                  }
                                  disabled={
                                    removeMutation.isLoading &&
                                    removeMutation.variables?.courseId ===
                                      c.course?._id
                                  }
                                  className="bg-red-500 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600 text-white transition-all disabled:opacity-60 shadow-md"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ---------------- Summary ---------------- */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-14"
              >
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="text-gray-700 font-medium">
                        {validItems.length} Course
                        {validItems.length > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{totalAmount}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <p className="text-green-800 text-sm font-semibold flex items-center gap-2">
                        <span className="text-lg">✓</span>
                        No additional fees or taxes
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={makePayment}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 Secure checkout powered by Stripe
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
