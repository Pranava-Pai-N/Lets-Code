import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { CheckCircleIcon, TrophyIcon, RocketLaunchIcon, CodeBracketSquareIcon, ArrowRightIcon, ChartBarIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [leetcodeUsername, setleetcodeUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [_isSyncing, setIsSyncing] = useState(false);
  const [activityData, setActivityData] = useState({ activity: [], submissionCount: 0 });


  const fetchLeetcodeStats = useCallback(async (username) => {
    if (!username) return;
    setIsSyncing(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/leetcode-data`,
        { leetcodeUsername: username },
        { withCredentials: true }
      );


      if (response.data.success) {
        setleetcodeUsername(username);
        setLeetcodeStats(response.data.data);
      }

    } catch (error) {
      console.error("Error syncing LeetCode:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/recent-activity`, {
        withCredentials: true
      });
      if (response.data.success) {
        setActivityData({
          activity: response.data.activity,
          submissionCount: response.data.submissionCount
        });
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecentActivity();
    }

    if (user.leetcodeUsername) {
      setleetcodeUsername(user.leetcodeUsername);
      setTempUsername(user.leetcodeUsername);
      fetchLeetcodeStats(user.leetcodeUsername);
    }
  }, [user, fetchRecentActivity, fetchLeetcodeStats]);


  useEffect(() => {
    if (!loading && user && !user.profileCompleted) {
      navigate("/complete-profile", { replace: true });
    }
  }, [user, loading, navigate]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }


  if (!user)
    return null;




  const handleSave = async () => {
    if (!tempUsername.trim()) {
      toast.error("Please enter a valid username");
      return;
    }
    try {
      setIsSyncing(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/leetcode-data`,
        { leetcodeUsername: tempUsername },
        { withCredentials: true }
      );

      if (response.data.success) {
        setleetcodeUsername(tempUsername);
        setLeetcodeStats(response.data.data);
        setIsEditing(false);
        toast.success("LeetCode account synced!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to connect.");
    } finally {
      setIsSyncing(false);
    }
  };


  const userName = user?.userName || "Explorer";

  const dashboardStats = [
    {
      title: "Problems Solved",
      value: user.solvedQuestionCount || 0,
      icon: CheckCircleIcon,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      description: "Total problems successfully submitted."
    },
    {
      title: "Acceptance Rate",
      value: `${user.acceptance_rate || 0}%`,
      icon: RocketLaunchIcon,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      description: "Percentage of correct submissions."
    },
    {
      title: "Maximum Streak",
      value: user.maximumStreak || 0,
      icon: TrophyIcon,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      description: "Maximum Streak achieved by solving POTD"
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-950 min-h-screen">

      <header className="mb-8 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
          Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Review your performance and jump back into the challenges.
        </p>
      </header>

      <hr className="mb-10 border-gray-100 dark:border-gray-800" />


      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center space-x-2">
          <ChartBarIcon className="w-6 h-6 text-indigo-500" />
          <span>Performance Overview</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardStats.map((stat) => (
            <Card
              key={stat.title}
              className={`p-6 flex flex-col justify-center items-start ${stat.bg} shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-current`}
              style={{ borderColor: stat.color.includes('green') ? '#22c55e' : stat.color.includes('indigo') ? '#6366f1' : '#eab308' }}
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {stat.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        <Card className="p-8 bg-indigo-600/10 dark:bg-indigo-900/40 border-2 border-indigo-200 dark:border-indigo-700 shadow-xl flex flex-col justify-between h-full lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-2xl text-indigo-800 dark:text-indigo-200">Start Practice</h3>
            <CodeBracketSquareIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-md">
            Tackle new problems, filter by difficulty, and sharpen your algorithms knowledge. Your next challenge is waiting.
          </p>
          <Link to="/problems">
            <Button variant="primary" className="w-full py-3 text-lg">
              View All Problems →
            </Button>
          </Link>
        </Card>

        <Card className="p-4 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/60 dark:border-yellow-700/30 shadow-sm flex flex-col lg:col-span-2 min-h-[160px] justify-between transition-all hover:border-yellow-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {leetcodeStats?.avatar ? (
                  <img src={leetcodeStats.avatar} alt="Avatar" className="w-9 h-9 rounded-lg border border-yellow-500/50 object-cover" />
                ) : (
                  <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 text-yellow-600" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-none">LeetCode</h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  Rank: {leetcodeStats?.ranking ? leetcodeStats.ranking.toLocaleString() : '---'}
                </p>
              </div>
            </div>
          </div>

          {leetcodeStats ? (
            <div className="flex items-stretch gap-2 my-3">
              <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800/80 px-3 rounded-xl border border-yellow-200 dark:border-yellow-700/50 shadow-sm flex-1">
                <span className="text-xl font-black text-gray-900 dark:text-white leading-tight">{leetcodeStats.totalSolved}</span>
                <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Solved</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 flex-[2]">
                <div className="flex flex-col items-center justify-center py-1 rounded-lg bg-green-500/5 border border-green-500/20">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">{leetcodeStats.easySolved}</span>
                  <span className="text-[7px] uppercase font-bold text-green-700/60">Easy</span>
                </div>
                <div className="flex flex-col items-center justify-center py-1 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{leetcodeStats.mediumSolved}</span>
                  <span className="text-[7px] uppercase font-bold text-yellow-700/60">Medium</span>
                </div>
                <div className="flex flex-col items-center justify-center py-1 rounded-lg bg-red-500/5 border border-red-500/20">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">{leetcodeStats.hardSolved}</span>
                  <span className="text-[7px] uppercase font-bold text-red-700/60">Hard</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 p-2 bg-white/50 dark:bg-black/20 rounded-lg border border-dashed border-yellow-200 dark:border-yellow-900/40 text-center">
              <p className="text-[10px] text-gray-500 italic">Account not connected</p>
            </div>
          )}

          <div>
            {isEditing ? (
              <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                <input
                  autoFocus
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-[11px] rounded-lg border border-yellow-400 bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-yellow-500/20 transition-all"
                  placeholder="Username"
                />
                <button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-all active:scale-95">
                  Save
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full py-2 bg-yellow-600/10 hover:bg-yellow-600 dark:bg-yellow-600/20 text-yellow-700 dark:text-yellow-500 hover:text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-tighter border border-yellow-600/20 hover:border-yellow-600">
                {leetcodeUsername ? "Switch Account" : "Sync LeetCode"}
              </button>
            )}
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
              Activity
            </h3>
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {activityData.submissionCount || 0} Total
            </span>
          </div>

          <div className="overflow-hidden">
            {activityData.activity && activityData.activity.length > 0 ? (
              <ul className="space-y-2">
                {activityData.activity.slice(0, 4).map((item) => (
                  <li key={item._id} className="group flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Accepted' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[120px] md:max-w-none">{item.question_title}</span>
                          <span className="text-[9px] text-gray-400 font-mono">{item.languageId === 113 ? 'py' : 'code'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          <span>•</span>
                          <span>{(item.totalMemory / 1024).toFixed(1)}MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-[11px] font-black uppercase ${item.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>{item.status}</p>
                        <p className="text-[9px] font-mono text-gray-400">{item.totalRuntime}s</p>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                <p className="text-gray-400 text-sm italic">No recent activity.</p>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;