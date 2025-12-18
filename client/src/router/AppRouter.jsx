import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleBasedRoute from "../utils/RoleBasedRoute";
import Test from "../pages/protected/Test";
import {
  Book,
  ChartColumnIncreasing,
  Home,
  LayoutDashboard,
  UploadCloudIcon,
  User2Icon,
} from "lucide-react";
// import { useAuth } from "../utils/useAuth";
import PublicRoute from "../utils/PublicRoute";
import { useAuthStore } from "../store/useAuthStore";
import DashBoardLayout from "../layouts/DashBoardLayout";
import Analytics from "../pages/protected/Analytics";
import Courses from "../pages/protected/Courses";
import CourseManagement from "../pages/protected/CourseManagement";
import Profile from "../pages/protected/Profile";
import Explore from "../pages/Explore";
import ContactUs from "../pages/ContactUs";
import CourseDetails from "../pages/CourseDetails";
import MainLayout from "../layouts/MainLayout";
import About from "../pages/About";
import ProtectedRoute from "../utils/ProtectedRoute";
import Cart from "../pages/protected/Cart";
import CoursePlayer from "../pages/CoursePlayer";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";

const AppRouter = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:id" element={<CourseDetails />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<About />} />
        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-failed"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PaymentFailed />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/test"
        element={
          <RoleBasedRoute allowedRoles={["teacher"]}>
            <Test />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/instructor"
        element={
          <RoleBasedRoute allowedRoles={["teacher"]}>
            <DashBoardLayout
              menu={[
                {
                  label: "Analytics",
                  icon: LayoutDashboard,
                  path: "/instructor",
                },
                {
                  label: "List Courses",
                  icon: Book,
                  path: "/instructor/courses",
                },
                {
                  label: "Manage Courses",
                  icon: UploadCloudIcon,
                  path: "/instructor/create-or-edit",
                },
                {
                  label: "Profile",
                  icon: User2Icon,
                  path: "/instructor/profile",
                },
              ]}
            />
          </RoleBasedRoute>
        }
      >
        <Route index element={<Analytics />} />
        <Route path="courses" element={<Courses />} />
        <Route path="create-or-edit" element={<CourseManagement />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
