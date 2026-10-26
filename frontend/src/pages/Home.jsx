import { Link } from "react-router-dom";
import { ArrowRightIcon, CommandLineIcon, TrophyIcon } from "@heroicons/react/24/outline";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Platform Live {new Date().getFullYear()}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Code at ease.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                With zero limits.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Let's Code is your dedicated workspace to master DSA. A high-performance environment for problem solving,
              interview prep, and measurable progress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/problems"
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[0.98]"
              >
                Start Coding
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-6 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition hover:border-zinc-300 dark:border-zinc-700 hover:bg-white dark:bg-zinc-900"
              >
                View Progress
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 blur-2xl" />
            <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-6 font-mono text-sm shadow-2xl backdrop-blur">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs text-zinc-500">solution.cpp</span>
              </div>
              <pre className="overflow-hidden whitespace-pre-wrap text-indigo-300">
{`class Solution {
public:
  vector<int> twoSum(vector<int>& nums, int target) {
    // your journey starts here
    return {};
  }
};`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">The advantage</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Engineered for excellence.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: CommandLineIcon,
                title: "Targeted Problem Sets",
                desc: "Curated problems across DP, graphs, trees and more. Filter by topic, difficulty or company.",
              },
              {
                icon: CommandLineIcon,
                title: "Blazing Fast IDE",
                desc: "Cloud compiler supporting 20+ languages with instant feedback and powerful debugging.",
              },
              {
                icon: TrophyIcon,
                title: "Gamified Learning",
                desc: "Earn badges, climb leaderboards and visualize progress to stay motivated.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 transition hover:border-indigo-500/50 hover:bg-white dark:bg-zinc-900"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 transition group-hover:bg-indigo-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;