import { useState } from "react";
import { Terminal, PlayCircle, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export const ConsolePane = ({
  testCases,
  selectedTestCase,
  onSelectTestCase,
  testResults,
  isRunning,
  consoleOutput,
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}) => {
  const [customInput, setCustomInput] = useState("");

  const tabs = [
    { key: "tests", label: "Test Cases" },
    { key: "output", label: "Result" },
    { key: "console", label: "Console" },
  ];

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-3 py-2">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                activeTab === t.key
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            title={collapsed ? "Expand console" : "Collapse console"}
          >
            {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "tests" && (
          <div className="space-y-4">
            {testCases && testCases.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {testCases.slice(0, 5).map((_, idx) => {
                    const res = testResults?.results?.[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => onSelectTestCase(idx)}
                        className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                          selectedTestCase === idx
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-200"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        Case {idx + 1}
                        {res && (res.passed ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <XCircle className="h-3 w-3 text-rose-400" />)}
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Input</p>
                    <pre className="min-h-[60px] rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 font-mono text-xs text-zinc-200 whitespace-pre-wrap">
                      {testCases[selectedTestCase]?.input ?? ""}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Expected Output</p>
                    <pre className="min-h-[60px] rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 font-mono text-xs text-zinc-200 whitespace-pre-wrap">
                      {testCases[selectedTestCase]?.output ?? ""}
                    </pre>
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Custom Input</p>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Type custom input here..."
                    className="h-24 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/60 focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-zinc-500">No test cases available.</div>
            )}
          </div>
        )}

        {activeTab === "output" && (
          <div className="space-y-4">
            {isRunning && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="mb-2 h-3 w-24 rounded bg-zinc-800" />
                    <div className="h-3 w-full rounded bg-zinc-800" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-zinc-800" />
                  </div>
                ))}
              </div>
            )}

            {!isRunning && !testResults && (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-zinc-500">
                <PlayCircle className="h-8 w-8 text-zinc-700" />
                <p className="text-sm">Run your code to see results here.</p>
              </div>
            )}

            {!isRunning && testResults && (
              <>
                <div
                  className={`rounded-lg border p-4 ${
                    testResults.allPassed
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-rose-500/40 bg-rose-500/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResults.allPassed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-400" />
                    )}
                    <h3 className={`text-base font-semibold ${testResults.allPassed ? "text-emerald-300" : "text-rose-300"}`}>
                      {testResults.allPassed ? "Accepted" : "Wrong Answer"}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    {testResults.results.filter((r) => r.passed).length} / {testResults.results.length} test cases passed
                  </p>
                </div>

                <div className="space-y-3">
                  {testResults.results.map((res, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
                      <div
                        className={`flex items-center justify-between px-4 py-2 ${
                          res.passed ? "bg-emerald-500/10" : "bg-rose-500/10"
                        }`}
                      >
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${res.passed ? "text-emerald-300" : "text-rose-300"}`}>
                          {res.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          Case {index + 1}: {res.status}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            res.passed
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {res.passed ? "Pass" : "Fail"}
                        </span>
                      </div>
                      <div className="space-y-2 p-4">
                        <div>
                          <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Actual Output</p>
                          <pre className="rounded-md border border-zinc-800 bg-zinc-950 p-2 font-mono text-xs text-zinc-200 whitespace-pre-wrap">
                            {res.stdout || (res.stderr ? <span className="text-rose-400">{res.stderr}</span> : "No Output")}
                          </pre>
                        </div>
                        {res.stderr && res.stdout && (
                          <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Stderr</p>
                            <pre className="rounded-md border border-rose-500/30 bg-rose-500/5 p-2 font-mono text-xs text-rose-300 whitespace-pre-wrap">
                              {res.stderr}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "console" && (
          <div className="h-full rounded-lg border border-zinc-800 bg-black/60 p-4 font-mono text-xs">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <Terminal className="h-3.5 w-3.5" />
              <span className="uppercase tracking-widest">debug — logs</span>
            </div>
            {consoleOutput ? (
              <pre
                className={`whitespace-pre-wrap ${
                  /error|failed/i.test(consoleOutput) ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {consoleOutput}
              </pre>
            ) : (
              <div className="flex items-center text-zinc-600">
                <span className="mr-2 text-indigo-400">➜</span>
                <span className="animate-pulse">_</span>
                <span className="ml-2 italic text-zinc-500">Ready to execute...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsolePane;