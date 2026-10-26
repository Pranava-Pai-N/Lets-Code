import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  TrophyIcon,
  RocketLaunchIcon,
  CodeBracketSquareIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
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
        withCredentials: true,
      });
      if (response.data.success) {
        setActivityData({
          activity: response.data.activity,
          submissionCount: response.data.submissionCount,
        });
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  }, []);

  useEffect(() => {
    if (user) fetchRecentActivity();
    if (user?.leetcodeUsername) {
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }
  if (!user) return null;

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
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      description: "Total problems successfully submitted.",
    },
    {
      title: "Acceptance Rate",
      value: `${user.acceptance_rate || 0}%`,
      icon: RocketLaunchIcon,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      description: "Percentage of total correct submissions.",
    },
    {
      title: "Maximum Streak",
      value: user.maximumStreak || 0,
      icon: TrophyIcon,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      description: "Maximum streak achieved by solving POTD.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Review your performance and jump back into the challenges.
          </p>
        </header>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Performance Overview</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardStats.map((stat) => (
              <Card
                key={stat.title}
                className={`rounded-2xl border ${stat.border} ${stat.bg} p-6 shadow-sm transition hover:shadow-md`}
              >
                <stat.icon className={`mb-4 h-8 w-8 ${stat.color}`} />
                <div className="text-4xl font-black text-zinc-900 dark:text-white">{stat.value}</div>
                <h3 className="mt-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">{stat.title}</h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stat.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <Card className="rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200">Start Practice</h3>
              <CodeBracketSquareIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
              Tackle new problems, filter by difficulty, and sharpen your algorithms knowledge. Your next challenge is waiting.
            </p>
            <Link to="/problems" className="mt-6 block">
              <Button className="w-full rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white transition hover:bg-indigo-500">
                View All Problems →
              </Button>
            </Link>
          </Card>

          <Card className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-950/20 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {leetcodeStats?.avatar ? (
                  <img src={leetcodeStats.avatar} alt="Avatar" className="h-9 w-9 rounded-lg border border-amber-400/60 object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">LeetCode</h3>
                  <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
                    Rank: {leetcodeStats?.ranking ? leetcodeStats.ranking.toLocaleString() : "---"}
                  </p>
                </div>
              </div>
            </div>

            {leetcodeStats ? (
              <div className="mt-4 flex items-stretch gap-2">
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-amber-200 dark:border-amber-800/40 bg-white dark:bg-zinc-800/60 px-3 py-2">
                  <span className="text-xl font-black text-zinc-900 dark:text-white">{leetcodeStats.totalSolved}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Solved</span>
                </div>
                <div className="grid flex-[2] grid-cols-3 gap-1.5">
                  {[
                    { label: "Easy", value: leetcodeStats.easySolved, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Med", value: leetcodeStats.mediumSolved, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Hard", value: leetcodeStats.hardSolved, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
                  ].map((d) => (
                    <div key={d.label} className={`flex flex-col items-center justify-center rounded-lg border border-transparent py-1 ${d.bg}`}>
                      <span className={`text-xs font-bold ${d.color}`}>{d.value}</span>
                      <span className="text-[7px] font-bold uppercase text-zinc-500">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="my-4 rounded-lg border border-dashed border-amber-200 dark:border-amber-900/40 bg-white/40 dark:bg-black/20 p-3 text-center">
                <p className="text-[10px] italic text-zinc-500">Account not connected</p>
              </div>
            )}

            <div className="mt-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="flex-1 rounded-lg border border-amber-400 bg-white dark:bg-zinc-800 px-3 py-1.5 text-[11px] text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Username"
                  />
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-amber-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-sm transition active:scale-95 hover:bg-amber-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-lg border border-amber-600/20 bg-amber-600/10 py-2 text-[10px] font-bold uppercase tracking-tighter text-amber-700 dark:text-amber-500 transition hover:border-amber-600 hover:bg-amber-600 hover:text-white"
                >
                  {leetcodeUsername ? "Switch Account" : "Connect LeetCode"}
                </button>
              )}
            </div>
          </Card>

          <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                <TrophyIcon className="h-5 w-5 text-amber-500" /> Activity
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/submissions")}
                  className="rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                >
                  View All
                </button>
                <span className="rounded-md bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Total: {activityData.submissionCount || 0}
                </span>
              </div>
            </div>

            {activityData.activity && activityData.activity.length > 0 ? (
              <ul className="space-y-2">
                {activityData.activity.slice(0, 4).map((item) => (
                  <li
                    key={item._id}
                    className="group flex items-center justify-between rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/40 p-3 transition hover:border-indigo-300 dark:hover:border-indigo-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.status === "Accepted"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            : "bg-rose-500"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="max-w-[160px] truncate text-sm font-bold text-zinc-800 dark:text-zinc-200 md:max-w-none">
                            {item.question_title}
                          </span>
                          <span className="font-mono text-[9px] text-zinc-600 dark:text-zinc-400">
                            {item.languageId === 113 ? "py" : "code"}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-500">
                          <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                          <span>•</span>
                          <span>{(item.totalMemory / 1024).toFixed(1)}MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-[11px] font-black uppercase ${item.status === "Accepted" ? "text-emerald-500" : "text-rose-500"}`}>
                          {item.status}
                        </p>
                        <p className="font-mono text-[9px] text-zinc-600 dark:text-zinc-400">{item.totalRuntime}s</p>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-zinc-700 dark:text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 py-10 text-center">
                <p className="text-sm italic text-zinc-600 dark:text-zinc-400">No recent activity.</p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
