import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashBoardHeader from "../components/dashboard/DashBoardHeader";

const DashBoardLayout = ({ menu }) => {
  return (
    <>
      <DashBoardHeader />
      <div className="flex w-screen">
        <Sidebar menu={menu} />
        <Outlet />
      </div>
    </>
  );
};

export default DashBoardLayout;
