import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { useCourses } from "../hooks/queries/useCourses";
import CourseCard from "../components/CourseCard";
import Loader from "./Loader";

const Home = () => {
  const navigate = useNavigate();

  // Fetch featured courses (first 6)
  const { data, isLoading } = useCourses({
    page: 1,
    limit: 6,
    category: "",
    search: "",
  });

  const featuredCourses = data?.result || [];

  const stats = [
    { icon: BookOpen, label: "Courses", value: "500+" },
    { icon: Users, label: "Students", value: "10,000+" },
    { icon: Award, label: "Certificates", value: "8,000+" },
    { icon: TrendingUp, label: "Success Rate", value: "95%" },
  ];

  const features = [
    {
      icon: Play,
      title: "Learn at Your Own Pace",
      description:
        "Access courses anytime, anywhere. Learn on your schedule with lifetime access to course materials.",
    },
    {
      icon: Award,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with real-world experience and proven track records.",
    },
    {
      icon: CheckCircle,
      title: "Certificates",
      description:
        "Earn recognized certificates upon course completion to showcase your achievements.",
    },
    {
      icon: Zap,
      title: "Interactive Learning",
      description:
        "Engage with video lectures, quizzes, and hands-on projects to reinforce your learning.",
    },
    {
      icon: Target,
      title: "Career-Focused",
      description:
        "Courses designed to help you achieve your career goals and land your dream job.",
    },
    {
      icon: Clock,
      title: "Regular Updates",
      description:
        "Stay current with regularly updated content reflecting the latest industry trends.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse Courses",
      description: "Explore our extensive library of courses across various categories.",
    },
    {
      step: "2",
      title: "Choose & Enroll",
      description: "Select courses that match your goals and enroll instantly.",
    },
    {
      step: "3",
      title: "Learn & Practice",
      description: "Watch video lectures, complete assignments, and practice your skills.",
    },
    {
      step: "4",
      title: "Get Certified",
      description: "Complete the course and earn a certificate to boost your career.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Transform Your Future with
                <span className="block text-yellow-300">Learnify</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                Master new skills, advance your career, and achieve your dreams with
                expert-led online courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/explore")}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                  Explore Courses
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>

            {/* Right Content - Decorative */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex items-center justify-center"
            >
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform -rotate-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center">
                    <BookOpen className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-2xl font-bold">500+ Courses</p>
                    <p className="text-indigo-100">Learn Anything</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked courses to help you start your learning journey
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredCourses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105"
            >
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Learnify?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to succeed in your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-xl mb-4">
                    <Icon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start learning in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-indigo-300 to-purple-300 z-0" />
                )}

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full text-white text-4xl font-bold mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Join thousands of students already learning on Learnify. Start your
              journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                Sign Up Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all"
              >
                Browse Courses
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;