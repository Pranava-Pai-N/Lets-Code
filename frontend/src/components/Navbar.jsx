import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { CodeBracketIcon, XMarkIcon, ArrowRightOnRectangleIcon, BellIcon, UserIcon, FireIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx"
import { useTheme } from "../context/themecontext.jsx"
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [Top_k, _setTop_k] = useState(5);


  const notifyRef = useRef(null);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();


  const links = [];

  if (!isAuthenticated) {
    links.push(
      { name: "Login", path: "/login" },
      { name: "Signup", path: "/register" },
    )
  }

  if (isAuthenticated) {
    links.push(
      { name: "Problems", path: "/problems" },
      { name: "Dashboard", path: "/dashboard" },)
  }

  const activeClass = "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold";
  const inactiveClass = "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition";

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
      transports: ['websocket']
    });

    socket.on("potd-notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(data.message);
      setIsNotifyOpen(true);
    })

    const fetchNotifications = async () => {
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/${Top_k}`,  {
        withCredentials: true
      })

      const allNotifications = result.data.allNotifications || [];

      setNotifications(allNotifications);
    }

    if (isAuthenticated) {
      fetchNotifications();
    }

    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAuthenticated, Top_k])


  const handleToggleNotify = () => {
    setIsNotifyOpen(!isNotifyOpen);
  };


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
                <>
                  <Button
                    variant="tertiary"
                    className="px-3 py-1 text-sm flex items-center gap-2"
                    onClick={toggleTheme}
                  >
                    {theme === "light" ? (
                      <>
                        <MoonIcon className="w-5 h-5 text-gray-600" />
                      </>
                    ) : (
                      <>
                        <SunIcon className="w-5 h-5 text-yellow-400" />
                      </>
                    )}
                  </Button>
                  <div className="relative" ref={notifyRef}>
                    <button
                      onClick={handleToggleNotify}
                      className="relative p-2 rounded-full text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <BellIcon className="w-6 h-6" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotifyOpen && (
                      <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 z-[60] overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                          <span className="text-xs text-indigo-500 font-medium">Total : {notifications.length}</span>
                          <button onClick={() => {
                            unreadCount != 0 ? setUnreadCount(0) : null;
                            unreadCount != 0 ? setIsNotifyOpen(false) : setIsNotifyOpen(true)
                          }} className="text-xs text-indigo-500 font-medium">Mark as Read</button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No new messages</div>
                          ) : (
                            notifications.map((n, i) => (
                              <Link
                                key={i}
                                to={n.link}
                                onClick={() => setIsNotifyOpen(false)}
                                className="block p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                              >
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {new Date(n.added_on).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    )
                    }
                  </div>

                  <div className={`flex items-center px-2 py-1 rounded-full transition-all duration-300 shadow-sm border 
    ${user?.currentStreak > 0
                      ? 'bg-orange-100/50 dark:bg-orange-900/40 border-orange-200 dark:border-orange-700'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>

                    <FireIcon
                      key={`${user?.currentStreak}`}
                      className={`w-5 h-5 transition-all duration-500 ${user?.currentStreak > 0
                        ? 'text-orange-500 animate-pulse drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]'
                        : 'text-gray-400'
                        }`}
                    />

                    <span
                      key={`${user?.currentStreak}`}
                      className={`ml-1 text-sm font-bold transition-colors duration-300 ${user?.currentStreak > 0
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-500'
                        }`}>
                      {user?.currentStreak || 0}
                    </span>
                  </div>
                  <Link to="/profile" className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <img
                      key={`${user.profile_url}`}
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
              </>
            ) : (
              <>
                <Button
                  variant="tertiary"
                  className="px-3 py-1 text-sm flex items-center gap-2"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <>
                      <MoonIcon className="w-5 h-5 text-gray-600" />
                    </>
                  ) : (
                    <>
                      <SunIcon className="w-5 h-5 text-yellow-400" />
                    </>
                  )}
                </Button>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md">
                  Log In
                </Link>
              </>
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