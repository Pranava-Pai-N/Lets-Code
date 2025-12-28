import React, { useState } from "react";
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

  if (loading) return <Loader />;
  if (error) return <div className="p-10 text-red-500 text-center font-bold">Error: {error}</div>;

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.topicsList?.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-950 min-h-screen">

      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          All Challenges
        </h1>

        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-gray-200 transition"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProblems.map((problem) => {
          const style = getDifficultyColor(problem.difficultyLevel);

          const isSolved = user?.solvedQuestionIds?.includes(problem._id);


          return (
            <Link key={problem._id} to={`/problems/${problem._id}`} className="block group">
              <Card className={`p-6 h-full flex flex-col justify-between rounded-xl shadow-lg dark:shadow-2xl bg-white dark:bg-gray-800 border-t-4 ${style.border} hover:scale-[1.02] transition-transform duration-300`}>

                {problem.isDailyQuestion && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-l from-amber-600 to-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1.5 shadow-md tracking-wider uppercase">
                      <StarIcon className="w-3.5 h-3.5 fill-white" />
                      POTD
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition">
                        {problem.title}
                      </h3>
                      {isSolved && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${style.bg} ${style.text}`}>
                      {problem.difficultyLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {problem.topicsList?.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-[11px]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Success Rate</span>
                    <span className="font-semibold dark:text-gray-300">{problem.acceptedRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${problem.acceptedRate}%` }}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProblemList;