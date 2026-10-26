import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchProblems from "../hooks/useFetchProblems.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { CheckCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const getDifficultyColor = (difficulty) => {
  const diff = difficulty?.toLowerCase();
  if (diff === "easy") return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
  if (diff === "medium") return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" };
  if (diff === "hard") return { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" };
  return { text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30" };
};

const ProblemList = () => {
  const { problems, loading, error } = useFetchProblems();
  const { user } = useAuth();
  const [level, setLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <Loader />;
  if (error) return <div className="p-10 text-center font-bold text-rose-400">Error: {error}</div>;

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.topicsList?.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = level === "" || p.difficultyLevel?.toLowerCase() === level.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              <span className="text-rose-500">Problem</span> <span className="text-indigo-400">List</span>
            </h1>
            <p className="mt-1 text-xs font-mono uppercase tracking-widest text-zinc-500">
              Network: <span className="text-emerald-400 font-bold">Stable</span> · {filteredProblems.length} challenge{filteredProblems.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="">All Problems</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 md:block">
          <div className="grid grid-cols-12 gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Topics</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {filteredProblems.map((p, idx) => {
            const c = getDifficultyColor(p.difficultyLevel);
            const solved = user?.solvedProblems?.includes(p._id);
            return (
              <Link
                key={p._id}
                to={`/problems/${p._id}`}
                className="grid grid-cols-12 items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/60 px-6 py-4 transition hover:bg-zinc-100 dark:bg-zinc-800/40"
              >
                <div className="col-span-1 text-xs font-mono text-zinc-500">{idx + 1}</div>
                <div className="col-span-5 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.title}</div>
                <div className="col-span-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.text} ${c.bg} ${c.border}`}>
                    {p.difficultyLevel}
                  </span>
                </div>
                <div className="col-span-2 truncate text-xs text-zinc-600 dark:text-zinc-400">{p.topicsList?.join(", ") || "—"}</div>
                <div className="col-span-2 flex justify-end">
                  {solved ? <CheckCircleIcon className="h-5 w-5 text-emerald-400" /> : <span className="text-xs text-zinc-600">—</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-3 md:hidden">
          {filteredProblems.map((p) => {
            const c = getDifficultyColor(p.difficultyLevel);
            const solved = user?.solvedProblems?.includes(p._id);
            return (
              <Link
                key={p._id}
                to={`/problems/${p._id}`}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 transition hover:border-indigo-500/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</h3>
                  {solved && <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.text} ${c.bg} ${c.border}`}>
                    {p.difficultyLevel}
                  </span>
                  <span className="truncate text-xs text-zinc-500">{p.topicsList?.join(", ")}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProblemList;