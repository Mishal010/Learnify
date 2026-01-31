import React, { useState } from "react";
import { useCart } from "../hooks/queries/useCart";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import ProfileAvatar from "./ProfileAvatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { data: cartData } = useCart({ enabled: isAuthenticated });
  const rawCartItems = cartData?.cart?.items || [];
  const cartCount = rawCartItems.filter((i) => i && i.course && i.course._id)
    .length;
  return (
    <nav className="sticky top-0 left-0 w-full z-50 gap-2 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white transition-all shadow-sm">
      <NavLink to="/" className="text-3xl font-semibold">
        Learnify
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/explore">Explore</NavLink>
        <NavLink to="/about-us">About</NavLink>
        <NavLink to="/contact-us">Contact</NavLink>

        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Cart indicator: show pulse when items present */}
          <span
            className="absolute -top-2 -right-3 flex items-center justify-center"
            aria-hidden={cartCount === 0}
            aria-label={cartCount > 0 ? `Cart has ${cartCount} items` : "Cart"}
            title={cartCount > 0 ? `Cart has ${cartCount} items` : "Cart"}
          >
            {cartCount > 0 ? (
              <span className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-600" />
              </span>
            ) : null}
          </span>
        </div>
        {isAuthenticated ? (
          <div className="relative flex items-center justify-center ml-2">
            <ProfileAvatar
              name={user.name}
              size={30}
              bg="bg-blue-500"
              onClick={() => {
                if (!user) return navigate("/login");
                if (user.role === "admin") return navigate("/admin");
                if (user.role === "teacher") return navigate("/instructor");
                if (user.role === "student") return navigate("/student");
                return navigate("/");
              }}
            />
            <span className="absolute h-[20px] w-[20px] rounded-full z-5 bg-green-500 animate-ping" />
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>

      <button
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        aria-label="Menu"
        className="sm:hidden"
      >
        {/* Menu Icon SVG */}
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <NavLink to="/" className="block">
          Home
        </NavLink>
        <NavLink to="/explore" className="block">
          Explore
        </NavLink>
        <NavLink to="/about-us" className="block">
          About
        </NavLink>
        <NavLink to="/contact-us" className="block">
          Contact
        </NavLink>
        <button
          onClick={() => {
            navigate("/login");
            setOpen(false);
          }}
          className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
