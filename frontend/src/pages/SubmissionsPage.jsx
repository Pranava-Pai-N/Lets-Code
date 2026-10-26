import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import Loader from "../components/Loader.jsx";

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/submissions?limit=${limit}`, {
          withCredentials: true
        });
        if (response.data.success) setSubmissions(response.data.submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    fetchSubmissions();
  }, [limit]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black">
              My <span className="text-indigo-400">Submissions</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">History of all your code attempts</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Show</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500/60"
            >
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-12 text-center text-zinc-600 dark:text-zinc-400">
            No submissions yet. Go solve a problem!
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
            <div className="hidden grid-cols-12 gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 md:grid">
              <div className="col-span-4">Problem</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Language</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            {submissions.map((s) => (
              <div key={s._id} className="grid grid-cols-1 gap-3 border-b border-zinc-200 dark:border-zinc-800/60 px-6 py-4 transition hover:bg-zinc-100 dark:bg-zinc-800/40 md:grid-cols-12 md:items-center md:gap-4">
                <div className="md:col-span-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.question_title || "Untitled"}</div>
                <div className="md:col-span-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.status === "Accepted" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {s.status === "Accepted" ? <CheckCircleIcon className="h-3.5 w-3.5" /> : <XCircleIcon className="h-3.5 w-3.5" />}
                    {s.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 md:col-span-2">{s.language || "—"}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 md:col-span-2">{new Date(s.createdAt).toLocaleDateString()}</div>
                <div className="md:col-span-2 md:text-right">
                  <button
                    onClick={() => navigate(`/submissions/${s._id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition hover:border-indigo-500/50 hover:text-indigo-300"
                  >
                    <EyeIcon className="h-3.5 w-3.5" /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;