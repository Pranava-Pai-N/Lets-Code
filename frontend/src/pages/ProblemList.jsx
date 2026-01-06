import React, { useState  } from "react";
import { Link } from "react-router-dom";
import useFetchProblems from "../hooks/useFetchProblems.js";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import { CheckCircleIcon, MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/solid";

const getDifficultyColor = (difficulty) => {
  const diff = difficulty?.toLowerCase();
  if (diff === "easy") return { text: "text-green-500", bg: "bg-green-500/10", border: "border-green-500" };
  if (diff === "medium") return { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500" };
  if (diff === "hard") return { text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500" };
  return { text: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500" };
};

const ProblemList = () => {
  const { problems, loading, error } = useFetchProblems();
  const { user } = useAuth();


  const [searchTerm, setSearchTerm] = useState("");


  if (loading) 
    return <Loader />;
  
  if (error)
    return <div className="p-10 text-red-500 text-center font-bold">Error: {error}</div>;

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.topicsList?.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );



 return (
  <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-10 font-sans">
    <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">
          Problem <span className="text-indigo-600">List</span>
        </h1>
        <p className="text-[11px] font-mono uppercase tracking-widest text-gray-500">
          Network Status: <span className="text-emerald-600 font-bold">Stable</span>{" "}Available Challenges: {filteredProblems.length}
        </p>
      </div>

      <div className="relative w-full md:w-80 group">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Filter by title or topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all shadow-sm"
        />
      </div>
    </div>

    <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 bg-gray-50/50">
        <div className="col-span-1">Status</div>
        <div className="col-span-6 md:col-span-7">Title</div>
        <div className="col-span-3 md:col-span-2 text-center">Difficulty</div>
        <div className="col-span-2 text-right">Acceptance</div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredProblems.map((problem, index) => {
          const style = getDifficultyColor(problem.difficultyLevel);
          const isSolved = user?.solvedQuestionIds?.includes(problem._id);
          const isPotdActive = problem.isDailyQuestion;

          return (
            <Link
              key={problem._id}
              to={`/problems/${problem._id}`}
              className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all duration-200 hover:bg-indigo-50/40 group relative ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <div className="absolute left-0 w-1 h-0 bg-indigo-600 transition-all duration-300 group-hover:h-full" />


              <div className="col-span-1 flex items-center">
                {isSolved ? (
                  <CheckCircleIcon className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-indigo-300 transition-colors bg-white" />
                )}
              </div>

              <div className="col-span-6 md:col-span-7 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-bold group-hover:text-indigo-600 transition-colors truncate">
                    {problem.title}
                  </span>
                  {isPotdActive && (
                    <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-md border border-amber-200 tracking-tight">
                      POTD
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {problem.topicsList?.slice(0, 3).map((topic, idx) => (
                    <span key={idx} className="text-[10px] font-medium text-gray-400 group-hover:text-indigo-400">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-span-3 md:col-span-2 text-center">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${style.border} ${style.bg} ${style.text} shadow-sm`}>
                  {problem.difficultyLevel}
                </span>
              </div>

              <div className="col-span-2 text-right flex flex-col items-end gap-1.5">
                <span className="text-xs font-mono font-bold text-gray-600">
                  {problem.acceptedRate}%
                </span>
                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden md:block border border-gray-200/50">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all" 
                    style={{ width: `${problem.acceptedRate}%` }}
                  />
                </div>
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