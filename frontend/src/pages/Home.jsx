import { Link } from "react-router-dom";
import { ArrowRightIcon , ListBulletIcon , CommandLineIcon , TrophyIcon } from "@heroicons/react/24/outline";

const Home = () => {
  return (
  <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
    <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      
      <header className="pt-24 pb-20 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 transition-transform hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Platform Live 2026</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-[950] tracking-tight leading-[1.05] text-slate-900 mb-8">
            Code at Ease.<br />
            <span className="text-indigo-600 italic">With Zero Limits.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-xl">
            Let's Code is your dedicated space to master DSA. High-performance environment for problem-solving and elite interview prep.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/problems">
              <button className="group relative px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95">
                <span className="flex items-center gap-2 text-sm uppercase tracking-widest">
                  Start Coding <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="px-8 py-4 bg-white text-slate-600 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                <span className="text-sm uppercase tracking-widest">View Progress</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:block w-full max-w-md bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-[8px] border-slate-800">
           <div className="bg-slate-900 rounded-[2rem] p-6 font-mono text-sm text-indigo-300">
              <p><span className="text-pink-400">class</span> <span className="text-yellow-300">Solution</span> {"{"}</p>
              <p className="pl-4 text-slate-500">// Your journey starts here</p>
              <p className="pl-4"><span className="text-pink-400">public:</span></p>
              <p className="pl-8 text-indigo-200 underline decoration-indigo-500">solveDailyProblem()</p>
              <p>{"}"}</p>
           </div>
        </div>
      </header>

      <section className="py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">The Advantage</h2>
            <p className="text-4xl font-bold text-slate-900">Engineered for Excellence.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ListBulletIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Targeted Problem Sets</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Curated problems across all major topics like DP, Graphs, and Trees. Filter by company, specific paths or skill level.
            </p>
          </div>

          <div className="group p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <CommandLineIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Blazing Fast IDE</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Cloud-based compiler supporting 20+ languages with instant feedback and powerful debugging tools.
            </p>
          </div>

          <div className="group p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Gamified Learning</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Earn badges, climb leaderboards, and visualize progress with insightful data to stay motivated.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-20 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Let's Code 
        </p>
        <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="hover:text-indigo-600 cursor-pointer">Privacy</span>
          <span className="hover:text-indigo-600 cursor-pointer">Terms</span>
          <Link to="/about-me">
          <span className="hover:text-indigo-600 cursor-pointer">Developed By</span>
          </Link>
        </div>
      </footer>
    </div>
  </div>
);
};

export default Home;