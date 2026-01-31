import { BookOpenIcon, CircleDollarSign, Stars, UserIcon } from "lucide-react";
import React, { useState } from "react";
import DashBoardCard from "../../components/dashboard/DashBoardCard";
import { useInstructorAnalytics } from "../../hooks/queries/useInstructorAnalytics";
import Loader from "../Loader";
import { useAuthStore } from "../../store/useAuthStore";

const Analytics = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useInstructorAnalytics();
  if (isLoading) return <Loader />;
  const links = [
    {
      label: "Total Enrollments",
      icon: UserIcon,
      data: data.totalEnrolled,
    },
    {
      label: "Total Courses",
      icon: BookOpenIcon,
      data: data.courseCount,
    },
    {
      label: "Total Revenue",
      icon: CircleDollarSign,
      data: data.revenue,
    },
    {
      label: "Average Rating",
      icon: Stars,
      data: data.avgRating,
    },
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-4xl font-semibold">Instructor Dashborad</h1>
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
    </div>
  );
};

export default Analytics;
