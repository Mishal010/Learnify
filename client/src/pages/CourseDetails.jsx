import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Star,
  Users,
  Clock,
  ShoppingCart,
  ChevronRight,
  User,
  Video,
  Globe,
  Smartphone,
  Infinity,
  CheckCircle2,
  Lock,
  BookOpen,
  MonitorPlay,
  Share2,
} from "lucide-react";

// API Hooks
import { useCourseDetails } from "../hooks/queries/useCourseDetails";
import { useCourseLectures } from "../hooks/queries/useCourseLectures";
import { useCourseReviews } from "../hooks/queries/useCourseReviews";
import { useAddToCart } from "../hooks/mutation/useAddToCart";
import AddReview from "../components/AddReview";
import { useEnrollmentStatus } from "../hooks/queries/useEnrollmentStatus";
import Loader from "./Loader";
import Loadin from "../components/Loadin";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // 1. Fetch Real Data
  const { data: courseData, isLoading: courseLoading } = useCourseDetails(id);
  const { data: reviewsData, isLoading: reviewsLoading } = useCourseReviews({
    page: 1,
    limit: 10,
    courseId: id,
  });

  const addToCartMutation = useAddToCart();
  const { isEnrolled } = useEnrollmentStatus(id);

  if (courseLoading) {
    // 2. Loading State
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // 3. Destructure Data safely
  const course = courseData?.course;
  const reviews = reviewsData?.result || [];
  const totalReviews = reviewsData?.pagination?.total || 0;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Course Not Found</h2>
          <button
            onClick={() => navigate("/courses")}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Browse other courses
          </button>
        </div>
      </div>
    );
  }

  // 4. Handlers
  const handleAddToCart = () => {
    if (addToCartMutation.isPending) return;
    addToCartMutation.mutate({ courseId: course._id });
  };

  const handleEnroll = () => {
    if (course.isOwned) {
      navigate(`/course/${course._id}`);
    } else {
      handleAddToCart();
    }
  };

  const features = [
    { icon: Clock, text: "Lifetime Access", color: "text-purple-600" },
    {
      icon: Smartphone,
      text: "Mobile & Desktop Support",
      color: "text-pink-600",
    },
  ];

  const stats = [
    { label: "Rating", value: course.rating?.toFixed(1) || "New", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* --- HERO SECTION (Aurora Effect) --- */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pb-12 lg:pb-24 pt-20 lg:pt-28 overflow-hidden">
        {/* Aurora/Glow Elements (Modified for new background) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* White glow for contrast against the colored background */}
          <div className="absolute top-0 right-0 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-white rounded-full blur-[100px] lg:blur-[150px] -translate-y-1/2 translate-x-1/2 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-pink-300 rounded-full blur-[80px] lg:blur-[120px] translate-y-1/2 -translate-x-1/2 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {/* --- HERO LEFT: Info (Span 2) --- */}
            <div className="lg:col-span-2">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-indigo-100 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 uppercase tracking-wide"
              >
                <span
                  className="hover:text-white transition-colors cursor-pointer"
                  onClick={() => navigate("/courses")}
                >
                  Courses
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-200" />
                <span className="text-white bg-white/20 px-2 py-0.5 sm:px-3 rounded-full text-[10px] sm:text-xs font-bold border border-white/20 truncate max-w-[150px] backdrop-blur-md">
                  {course.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 text-white tracking-tight drop-shadow-sm"
              >
                {course.title}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-indigo-50 mb-6 sm:mb-8 leading-relaxed max-w-2xl font-medium opacity-95"
              >
                {course.description.length > 180
                  ? `${course.description.substring(0, 180)}...`
                  : course.description}
              </motion.p>

              {/* Stats & Metadata - Responsive Grid/Flex */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8"
              >
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 sm:gap-3 bg-white/10 sm:bg-white/10 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-white/20"
                    >
                      <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm sm:text-lg font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-indigo-100 font-bold uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-indigo-100 font-medium pt-4 border-t border-white/20"
              >
                <span className="flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Created by{" "}
                  <span className="text-white hover:underline cursor-pointer font-bold">
                    {course.instructor?.name || "Instructor"}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> English
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> Updated{" "}
                  {new Date().toLocaleDateString()}
                </span>
              </motion.div>
            </div>

            {/* --- HERO RIGHT: Card Part 1 (Thumbnail + Price + Buy) --- */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-2 shadow-2xl mx-auto w-full max-w-md lg:max-w-none text-slate-800"
              >
                {/* Thumbnail */}
                <div className="relative h-48 sm:h-56 rounded-xl bg-gray-900 group cursor-pointer overflow-hidden mb-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md whitespace-nowrap">
                    Preview Course
                  </span>
                </div>

                <div className="px-3 sm:px-4 pb-2 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-gray-900">
                        ₹{course.price}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        ₹{course.price * 2}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                      50% OFF
                    </span>
                  </div>

                  <div className="space-y-3">
                    {course.isOwned ? (
                      <button
                        onClick={handleEnroll}
                        className="w-full bg-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />{" "}
                        Go to Course
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        disabled={addToCartMutation.isPending}
                        className="w-full bg-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                      >
                        {addToCartMutation.isPending ? (
                          "Processing..."
                        ) : (
                          <>
                            {" "}
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                            Add to Cart{" "}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Course Details (Span 2) */}
          <div className="lg:col-span-2">
            {/* Tabs - Horizontal Scroll on Mobile */}
            <div className="border-b border-gray-200 mb-6 sm:mb-8 sticky top-0 bg-gray-50 z-20 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
              <div className="flex gap-6 sm:gap-8 min-w-max">
                {["overview", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 sm:pb-4 text-xs sm:text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Overview */}
                {activeTab === "overview" && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Course Description
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                        {course.description}
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-5 sm:p-8 rounded-2xl border border-indigo-100">
                      <h3 className="text-base sm:text-lg font-bold text-indigo-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Infinity className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                        Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-indigo-800">
                        <li>No prior experience needed.</li>
                        <li>A computer with internet access.</li>
                        <li>Willingness to learn.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Simplified Rating Header */}
                    <div className="text-4xl sm:text-5xl font-black text-gray-900">
                      {course.rating?.toFixed(1) || "0.0"}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="flex text-yellow-400 mb-1 justify-center sm:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < Math.round(course.rating || 0)
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        Course Rating
                      </div>
                    </div>

                    {/* Add review form (only for owners) */}
                    {isEnrolled && (
                      <div className="bg-white p-6 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3">
                          Add Your Review
                        </h4>
                        <AddReview courseId={course._id} />
                      </div>
                    )}

                    {reviews.length > 0 ? (
                      <div className="grid gap-4">
                        {reviews.map((review) => (
                          <div
                            key={review._id}
                            className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs sm:text-sm">
                                {review.user?.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-gray-900">
                                  {review.user?.name || "Student"}
                                </div>
                                <div className="flex text-yellow-400 text-[10px] sm:text-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? "fill-current"
                                          : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm text-center">
                        No reviews yet.
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- SIDEBAR RIGHT: Card Part 2 (Features & Sidebar) --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-8 space-y-6">
              {/* Features Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">
                  This course includes:
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-600"
                      >
                        <Icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`}
                        />
                        <span>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-3">
                    30-Day Money-Back Guarantee
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" /> Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Training for Business (Mobile: Optional) */}
              <div className="bg-gray-100 rounded-2xl p-5 sm:p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                  Training 5 or more people?
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  Get your team access to 8,000+ top courses anytime, anywhere.
                </p>
                <button className="w-full py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Try Learnify Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
