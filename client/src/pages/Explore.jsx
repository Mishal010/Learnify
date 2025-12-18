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

const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  "All",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
  "Programming",
  "UI/UX",
];

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* -------------------- HEADER -------------------- */}
      <div className="bg-white border-b shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Explore Courses
          </h1>
          <p className="text-slate-600 mb-6">Discover {totalCourses} courses</p>

          {/* Search + Mobile Filter Button */}
          <div className="flex gap-3">
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
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Mobile Filters Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden px-4 py-3 border rounded-lg font-medium bg-white hover:bg-slate-50"
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* -------------------- BODY -------------------- */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-8">
        {/* -------------------- SIDEBAR (DESKTOP) -------------------- */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border rounded-lg p-6 sticky top-6">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === cat
                      ? "bg-indigo-50 text-indigo-600"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* -------------------- COURSES -------------------- */}
        <main className="flex-1 overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex justify-center py-24">
              <Loader className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border p-6 rounded-lg">
              <AlertCircle className="text-red-500 mb-2" />
              {error?.message || "Failed to load courses"}
            </div>
          )}

          {!isLoading && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {courses.map((course) => (
                <div key={course._id}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && courses.length === 0 && (
            <div className="text-center py-24 text-slate-600">
              No courses found
            </div>
          )}

          {/* -------------------- PAGINATION -------------------- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 my-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 border rounded disabled:opacity-40"
              >
                <ChevronLeft />
              </button>

              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 border rounded disabled:opacity-40"
              >
                <ChevronRight />
              </button>
            </div>
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
          className="absolute inset-0 bg-black/40"
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
          className="relative bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter by Category</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  handleCategoryChange(cat);
                  setIsFilterOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  selectedCategory === cat
                    ? "bg-indigo-50 text-indigo-600"
                    : "hover:bg-slate-100"
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
