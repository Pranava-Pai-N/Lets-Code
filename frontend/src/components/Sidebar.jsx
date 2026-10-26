import React, { useState, useEffect } from "react";
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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";

const SidebarContent = ({ isCollapsed = false, onHide, onNavigate, showCollapse = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      onNavigate?.();
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
    menuItems.push({ name: "My Submissions", path: "/submissions", icon: <QueueListIcon className="w-5 h-5" /> });
  }

  if (isAuthenticated && user?.role !== "user") {
    menuItems.push({ name: "Post a Question", path: "/post-question", icon: <PlusCircleIcon className="w-5 h-5" /> });
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-2 py-4`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md shadow-indigo-500/30">
            <CodeBracketIcon className="w-5 h-5 text-white flex-shrink-0" />
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              Let's <span className="text-indigo-600">Code</span>
            </h1>
          )}
        </div>
        {showCollapse && (
          <button
            type="button"
            onClick={onHide}
            className="hidden md:inline-flex p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 mt-2 space-y-1 px-2 overflow-y-auto custom-scrollbar relative z-10 pointer-events-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onNavigate}
              className={`
                relative flex items-center h-11 rounded-xl transition-all duration-200
                ${isCollapsed ? "justify-center px-2" : "px-3 gap-3"}
                ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-900/20 dark:text-indigo-400 border-l-4 border-indigo-600"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700/50"}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
              {isActive && !isCollapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-3">
        {isAuthenticated && user && (
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-700/40 dark:to-zinc-800/60 border border-zinc-100 dark:border-zinc-700 ${isCollapsed ? "flex-col" : "justify-between"}`}>
            <Link to="/profile" onClick={onNavigate} className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={user.profile_url}
                  alt="Profile"
                  className="w-9 h-9 rounded-lg border-2 border-white dark:border-zinc-800 shadow-sm object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-2 border-white dark:border-zinc-800 rounded-full bg-green-500" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{user.userName}</p>
                  <p className="text-xs text-zinc-400">Online</p>
                </div>
              )}
            </Link>
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                aria-label="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {showCollapse && isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center h-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-400 hover:text-red-600 transition"
            aria-label="Logout"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen = false, onClose, visible = true, onHide, onShow }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl transform transition-transform duration-300 pointer-events-auto z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-700">
            <span className="text-sm font-semibold text-zinc-500">Menu</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onClose?.(); }} className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[calc(100%-64px)] overflow-y-auto">
            <SidebarContent isCollapsed={false} onNavigate={onClose} showCollapse={false} />
          </div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      {visible && (
      <aside className="hidden md:block fixed top-0 left-0 p-4 h-screen w-72 z-30">
        <div className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-full flex flex-col rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 overflow-hidden">
          <SidebarContent
            isCollapsed={false}
            onHide={onHide}
            showCollapse={true}
          />
        </div>
      </aside>
      )}
    </>
  );
};

export default Sidebar;