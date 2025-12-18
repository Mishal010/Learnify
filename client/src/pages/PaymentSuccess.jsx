import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react";
import axiosInstance from "../api/axiosClient";
import Loader from "./Loader";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/payment/session-details?sessionId=${sessionId}`
        );
        if (response.data.success) {
          setPaymentData(response.data.payment);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchPaymentDetails();
    }
  }, [sessionId]);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-2">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-emerald-50 text-sm">
              Your enrollment is complete
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Amount */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
              <p className="text-gray-600 text-sm font-medium mb-1">
                Amount Paid
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{paymentData?.amount || 0}
              </p>
            </div>

            {/* Enrolled Courses */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Enrolled Courses ({paymentData?.courses?.length || 0})
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {paymentData?.courses?.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <p className="text-sm font-medium text-gray-800 flex-1 truncate">
                      {course.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm font-medium">
                ✓ You can now access all your enrolled courses from your
                dashboard
              </p>
            </div>

            {/* Redirect Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Redirecting to home page in{" "}
                <span className="font-bold text-lg text-blue-900">
                  {countdown}s
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/protected/courses")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View My Courses
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                Go to Home
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              Payment ID: {paymentData?.id?.toString().slice(-8) || "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(paymentData?.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Thank you for your purchase! Happy learning 🎓
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
