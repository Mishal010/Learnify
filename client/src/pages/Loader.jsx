import React from "react";

const Loader = () => {
  return (
    <div className={`w-full flex justify-center items-center`}>
      <div className="w-20 h-20 border-t-4 border-blue-400 animate-spin rounded-full"></div>
    </div>
  );
};

export default Loader;
