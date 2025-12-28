import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CodeBracketIcon, XMarkIcon, ArrowRightOnRectangleIcon, BellIcon, UserIcon, FireIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();


  const links = [
    { name: "Problems", path: "/problems" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const activeClass = "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold";
  const inactiveClass = "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition";

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <Link to="/" className="text-xl font-extrabold text-gray-900 dark:text-white hover:text-indigo-500 transition">
              Let's Code
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`py-1.5 transition duration-150 ${location.pathname === link.path ? activeClass : inactiveClass}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="p-2 rounded-full text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <BellIcon className="w-6 h-6" />
                </button>

                <div className={`flex items-center px-2 py-1 rounded-full transition-all duration-300 shadow-sm border 
    ${user?.currentStreak > 0
                    ? 'bg-orange-100/50 dark:bg-orange-900/40 border-orange-200 dark:border-orange-700'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>

                  <FireIcon
                    className={`w-5 h-5 transition-all duration-500 ${user?.currentStreak > 0
                      ? 'text-orange-500 animate-pulse drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]'
                      : 'text-gray-400'
                      }`}
                  />

                  <span className={`ml-1 text-sm font-bold transition-colors duration-300 ${user?.currentStreak > 0
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-500 dark:text-gray-500'
                    }`}>
                    {user?.currentStreak || 0}
                  </span>
                </div>
                <Link to="/profile" className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <img
                    src={`${user.profile_url}`}
                    alt="Profile Image"
                    className="w-8 h-8 rounded-full border border-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 hidden lg:inline">{user?.userName || "Guest"}</span>
                </Link>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md">
                Log In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition"
            >
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <BellIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pb-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                <span>{user?.userName} (Profile)</span>
              </Link>
              <button
                className="flex items-center space-x-2 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                onClick={() => { setIsOpen(false); logout(); }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 mx-auto mt-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;