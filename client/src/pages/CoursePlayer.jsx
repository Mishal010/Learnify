import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Play,
  Clock,
  CheckCircle,
  MessageCircle,
  Menu,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";

// API & Components
import { getCourseByIdApi } from "../api/courseApi";
import { getCourseLectureApi } from "../api/lectureApi";
import { verifyEnrollmentApi } from "../api/courseApi";
import VideoJS from "./protected/VideoJS";
import UpdateLectureModal from "../components/dashboard/UpdateLectureModal";
import { useAuthStore } from "../store/useAuthStore";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const { user } = useAuthStore();

  // --- 1. Data Fetching ---
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseByIdApi({ courseId }),
  });

  const { data: lecturesData, isLoading: lecturesLoading } = useQuery({
    queryKey: ["lectures", courseId],
    queryFn: () => getCourseLectureApi({ courseId }),
    enabled: !!courseId,
  });

  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment-verify", courseId],
    queryFn: () => verifyEnrollmentApi({ courseId }),
    enabled: !!courseId,
  });

  // --- 2. Effects ---
  useEffect(() => {
    if (enrollmentData && !enrollmentData.isEnrolled) {
      navigate("/explore", { replace: true });
    }
  }, [enrollmentData, navigate]);

  useEffect(() => {
    if (lecturesData?.lectures && lecturesData.lectures.length > 0) {
      const sortedLectures = [...lecturesData.lectures].sort(
        (a, b) => a.order - b.order
      );
      if (!selectedLecture) setSelectedLecture(sortedLectures[0]);
    }
  }, [lecturesData]);

  // --- 3. Loading State ---
  if (courseLoading || lecturesLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  const course = courseData?.course;
  const lectures = lecturesData?.lectures || [];
  const sortedLectures = [...lectures].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
      {/* --- Header --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/explore")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

            <div className="flex flex-col">
              <h1 className="text-sm md:text-base font-bold text-slate-900 line-clamp-1">
                {course?.title}
              </h1>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                  {course?.category}
                </span>
                <span>•</span>
                <span>{course?.instructor?.name}</span>
              </div>
            </div>
          </div>

          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* --- Main Layout --- */}
      <div className="flex-1 flex max-w-[1920px] mx-auto w-full">
        {/* LEFT: Video & Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Video Player */}
            <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-xl aspect-video border border-gray-900/5 group">
              {selectedLecture ? (
                <VideoJS
                  key={selectedLecture._id}
                  videoUrl={selectedLecture.url}
                  lectureTitle={selectedLecture.title}
                  courseData={courseData}
                  instructor={courseData?.instructor}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <AlertCircle size={48} className="mb-4 opacity-50" />
                  <p>Select a lecture to start watching</p>
                </div>
              )}
            </div>

            {/* Lecture Meta & Actions */}
            <div className="mt-6 lg:mt-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-gray-200 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Lecture {selectedLecture?.order || 1}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock size={14} /> 15 mins
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedLecture?.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm">
                    <CheckCircle size={18} />
                    <span>Mark Complete</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-medium rounded-xl transition-colors text-sm shadow-sm">
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline">Discussion</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" /> Description
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <p>
                    {selectedLecture?.description ||
                      "No description available for this lecture. Please focus on the video content."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: Sidebar Playlist */}
        {/* Mobile Overlay Background */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Panel */}
        <aside
          className={`
          fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-96 lg:block
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-bold text-slate-900">Course Content</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {sortedLectures.findIndex(
                    (l) => l._id === selectedLecture?._id
                  ) + 1}{" "}
                  / {sortedLectures.length} Completed
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full"
                    style={{
                      width: `${
                        ((sortedLectures.findIndex(
                          (l) => l._id === selectedLecture?._id
                        ) +
                          1) /
                          sortedLectures.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-200 rounded-full text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {sortedLectures.map((lecture, index) => {
                const isActive = selectedLecture?._id === lecture._id;

                return (
                  <div
                    key={lecture._id}
                    onClick={() => {
                      setSelectedLecture(lecture);
                      setSidebarOpen(false); // Close on mobile selection
                    }}
                    className={`
                      group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-transparent shadow-md transform scale-[1.02]"
                          : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mt-0.5
                      ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                      }
                    `}
                    >
                      <Play
                        size={14}
                        fill={isActive ? "currentColor" : "none"}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-semibold leading-snug mb-1 ${
                          isActive ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {index + 1}. {lecture.title}
                      </h4>
                      <div
                        className={`flex items-center gap-2 text-[10px] ${
                          isActive ? "text-indigo-100" : "text-slate-400"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <FileText size={10} /> Video
                        </span>
                        <span>•</span>
                        <span>10:00</span>
                      </div>
                    </div>

                    {/* Admin Edit */}
                    {(user?.role === "admin" ||
                      String(course?.instructor?._id) ===
                        String(user?._id)) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLecture(lecture);
                          setEditOpen(true);
                        }}
                        className={`p-1.5 rounded-md transition-all ${
                          isActive
                            ? "text-white/70 hover:bg-white/20 hover:text-white"
                            : "text-slate-400 hover:bg-gray-100 hover:text-slate-600"
                        }`}
                      >
                        <FileText size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Edit Modal */}
      <UpdateLectureModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        lecture={editingLecture}
        courseId={courseId}
      />
    </div>
  );
};

export default CoursePlayer;
