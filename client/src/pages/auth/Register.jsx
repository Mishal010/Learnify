import React, { useState } from "react";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
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

  // ===== Email Validation =====
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ===== Strong Password Validation =====
  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  // ===== Submit Handler =====
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { email: "", password: "", api: "" };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be 8+ characters with uppercase, lowercase, number & special character";
    }

    if (!formData.role) {
      newErrors.api = "Please select a role";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password || newErrors.api) return;

    registerMutation.mutate(formData, {
      onSuccess: () => navigate("/login"),
      onError: (err) => {
        setErrors({
          ...newErrors,
          api: err?.response?.data?.message || "Registration failed",
        });
      },
    });
  };

  return (
    <div className="flex h-[700px] w-full">
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Welcome To Learnify! Please sign up to continue
          </p>

          {/* Username */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-8">
            <UserIcon />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              required
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full bg-transparent mt-6 border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <MailIcon />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email id"
              required
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
            />
          </div>

          {errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left w-full">
              {errors.email}
            </p>
          )}

          {/* Password */}
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <LockIcon />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
            />
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1 text-left w-full">
              {errors.password}
            </p>
          )}

          {/* Role */}
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden px-5 gap-2">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
            >
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* API Error */}
          {errors.api && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.api}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <NavLink className="text-indigo-400 hover:underline" to="/login">
              Sign in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
