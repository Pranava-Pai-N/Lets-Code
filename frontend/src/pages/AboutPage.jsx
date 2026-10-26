import { UserIcon, CodeBracketIcon, MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_60%)]" />
      <main className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <aside className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-indigo-500/30 to-violet-500/10 blur-xl" />
              <img
                src="/assets/Developer.jpg"
                alt="Developer profile"
                className="relative h-56 w-56 rounded-3xl border border-zinc-200 dark:border-zinc-800 object-cover shadow-2xl"
              />
            </div>
            <h1 className="mt-6 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Pranava Pai N</h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              Backend Developer · ML Enthusiast · Student
            </p>
            <div className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-4 w-4 text-zinc-500" />
                <span>Mangalore, Karnataka</span>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-4 w-4 text-zinc-500" />
                <span>Building user-friendly projects</span>
              </div>
              <div className="flex items-center gap-3">
                <CodeBracketIcon className="h-4 w-4 text-zinc-500" />
                <span>Let's Code platform author</span>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">About</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Developer & project</h2>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6">
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Let's Code is a full-stack coding platform built to help developers practice DSA, run code in the browser,
                and track progress with a clean, fast workspace. The backend handles authentication, problem management,
                submissions, and integrations with Judge0 and LeetCode data.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Tech Stack", desc: "React, Vite, Tailwind, Node, Express, MongoDB" },
                { title: "Editor", desc: "Monaco-based workspace with resizable panels" },
                { title: "Execution", desc: "Judge0 integration for 20+ languages" },
                { title: "Auth", desc: "Email, Google, GitHub, and passkeys" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 transition hover:border-indigo-500/40">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
