import React from "react";
import { CircleDollarSign, UserIcon, BookOpenIcon } from "lucide-react";
import DashBoardCard from "../../components/dashboard/DashBoardCard";
import { useGlobalAnalytics } from "../../hooks/queries/useGlobalAnalytics";
import Loader from "../Loader";

const AdminAnalytics = () => {
  const { data, isLoading } = useGlobalAnalytics();
  if (isLoading) return <Loader />;

  const links = [
    { label: "Total Users", icon: UserIcon, data: data?.totalUsers?.total || 0 },
    { label: "Total Courses", icon: BookOpenIcon, data: data?.totalCourses || 0 },
    { label: "Total Revenue", icon: CircleDollarSign, data: data?.totalRevenue || 0 },
  ];

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll">
      <h1 className="text-4xl font-semibold">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-3 pt-4 group">
        {links.map((link, idx) => (
          <DashBoardCard key={idx} label={link.label} icon={link.icon} data={link.data} />
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
