import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CodeBracketIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { name: "Home", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "View Problems", path: "/problems", icon: <CodeBracketIcon className="w-5 h-5" /> },
  ];

  if (!isAuthenticated && !loading) {
    menuItems.push({ name: "Login", path: "/login", icon: <UserIcon className="w-5 h-5" /> });
  }

  if (isAuthenticated && user?.role === "user") {
    menuItems.push({ name: "My Submissions", path: "/submissions", icon: <QueueListIcon className="w-5 h-5" /> })
  }

  if (isAuthenticated && user?.role !== "user") {
    menuItems.push({ name: "Post a Question", path: "/post-question", icon: <PlusCircleIcon className="w-5 h-5" /> })
  }



  return (
    <div className={`p-4 h-screen flex-shrink-0 transition-all duration-300 relative z-50 ${isCollapsed ? "w-24" : "w-80"}`}>
      <div className="bg-white dark:bg-gray-800 h-full flex flex-col rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">

        <div className="flex items-center p-6 border-b border-gray-50 dark:border-gray-700/50 h-24">
          <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? "justify-center w-full" : ""}`}>
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <CodeBracketIcon className="w-6 h-6 text-white flex-shrink-0" />
            </div>
            {!isCollapsed && <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">LET'S <span className="text-indigo-600">CODE</span></h1>}
          </div>
        </div>

        <nav className="flex-1 mt-6 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                    relative flex items-center h-12 rounded-2xl transition-all duration-300 cursor-pointer z-50
                    ${isCollapsed ? "justify-center" : "px-4 space-x-4"}
                    ${isActive
                    ? "bg-indigo-50 text-indigo-600 font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700/50"}
                 `}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="text-sm tracking-tight">{item.name}</span>}
                {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50 dark:border-gray-700/50 space-y-4">
          {isAuthenticated && user && (
            <div className={`flex items-center transition-all duration-200 p-2 rounded-2xl bg-gray-50 dark:bg-gray-700/30 ${isCollapsed ? "flex-col space-y-4" : "justify-between"}`}>
              <div className={`flex items-center ${isCollapsed ? "flex-col" : "space-x-3"}`}>
                <Link to="/profile" className="relative shrink-0 cursor-pointer z-50">
                  <img
                    src={`${user.profile_url}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full bg-green-500"></span>
                </Link>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider">{user.userName}</p>
                    <p className="text-[10px] text-gray-400">Online</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer z-50"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition-all cursor-pointer z-50 shadow-sm"
          >
            {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;