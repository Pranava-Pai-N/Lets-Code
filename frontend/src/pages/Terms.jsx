import { useState } from "react";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  ScaleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Terms = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <DocumentTextIcon className="h-5 w-5" />,
      content:
        "By accessing 'Let's Code', you confirm that you are at least 10 years of age and agree to comply with these terms. Our platform is a collaborative tool for developers, and usage implies consent to our automated testing and ranking systems.",
    },
    {
      id: "conduct",
      title: "User Conduct",
      icon: <UserGroupIcon className="h-5 w-5" />,
      content:
        "You agree not to use the code execution environment for mining cryptocurrency, launching DDoS attacks, or attempting to access our internal database strings. Play fair, code hard.",
    },
    {
      id: "license",
      title: "License & Content",
      icon: <ScaleIcon className="h-5 w-5" />,
      content:
        "We grant you a personal, non-exclusive license to use our compiler and problem sets for educational purposes. You may not republish our problem statements on other platforms without written credit.",
    },
    {
      id: "termination",
      title: "Termination",
      icon: <ExclamationTriangleIcon className="h-5 w-5" />,
      content:
        "We reserve the right to suspend accounts that exhibit bot-like behavior or repeatedly submit plagiarized code from external sources.",
    },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_60%)]" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Legal</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Terms of <span className="text-indigo-400">Service</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Everything you need to know about using the Let's Code platform. Last updated {new Date().toLocaleDateString()}.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeSection === s.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:bg-zinc-900 hover:text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {s.icon}
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 transition hover:border-indigo-500/40"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-lg bg-indigo-500/10 p-2 text-indigo-300">{section.icon}</span>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{section.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{section.content}</p>
              </section>
            ))}

            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/20 to-violet-600/10 p-8 text-center">
              <ShieldCheckIcon className="mx-auto mb-4 h-12 w-12 text-indigo-300" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">We value your privacy</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Have questions about these terms or your data?</p>
              <a
                href="mailto:pranavpai0309@gmail.com"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Contact Support <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Terms;
