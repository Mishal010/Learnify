import { BookCheckIcon, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";
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
  const totalAmount = data?.totalAmount || 0;

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <BookCheckIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500">
            Add some courses to get started with your learning journey!
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ---------------- Cart Items ---------------- */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {cartItems.map((c) => (
                  <div
                    key={c.course._id}
                    className="p-4 md:p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <div className="flex gap-4">
                      <img
                        src={c.course.thumbnail}
                        alt={c.course.title}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {c.course.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-2">
                          Instructor: {c.course.instructor?.name || "Unknown"}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            ₹{c.course.price}
                          </span>

                          <span className="text-yellow-500 font-medium">
                            ⭐ {c.course.rating}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeMutation.mutate({
                            courseId: c.course._id,
                          })
                        }
                        disabled={
                          removeMutation.isLoading &&
                          removeMutation.variables?.courseId === c.course._id
                        }
                        className="bg-red-500 w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600 text-white transition disabled:opacity-60"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- Summary ---------------- */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4 pb-4 border-b">
                <span className="text-gray-600">
                  {cartItems.length} Course
                  {cartItems.length > 1 ? "s" : ""}
                </span>
                <span className="font-semibold">₹{totalAmount}</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-green-800 text-sm font-medium">
                  ✓ No additional fees or taxes
                </p>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={makePayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You will be redirected to Stripe's secure checkout page
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
