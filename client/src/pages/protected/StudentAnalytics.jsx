import React from "react";
import { ChartColumnIncreasing, UserIcon, Star } from "lucide-react";
import DashBoardCard from "../../components/dashboard/DashBoardCard";
import { useStudentAnalytics } from "../../hooks/queries/useStudentAnalytics";
import Loader from "../Loader";
import { useAuthStore } from "../../store/useAuthStore";

const StudentAnalytics = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useStudentAnalytics();
  if (isLoading) return <Loader />;

  const links = [
    {
      label: "Courses Enrolled",
      icon: UserIcon,
      data: data?.enrolledCount || 0,
    },
    {
      label: "Review Count",
      icon: Star,
      data: data?.reviewCount || 0,
    },
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-4xl font-semibold">Student Dashboard</h1>
      <p className="text-lg font-medium pt-2">Welcome back {user.name}</p>
      <div className="flex flex-wrap gap-3 pt-4 group">
        {links.map((link, idx) => (
          <DashBoardCard
            label={link.label}
            icon={link.icon}
            data={link.data}
            key={idx}
          />
        ))}
      </div>
      <section className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recently Enrolled Courses</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.recentEnrolledCourses &&
          data.recentEnrolledCourses.length > 0 ? (
            data.recentEnrolledCourses.map((c, i) => (
              <div
                key={c.courseId || i}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition p-3 flex flex-col"
              >
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold mb-1">{c.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Instructor: {c.instructor}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Enrolled: {new Date(c.enrolledDate).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No recent enrollments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentAnalytics;
