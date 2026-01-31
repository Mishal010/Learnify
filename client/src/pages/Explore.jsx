import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { motion } from "motion/react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
} from "lucide-react";

import { useCourses } from "../hooks/queries/useCourses";
import { useDebounce } from "../hooks/useDebounce";
import { EXPLORE_CATEGORIES } from "../constants/categories";

const ITEMS_PER_PAGE = 12;

const Explore = () => {
  /* -------------------- URL STATE -------------------- */
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "All";

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  /* -------------------- MOBILE FILTER MODAL -------------------- */
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* -------------------- Sync state → URL -------------------- */
  useEffect(() => {
    const params = {};

    if (currentPage > 1) params.page = currentPage;
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== "All") params.category = selectedCategory;

    setSearchParams(params);
  }, [currentPage, searchTerm, selectedCategory, setSearchParams]);

  /* -------------------- Debounced Search -------------------- */
  const debouncedSearch = useDebounce(searchTerm, 500);

  /* -------------------- Fetch Courses -------------------- */
  const { data, isLoading, isError, error } = useCourses({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    category: selectedCategory === "All" ? "" : selectedCategory,
    search: debouncedSearch,
  });

  /* -------------------- API Mapping -------------------- */
  const courses = data?.result || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCourses = data?.pagination?.total || 0;

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* -------------------- HEADER / HERO -------------------- */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden py-16">
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

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explore Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-indigo-100 mb-6"
          >
            Discover {totalCourses} amazing courses to boost your skills
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3 max-w-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-white focus:bg-white/20 outline-none text-white placeholder-white/70"
              />
            </div>

            {/* Mobile Filters Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              Filters
            </button>
          </motion.div>
        </div>
      </section>

      {/* -------------------- BODY -------------------- */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-12 gap-8">
        {/* -------------------- SIDEBAR (DESKTOP) -------------------- */}
        <aside className="hidden lg:block w-64 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-6 shadow-lg"
          >
            <h3 className="font-bold text-lg mb-4 text-gray-900">Categories</h3>
            <div className="space-y-2">
              {EXPLORE_CATEGORIES.map((cat, index) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "hover:bg-slate-100 text-gray-700"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* -------------------- COURSES -------------------- */}
        <main className="flex-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-600">Loading courses...</p>
            </div>
          )}

          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Error Loading Courses
                </h3>
                <p className="text-red-700">
                  {error?.message || "Failed to load courses"}
                </p>
              </div>
            </motion.div>
          )}

          {!isLoading && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && courses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}

          {/* -------------------- PAGINATION -------------------- */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-4 my-12"
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-3 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all shadow-sm disabled:hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-semibold text-gray-900 px-4">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-3 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all shadow-sm disabled:hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </main>
      </div>

      {/* -------------------- MOBILE FILTER MODAL -------------------- */}
      {/* Mobile filter sheet: keep mounted and animate open/close for smooth exit */}
      <motion.div
        className="fixed inset-0 z-50 flex items-end lg:hidden"
        aria-hidden={!isFilterOpen}
        initial={false}
        animate={{ pointerEvents: isFilterOpen ? "auto" : "none" }}
      >
        {/* overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFilterOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsFilterOpen(false)}
        />

        {/* sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: isFilterOpen ? 0 : "100%" }}
          transition={{ duration: 0.28 }}
          className="relative bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Filter by Category
            </h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-500 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {EXPLORE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  handleCategoryChange(cat);
                  setIsFilterOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "hover:bg-slate-100 text-gray-700 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Explore;
