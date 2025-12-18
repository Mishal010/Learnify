import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
const Sidebar = ({ menu }) => {
  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 bg-white w-full border-r-1 border-gray-500/20 text-lg font-semibold">
      <div className="h-9 w-9 md:h-14 md:w-14 rounded-full mx-auto bg-white flex items-center justify-center border border-blue-500 text-xl font-semibold text-gray-500 max-md:text-sm">
        AM
      </div>
      <div className="w-full">
        {menu.map((link, idx) => (
          <NavLink
            to={link.path}
            key={idx}
            end
            className={({ isActive }) =>
              `relative flex items-center gap-2  w-full py-2.5 min-md:pl-10 first:mt-6 max-md:justify-center ${
                isActive
                  ? "bg-blue-400/60 text-blue-900 group"
                  : "text-gray-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.label}</p>
                <span
                  className={`w-1.5 ${
                    isActive && "bg-blue-500"
                  } absolute right-0 h-10 rounded-l`}
                ></span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
