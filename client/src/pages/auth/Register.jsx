import React, { useState } from "react";
import {
  LockIcon,
  MailIcon,
  UserIcon,
  ArrowRight,
  BriefcaseIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/mutation/useRegister";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: "", // Fixed key name from 'api' to match logic, added specific error keys
    api: "",
  });

  const navigate = useNavigate();
  const registerMutation = useRegister();

  // ===== Input Handler =====
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear live errors while typing
    setErrors({ ...errors, [e.target.name]: "", api: "" });
  };

  // ===== Validation Logic =====
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[0-9@$!%*?&]).{8,}$/.test(password);

  // ===== Submit Handler =====
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = { email: "", password: "", role: "", api: "" };
    let hasError = false;

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Must be 8+ chars with 1 special char & number";
      hasError = true;
    }
    if (!formData.role) {
      newErrors.role = "Please select a role";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    registerMutation.mutate(formData, {
      onSuccess: () => navigate("/login"),
      onError: (err) => {
        setErrors((prev) => ({
          ...prev,
          api:
            err?.response?.data?.message ||
            "Registration failed. Please try again.",
        }));
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[600px] xl:w-[700px] bg-white relative">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="text-center lg:text-left mb-10 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Join Learnify today and start your journey.
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 animate-fade-in-up delay-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <UserIcon size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <MailIcon size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`block w-full pl-12 pr-4 py-3.5 border ${
                      errors.email
                        ? "border-red-300 ring-red-100"
                        : "border-gray-300"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a...
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <BriefcaseIcon size={20} />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-10 py-3.5 border ${
                      errors.role ? "border-red-300" : "border-gray-300"
                    } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none bg-white`}
                    required
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  {/* Custom Arrow for Select */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <LockIcon size={20} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`block w-full pl-12 pr-4 py-3.5 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm`}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* API Global Error */}
              {errors.api && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                  {errors.api}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:scale-[0.98] mt-2"
              >
                {registerMutation.isPending ? (
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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Register{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
              >
                Sign in instead
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Panel (Hidden on mobile) */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-indigo-900 animate-fade-in-up">
        {/* Using a different image from the login page to distinguish the routes */}
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          alt="Students collaborating"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/40 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <h2 className="text-4xl font-bold text-white leading-tight delay-200 animate-fade-in-up">
            Join a community <br />
            of expert learners.
          </h2>
          <p className="mt-4 text-lg text-indigo-200 max-w-md delay-300 animate-fade-in-up">
            Unlock new skills, earn certifications, and expand your career
            opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
