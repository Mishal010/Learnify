import React from "react";
import { useNavigate } from "react-router-dom";

const DashBoardHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white border-b-1 border-gray-500/20 h-[64px] flex items-center ">
      <div
        className="ml-10 text-3xl font-semibold"
        onClick={() => navigate("/")}
      >
        Learnify
      </div>
    </div>
  );
};

export default DashBoardHeader;
