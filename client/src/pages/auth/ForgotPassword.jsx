import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPassword } from "../../hooks/mutation/useForgotPassword";
import { MailIcon, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const mutation = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(
      { email },
      {
        onSuccess: () => {
          // Instead of navigating away immediately, show the success state
          setIsSubmitted(true);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
          {!isSubmitted ? (
            // Form View
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <MailIcon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Forgot Password?
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  No worries! Enter your email and we'll send you reset
                  instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      <MailIcon size={20} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending Link...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            // Success View
            <div className="text-center py-4 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your mail
              </h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                We have sent a password recover instructions to your email
                <span className="font-semibold text-gray-900 block mt-1">
                  {email}
                </span>
              </p>

              <button
                onClick={() => window.open("https://gmail.com", "_blank")}
                className="w-full py-3.5 px-4 mb-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Open Email App
              </button>

              <p className="text-xs text-gray-400">
                Did not receive the email? Check your spam filter, or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-indigo-600 hover:underline"
                >
                  try another email address
                </button>
                .
              </p>
            </div>
          )}

          {/* Back to Login Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
