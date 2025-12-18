import React from "react";

const DashBoardCard = ({ label, icon: Icon, data }) => {
  return (
    <div className="flex flex-col min-w-50 rounded-md bg-white/20 border-2 border-blue-300/50 h-50 backdrop-blur-md max-sm:w-100 hover:-translate-y-1 duration-300 hover:cursor-pointer p-3">
      <h2 className="text-[21px] text-center font-semibold">{label}</h2>
      <div className="h-full w-full flex pt-2 items-center justify-center flex-col">
        <div className="p-3 bg-gray-200 rounded-full">
          <Icon className="w-12 h-12 " />
        </div>

        <span className="text-2xl mt-3 font-medium">{data}</span>
      </div>
    </div>
  );
};

export default DashBoardCard;
