import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Moon,
  Sun,
  Play,
  Send,
  Timer,
  ChevronDown,
  Menu,
  XCircle,
  Loader2,
} from "lucide-react";
import { useTheme } from "../context/themecontext.jsx";

const difficultyColor = {
  easy: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  medium: "text-amber-400 border-amber-500/40 bg-amber-500/10",
  hard: "text-rose-400 border-rose-500/40 bg-rose-500/10",
};

const statusColor = {
  idle: "bg-zinc-500",
  running: "bg-amber-400 animate-pulse",
  passed: "bg-emerald-400",
  failed: "bg-rose-400",
};

export const WorkspaceNavbar = ({
  problemTitle,
  difficulty,
  status = "idle",
  timerLabel,
  languages = [],
  selectedLanguage,
  onSelectLanguage,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  submitDisabled = false,
  runDisabled = false,
  onAiHelp,
  isTestMode = false,
  onToggleTestMode,
  onExitTestMode,
  onToggleSidebar,
  sidebarVisible = true,
}) => {
  const themeCtx = useTheme() || {};
  const theme = themeCtx.theme ?? "dark";
  const toggleTheme = themeCtx.toggleTheme ?? (() => {});
  const [langOpen, setLangOpen] = useState(false);

  const diffKey = (difficulty || "").toLowerCase();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 px-3 backdrop-blur-xl md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            <Menu className="h-4 w-4" />
          </button>
        )}


        {problemTitle && (
          <>
            <span className="hidden text-zinc-700 sm:inline">/</span>
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">{problemTitle}</span>
              {difficulty && (
                <span
                  className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:inline ${
                    difficultyColor[diffKey] ?? "text-zinc-600 dark:text-zinc-400 border-zinc-500/40 bg-zinc-500/10"
                  }`}
                >
                  {difficulty}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 px-3 py-1">
          <span className={`h-2 w-2 rounded-full ${statusColor[status]}`} />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {status === "idle" ? "Ready" : status === "running" ? "Running" : status === "passed" ? "Accepted" : "Failed"}
          </span>
        </div>
        {timerLabel && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Timer className="h-3.5 w-3.5" />
            <span className="font-mono">{timerLabel}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {languages.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 transition hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <span className="max-w-[9rem] truncate">{selectedLanguage?.name ?? "Language"}</span>
              <ChevronDown className="h-3 w-3 text-zinc-500" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 max-h-80 w-64 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onSelectLanguage?.(lang);
                      setLangOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs transition ${
                      selectedLanguage?.id === lang.id
                        ? "bg-indigo-500/20 text-indigo-200"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {onAiHelp && (
          <button
            onClick={onAiHelp}
            className="hidden items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/20 sm:flex"
          >
            AI Coach
          </button>
        )}

        {isTestMode ? (
          <button
            onClick={onExitTestMode}
            className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
          >
            <XCircle className="h-3.5 w-3.5" />
            Exit
          </button>
        ) : (
          <button
            onClick={onToggleTestMode}
            className="hidden rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition hover:border-zinc-300 dark:hover:border-zinc-700 sm:block"
          >
            Test Mode
          </button>
        )}

        <button
          onClick={onRun}
          disabled={runDisabled || isRunning}
          className="flex items-center gap-1.5 rounded-md bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 transition hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Running
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Run
            </>
          )}
        </button>

        <button
          onClick={onSubmit}
          disabled={submitDisabled || isSubmitting}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Submitting
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Submit
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default WorkspaceNavbar;