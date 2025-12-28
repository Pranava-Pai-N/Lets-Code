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
    { name: "Problems", path: "/problems", icon: <CodeBracketIcon className="w-5 h-5" /> },
  ];

  if (!isAuthenticated && !loading) {
    menuItems.push({ name: "Login", path: "/login", icon: <UserIcon className="w-5 h-5" /> });
  }

  if(isAuthenticated && user?.role === "user"){
    menuItems.push({ name: "My Submissions", path: "/submissions", icon: <QueueListIcon className="w-5 h-5" /> })
  }

  if(isAuthenticated && user?.role !== "user"){
    menuItems.push({ name: "Post a Question", path: "/post-question", icon: <PlusCircleIcon className="w-5 h-5" /> })
  }

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    let classes = `flex items-center space-x-3 p-3 mx-2 rounded-lg transition-all duration-200 text-sm font-medium `;
    if (isActive) {
      classes += "bg-indigo-600/10 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm";
    } else {
      classes += "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50";
    }
    classes += isCollapsed ? " justify-center" : " justify-start";
    return classes;
  };

  return (
    <div className={`p-4 h-screen flex-shrink-0 transition-all duration-300 ${isCollapsed ? "w-24" : "w-80"}`}>
      <div className="bg-white dark:bg-gray-800 h-full flex flex-col rounded-2xl shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
        
        <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700/50 h-20">
          <div className={`flex items-center space-x-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "justify-center w-full" : ""}`}>
            <CodeBracketIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            {!isCollapsed && <h1 className="text-2xl font-black text-gray-900 dark:text-white truncate">Let's Code</h1>}
          </div>
        </div>

        <nav className="flex-1 mt-6 space-y-3">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className={getLinkClasses(item.path)} title={isCollapsed ? item.name : undefined}>
              <div className="flex-shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="text-base">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 space-y-2">
          {isAuthenticated && user && (
            <div className={`flex items-center transition-all duration-200 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 ${isCollapsed ? "flex-col space-y-4" : "justify-between"}`}>
              <div className={`flex items-center ${isCollapsed ? "flex-col" : "space-x-3"}`}>
                <Link to="/profile" className="relative flex-shrink-0">
                  <img
                    src={`${user.profile_url}`}
                    alt="Profile Image"
                    className="w-11 h-11 rounded-full border-2 border-indigo-500"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full bg-green-500"></span>
                </Link>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Online</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogout} 
                className={`flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group`}
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                {!isCollapsed && <span className="ml-2 text-sm font-medium">Logout</span>}
              </button>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 focus:outline-none ${isCollapsed ? "justify-center" : "justify-between"}`}
          >
            {!isCollapsed && <span className="text-sm font-medium">Collapse Menu</span>}
            {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;