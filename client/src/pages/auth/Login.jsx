import { LockIcon, MailIcon, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLogin } from "../../hooks/mutation/useLogin";
// import { useNavigate } from "react-router-dom"; // Kept for your actual usage

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  // const navigate = useNavigate(); // Uncomment for actual usage
  const loginMutation = useLogin();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        console.log("Login successful");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Image Panel (Hidden on mobile) */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-indigo-900 animate-fade-in-up">
        {/* Using a high-quality Unsplash image for a more 'real' feel */}
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Office Workspace"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/40 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <h2 className="text-4xl font-bold text-white leading-tight delay-200 animate-fade-in-up">
            Welcome to your <br />
            learning journey.
          </h2>
          <p className="mt-4 text-lg text-indigo-200 max-w-md delay-300 animate-fade-in-up">
            Access your courses, track your progress, and achieve your goals
            with Learnify.
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[600px] xl:w-[700px] bg-white relative">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header Section */}
          <div className="text-center lg:text-left mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Sign in to account
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Please enter your details to continue.
            </p>
          </div>

          {/* Form Section */}
          <div className="mt-10 animate-fade-in-up delay-100">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email Input */}
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
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <LockIcon size={20} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <NavLink
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Forgot password?
                  </NavLink>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:scale-[0.98]"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {/* Optional: Add an icon here that appears on hover */}
                  </span>
                  {loginMutation.isPending ? (
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
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <NavLink
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                Sign up instead
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
