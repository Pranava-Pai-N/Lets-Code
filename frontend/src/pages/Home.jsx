import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        
        <header className="text-center pt-16 pb-12 max-w-5xl">
          <h1 className="text-7xl font-black mb-4 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Code Fluency. <span className="block">Zero Limits.</span>
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            Let's Code is your dedicated platform to master DSA, providing a world-class environment for problem-solving and interview preparation.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <Link to="/problems">
              <Button className="w-full sm:w-auto px-10 py-4 text-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-2xl shadow-purple-500/50 transition duration-400 transform hover:-translate-y-1">
                Start Coding Today
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="w-full sm:w-auto px-10 py-4 text-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-2xl shadow-purple-500/50 transition duration-400 transform hover:-translate-y-1">
                View Progress
              </Button>
            </Link>
          </div>
        </header>
        
        <section className="mt-24 w-full max-w-6xl">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-16">
            The Let's Code Advantage
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            
            <Card className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-inner dark:shadow-purple-900/50 hover:shadow-3xl transition duration-500 border-l-4 border-purple-500 lg:col-span-1">
              <div className="text-4xl mb-4 text-purple-600 dark:text-purple-400"></div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-3">
                Targeted Problem Sets
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Curated problems across all major topics like Dynamic Programming, Graphs, and Trees. Filter by company or skill level.
              </p>
            </Card>

            <Card className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-inner dark:shadow-purple-900/50 hover:shadow-3xl transition duration-500 border-l-4 border-purple-500 lg:col-span-1 mt-0 lg:mt-16 xl:mt-0">
              <div className="text-4xl mb-4 text-purple-600 dark:text-purple-400"></div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-3">
                Blazing Fast IDE
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                An integrated, cloud-based compiler supporting 20+ languages, providing instant feedback and powerful debugging tools.
              </p>
            </Card>
            
            <Card className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-inner dark:shadow-purple-900/50 hover:shadow-3xl transition duration-500 border-l-4 border-purple-500 lg:col-span-1">
              <div className="text-4xl mb-4 text-purple-600 dark:text-purple-400"></div>
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-3">
                Gamified Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Earn badges, climb the leaderboards, and visualize your progress with insightful data to stay motivated and focused.
              </p>
            </Card>
            
          </div>
        </section>

        <footer className="mt-32 py-12 w-full max-w-6xl border-t-2 border-gray-100 dark:border-gray-800 text-center">
          <p className="text-md text-gray-500 dark:text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} Let's Code. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;