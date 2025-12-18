import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseByIdApi } from "../api/courseApi";
import { getCourseLectureApi } from "../api/lectureApi";
import { verifyEnrollmentApi } from "../api/courseApi";
import VideoJS from "./protected/VideoJS";
import "./CoursePlayer.css";
import { ChevronDown, ChevronUp, Play, Clock, Edit3 } from "lucide-react";
import UpdateLectureModal from "../components/dashboard/UpdateLectureModal";
import { useAuthStore } from "../store/useAuthStore";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const { user } = useAuthStore();

  // Fetch course details
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseByIdApi({ courseId }),
  });

  // Fetch all lectures for this course
  const { data: lecturesData, isLoading: lecturesLoading } = useQuery({
    queryKey: ["lectures", courseId],
    queryFn: () => getCourseLectureApi({ courseId }),
    enabled: !!courseId,
  });
  console.log(lecturesData);
  console.log(courseData);

  // Verify enrollment
  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment-verify", courseId],
    queryFn: () => verifyEnrollmentApi({ courseId }),
    enabled: !!courseId,
  });

  // Check if user is enrolled
  useEffect(() => {
    if (enrollmentData && !enrollmentData.isEnrolled) {
      navigate("/explore", { replace: true });
    }
  }, [enrollmentData, navigate]);

  // Set first lecture as default
  useEffect(() => {
    if (lecturesData?.lectures && lecturesData.lectures.length > 0) {
      const sortedLectures = [...lecturesData.lectures].sort(
        (a, b) => a.order - b.order
      );
      setSelectedLecture(sortedLectures[0]);
      setExpandedSections({ 0: true });
    }
  }, [lecturesData]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (courseLoading || lecturesLoading || enrollmentLoading) {
    return (
      <div className="course-player-loading">
        <div className="loading-spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  const course = courseData?.course;
  const lectures = lecturesData?.lectures || [];
  const sortedLectures = [...lectures].sort((a, b) => a.order - b.order);

  return (
    <div className="course-player-container">
      {/* Header */}
      <div className="course-player-header">
        <div className="header-content">
          <button
            className="back-button"
            onClick={() => navigate("/explore")}
            aria-label="Go back"
          >
            ← Back to Courses
          </button>
          <h1>{course?.title}</h1>
        </div>
      </div>

      <div className="course-player-main">
        {/* Left Section - Video Player */}
        <div className="player-section">
          <div className="video-wrapper">
            {selectedLecture ? (
              <VideoJS
                key={selectedLecture._id}
                videoUrl={selectedLecture.url}
                lectureTitle={selectedLecture.title}
                courseData={courseData}
                instructor={courseData?.instructor}
              />
            ) : (
              <div className="no-lecture">
                <p>No lecture selected</p>
              </div>
            )}
          </div>

          {/* Lecture Details */}
          <div className="lecture-details">
            <div className="lecture-header">
              <h2>{selectedLecture?.title}</h2>
              <div className="lecture-meta">
                <span className="lecture-badge">
                  Lecture {selectedLecture?.order || 1} of{" "}
                  {sortedLectures.length}
                </span>
              </div>
            </div>

            <div className="lecture-description">
              <p>
                This is lecture {selectedLecture?.order || 1} of the course.
                Watch the video and complete all modules to progress.
              </p>
            </div>

            <div className="lecture-actions">
              <button className="action-button primary">
                ✓ Mark as Complete
              </button>
              <button className="action-button secondary">
                💬 Ask Question
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Lectures List */}
        <div className="lectures-sidebar">
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <span className="lecture-count">
              {sortedLectures.length} Lectures
            </span>
          </div>

          <div className="lectures-list">
            {sortedLectures.length > 0 ? (
              sortedLectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className={`lecture-item ${
                    selectedLecture?._id === lecture._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedLecture(lecture)}
                >
                  <div className="lecture-item-content">
                    <div className="lecture-item-icon">
                      {selectedLecture?._id === lecture._id ? (
                        <Play size={16} fill="currentColor" />
                      ) : (
                        <Play size={16} />
                      )}
                    </div>
                    <div className="lecture-item-info">
                      <p className="lecture-item-title">
                        {lecture.order}. {lecture.title}
                      </p>
                      <div className="lecture-item-meta">
                        <span>
                          <Clock size={12} /> Duration: N/A
                        </span>
                      </div>
                    </div>
                    {/* Edit button for each lecture (owner/admin only) */}
                    {(user?.role === "admin" ||
                      String(course?.instructor?._id) ===
                        String(user?._id)) && (
                      <div className="ml-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingLecture(lecture);
                            setEditOpen(true);
                          }}
                          className="px-2 py-1 bg-green-500 rounded-md text-sm hover:bg-green-400"
                          aria-label={`Edit lecture ${lecture.title}`}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-lectures">
                <p>No lectures available yet</p>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="course-info-section">
            <h4>About This Course</h4>
            <p className="course-info-text">{course?.description}</p>
            <div className="course-stats">
              <div className="stat">
                <span className="stat-label">Instructor</span>
                <span className="stat-value">
                  {course?.instructor?.name || "N/A"}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Category</span>
                <span className="stat-value">{course?.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
