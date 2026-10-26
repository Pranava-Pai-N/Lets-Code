import React, { useState } from "react";
import { BookOpen, MessageSquare, FileText, ClipboardList, Copy, Check } from "lucide-react";
import Discussion from "./Discussion.jsx";

const tabs = [
  { key: "description", label: "Description", icon: FileText },
  { key: "editorial", label: "Editorial", icon: BookOpen },
  { key: "submissions", label: "Submissions", icon: ClipboardList },
  { key: "discussions", label: "Discussions", icon: MessageSquare },
];

const getDifficultyClass = (level) => {
  const v = level?.toLowerCase();
  if (v === "easy") return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
  if (v === "medium") return "text-amber-400 border-amber-500/40 bg-amber-500/10";
  if (v === "hard") return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  return "text-zinc-400 border-zinc-500/40 bg-zinc-500/10";
};

export const ProblemPane = ({ problem, problemId, user }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(problem.description ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800/80 bg-zinc-900/60 px-3 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group relative flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-medium transition-all ${
                active
                  ? "bg-zinc-950 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-px bg-indigo-400 shadow-[0_0_8px] shadow-indigo-400/60" />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        {activeTab === "description" && (
          <article className="prose prose-invert prose-sm max-w-none">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h1 className="m-0 text-xl font-semibold tracking-tight text-zinc-50">{problem.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getDifficultyClass(
                      problem.difficultyLevel,
                    )}`}
                  >
                    {problem.difficultyLevel ?? "Medium"}
                  </span>
                  {problem.ratingLevel ? (
                    <span className="text-xs text-zinc-400">Rating {problem.ratingLevel}/5</span>
                  ) : null}
                  {problem.acceptedRate != null ? (
                    <span className="text-xs text-zinc-400">Acceptance {problem.acceptedRate}%</span>
                  ) : null}
                </div>
              </div>
              <button
                onClick={handleCopyDescription}
                className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-50"
                title="Copy description"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div
              className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 text-sm leading-relaxed text-zinc-200 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_code]:text-indigo-300"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />

            {problem.constraints && problem.constraints.length > 0 && (
              <section className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-zinc-100">Constraints</h3>
                <ul className="space-y-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 text-sm text-zinc-300">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        )}

        {activeTab === "editorial" && (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Editorial will appear here once published.
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Your submissions for this problem will appear here.
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="animate-in fade-in duration-200">
            <Discussion problemId={problemId} user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPane;