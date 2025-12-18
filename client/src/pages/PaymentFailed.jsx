import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState(null);

  const failureReasons = [
    {
      id: 1,
      title: "Card Declined",
      description: "Your bank declined the payment.",
      icon: "💳",
    },
    {
      id: 2,
      title: "Insufficient Funds",
      description: "Not enough balance in your account.",
      icon: "💰",
    },
    {
      id: 3,
      title: "Incorrect Details",
      description: "Entered card details are incorrect.",
      icon: "⚠️",
    },
    {
      id: 4,
      title: "Connection Error",
      description: "Temporary network issue.",
      icon: "🌐",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-3">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white rounded-full p-2">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">Payment Failed</h1>
            <p className="text-red-50 text-xs mt-1">
              Your payment could not be completed
            </p>
          </div>

          {/* Content */}
          <div className="px-4 py-5">
            {/* Info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-5 rounded">
              <p className="text-yellow-800 text-xs leading-relaxed">
                <strong>No money was deducted.</strong>
                Any temporary charge will be reversed within 3–5 days.
              </p>
            </div>

            {/* Reasons */}
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Possible reasons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {failureReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() =>
                    setSelectedReason(
                      selectedReason?.id === reason.id ? null : reason
                    )
                  }
                  className={`p-3 text-left rounded-md border transition ${
                    selectedReason?.id === reason.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <p className="text-lg">{reason.icon}</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {reason.title}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    {reason.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-300"
              >
                Back to Cart
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full border border-gray-300 py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t text-center">
            <p className="text-[11px] text-gray-500">
              Need help? support@lms.com
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-600 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          Your payment information is secure
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
