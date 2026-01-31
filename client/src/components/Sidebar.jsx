import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogout } from "../hooks/mutation/useLogout";
import { useAuthStore } from "../store/useAuthStore";
const Sidebar = ({ menu }) => {
  const logout = useLogout();
  const { user } = useAuthStore();

  const initials = (() => {
    const name = user?.name || "";
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  })();
  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 bg-white w-full border-r-1 border-gray-500/20 text-lg font-semibold">
      <div className="h-9 w-9 md:h-14 md:w-14 rounded-full mx-auto bg-white flex items-center justify-center border border-blue-500 text-xl font-semibold text-gray-500 max-md:text-sm">
        {initials}
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
      <div className="w-full px-3 mt-auto mb-6">
        <motion.button
          onClick={() => logout.mutate()}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
            logout.isLoading
              ? "bg-blue-100 text-blue-600 cursor-wait"
              : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span className="max-md:hidden">{logout.isLoading ? "Logging out..." : "Logout"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
