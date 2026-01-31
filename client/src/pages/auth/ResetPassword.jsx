import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/mutation/useResetPassword";
import {
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useResetPassword();

  // Validate match on type
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    mutation.mutate(
      { token, newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
          // Redirect after 2 seconds so user sees the success message
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2500);
        },
        onError: (err) => {
          setError(err?.response?.data?.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
          alt="Technology Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
          {!isSuccess ? (
            // === Form View ===
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Set new password
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Your new password must be different to previously used
                  passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      <LockIcon size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOffIcon size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                      <LockIcon size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`block w-full pl-12 pr-4 py-3.5 border ${
                        error
                          ? "border-red-300 ring-1 ring-red-100"
                          : "border-gray-300"
                      } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm`}
                      placeholder="••••••••"
                    />
                  </div>
                  {/* Validation Message */}
                  {error && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      {error}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={mutation.isPending || !!error}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
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
                        Resetting...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            // === Success View ===
            <div className="text-center py-8 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Password Reset!
              </h2>
              <p className="text-gray-500 mb-6">
                Your password has been successfully updated.
              </p>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 rounded-full">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-gray-600">
                  Redirecting to login...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
