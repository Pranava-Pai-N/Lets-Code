import React, { useCallback, useEffect, useRef, useState } from "react";
import { Panel, Group, Separator, usePanelRef } from "react-resizable-panels";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelBottomClose,
  PanelBottomOpen,
  CheckCircle2,
  ArrowRight,
  X,
} from "lucide-react";
import { useMobile } from "../hooks/useMobile.js";
import { useLanguageManager } from "../hooks/useLanguageManager.js";
import WorkspaceNavbar from "./WorkspaceNavbar.jsx";
import ProblemPane from "./ProblemPane.jsx";
import EditorPane from "./EditorPane.jsx";
import ConsolePane from "./ConsolePane.jsx";
import Loader from "./Loader.jsx";
import ReactConfetti from "react-confetti";

const ProblemWorkspace = ({ problem, problemId, user, isAuthenticated }) => {
  const isMobile = useMobile(1024);
  const { code, setCode, selectedLanguage, selectedLanguageId, languages, isLoading: langsLoading, selectLanguage, getMonacoLanguage } =
    useLanguageManager();

  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [activeConsoleTab, setActiveConsoleTab] = useState("tests");
  const [editorFullscreen, setEditorFullscreen] = useState(false);

  const problemPanelRef = usePanelRef();
  const consolePanelRef = usePanelRef();
  const [problemCollapsed, setProblemCollapsed] = useState(false);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);

  const [time, setTime] = useState(0);
  const maxTime = 6;
  useEffect(() => {
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const [isTestMode, setIsTestMode] = useState(false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  const stopCameraTracks = (stream) => {
    if (stream && typeof stream.getTracks === "function") stream.getTracks().forEach((tr) => tr.stop());
  };

  useEffect(() => {
    let currentStream = null;
    const startCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        currentStream = newStream;
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(() => {});
        }
        setCameraStream(newStream);
      } catch (err) {
        console.error(err);
        toast.error("Camera access denied or failed.");
        setCameraStream(null);
      }
    };
    if (isTestMode) startCamera();
    return () => {
      if (cameraStream) {
        stopCameraTracks(cameraStream);
        setCameraStream(null);
      }
      if (currentStream) stopCameraTracks(currentStream);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTestMode]);

  useEffect(() => {
    const handleFs = () => {
      if (!document.fullscreenElement) setIsTestMode(false);
    };
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  const handleTestMode = () => {
    const el = rootRef.current;
    if (el) {
      el.requestFullscreen().then(() => setIsTestMode(true)).catch(() => setIsTestMode(true));
    } else {
      setIsTestMode(true);
    }
  };
  const handleExitTestMode = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setIsTestMode(false);
  };

  const handleRunCode = useCallback(async () => {
    if (!selectedLanguageId) {
      toast.error("Please select a language first.");
      return;
    }
    try {
      setIsRunning(true);
      setTestResults(null);
      const body = {
        question_no: problem._id,
        source_code: code,
        language_id: selectedLanguageId,
        test_cases: problem.testCases,
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/questions/run-question`, body, {
        withCredentials: true,
      });
      if (!response.data.allPassed) {
        setSubmitDisabled(true);
        toast.error("Some test cases failed. Optimize and try again.");
      } else {
        setSubmitDisabled(false);
        toast.success("All test cases passed! You can submit now.");
      }
      setTestResults(response.data);
      const errors = (response.data.results ?? [])
        .map((r) => r.stderr)
        .filter(Boolean)
        .join("\n");
      setConsoleOutput(errors || "> Program executed successfully with no errors.");
      setActiveConsoleTab("output");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Run failed");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  }, [code, problem, selectedLanguageId]);

  const handleSubmitSolution = useCallback(async () => {
    if (submitDisabled) {
      toast.info("Please pass all test cases to submit code");
      return;
    }
    if (alreadySubmitted) {
      toast.info("Already submitted. Final submission only once.");
      return;
    }
    try {
      setIsSubmitting(true);
      const body = {
        question_no: problem._id,
        source_code: code,
        language_id: selectedLanguageId,
        test_cases: problem.testCases,
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/questions/submit-question`, body, {
        withCredentials: true,
      });
      if (response.data.success && response.data.allPassed) {
        setSubmissionData(response.data);
        toast.success(response.data.message ?? "Accepted");
        setShowSuccessModal(true);
        setAlreadySubmitted(true);
      }
      const errors = (response.data.results ?? [])
        .map((r) => r.stderr)
        .filter(Boolean)
        .join("\n");
      setConsoleOutput(errors || "> Program executed successfully with no errors.");
    } catch (error) {
      toast.error("Code submission failed. Try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, problem, selectedLanguageId, submitDisabled, alreadySubmitted]);

  const helpfulAI = useCallback(async () => {
    try {
      setAiResponse("");
      setShowAiPanel(true);
      setIsAiLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/ai-help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ source_code: code, problem }),
      });
      if (!response.ok) throw new Error("Failed to fetch AI help");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setIsAiLoading(false);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setAiResponse((prev) => prev + chunk.replace(/<thought>[\s\S]*?<\/thought>/g, ""));
      }
    } catch (error) {
      console.log(error);
      toast.error("AI Assistant unavailable. Try again later.");
      setIsAiLoading(false);
    }
  }, [code, problem]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        if (problemPanelRef.current?.isCollapsed()) {
          problemPanelRef.current.expand();
          setProblemCollapsed(false);
        } else {
          problemPanelRef.current?.collapse();
          setProblemCollapsed(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [problemPanelRef]);

  const toggleProblemPanel = () => {
    if (problemPanelRef.current?.isCollapsed()) {
      problemPanelRef.current.expand();
      setProblemCollapsed(false);
    } else {
      problemPanelRef.current?.collapse();
      setProblemCollapsed(true);
    }
  };
  const toggleConsolePanel = () => {
    if (consolePanelRef.current?.isCollapsed()) {
      consolePanelRef.current.expand();
      setConsoleCollapsed(false);
    } else {
      consolePanelRef.current?.collapse();
      setConsoleCollapsed(true);
    }
  };

  const timerLabel = `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;

  if (langsLoading) return <Loader />;

  const status = isRunning ? "running" : testResults ? (testResults.allPassed ? "passed" : "failed") : "idle";

  return (
    <div ref={rootRef} className="flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <WorkspaceNavbar
        problemTitle={problem.title}
        difficulty={problem.difficultyLevel}
        status={status}
        timerLabel={timerLabel}
        languages={languages}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={selectLanguage}
        onRun={handleRunCode}
        onSubmit={handleSubmitSolution}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        submitDisabled={submitDisabled}
        runDisabled={!isAuthenticated}
        onAiHelp={helpfulAI}
        isTestMode={isTestMode}
        onToggleTestMode={handleTestMode}
        onExitTestMode={handleExitTestMode}
        onToggleSidebar={() => {}}
      />

      {isMobile ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-[42%] overflow-hidden border-b border-zinc-800">
            <ProblemPane problem={problem} problemId={problemId} user={user} />
          </div>
          <div className="h-[43%] overflow-hidden border-b border-zinc-800">
            <EditorPane
              code={code}
              onCodeChange={setCode}
              language={selectedLanguage}
              monacoLanguage={getMonacoLanguage()}
              isFullscreen={editorFullscreen}
              onToggleFullscreen={() => setEditorFullscreen((v) => !v)}
            />
          </div>
          <div className="h-[15%] overflow-hidden">
            <ConsolePane
              testCases={problem.testCases ?? []}
              selectedTestCase={selectedTestCase}
              onSelectTestCase={setSelectedTestCase}
              testResults={testResults}
              isRunning={isRunning}
              consoleOutput={consoleOutput}
              activeTab={activeConsoleTab}
              onTabChange={setActiveConsoleTab}
            />
          </div>
        </div>
      ) : (
        <Group orientation="horizontal" className="flex-1">
          <Panel
            panelRef={problemPanelRef}
            collapsible
            collapsedSize={0}
            minSize="22%"
            defaultSize="30%"
            onResize={() => setProblemCollapsed(problemPanelRef.current?.isCollapsed() ?? false)}
            className="overflow-hidden"
          >
            <ProblemPane problem={problem} problemId={problemId} user={user} />
          </Panel>

          <Separator className="group relative flex w-2 items-center justify-center bg-zinc-900 transition hover:bg-zinc-800">
            <div className="h-10 w-1 rounded-full bg-zinc-700 transition group-hover:bg-indigo-500" />
            <button
              onClick={toggleProblemPanel}
              className="absolute z-10 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 opacity-0 shadow-lg transition group-hover:opacity-100 hover:text-indigo-300"
              title="Toggle problem panel (Ctrl+B)"
            >
              {problemCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            </button>
          </Separator>

          <Panel defaultSize="70%" minSize="40%" className="overflow-hidden">
            <Group orientation="vertical">
              <Panel defaultSize="78%" minSize="40%" className="overflow-hidden">
                <EditorPane
                  code={code}
                  onCodeChange={setCode}
                  language={selectedLanguage}
                  monacoLanguage={getMonacoLanguage()}
                  isFullscreen={editorFullscreen}
                  onToggleFullscreen={() => setEditorFullscreen((v) => !v)}
                />
              </Panel>

              <Separator className="group relative flex h-2 items-center justify-center bg-zinc-900 transition hover:bg-zinc-800">
                <div className="h-1 w-10 rounded-full bg-zinc-700 transition group-hover:bg-indigo-500" />
                <button
                  onClick={toggleConsolePanel}
                  className="absolute z-10 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 opacity-0 shadow-lg transition group-hover:opacity-100 hover:text-indigo-300"
                  title="Toggle console panel"
                >
                  {consoleCollapsed ? <PanelBottomOpen className="h-3.5 w-3.5" /> : <PanelBottomClose className="h-3.5 w-3.5" />}
                </button>
              </Separator>

              <Panel
                panelRef={consolePanelRef}
                collapsible
                collapsedSize={0}
                minSize="10%"
                defaultSize="22%"
                onResize={() => setConsoleCollapsed(consolePanelRef.current?.isCollapsed() ?? false)}
                className="overflow-hidden"
              >
                <ConsolePane
                  testCases={problem.testCases ?? []}
                  selectedTestCase={selectedTestCase}
                  onSelectTestCase={setSelectedTestCase}
                  testResults={testResults}
                  isRunning={isRunning}
                  consoleOutput={consoleOutput}
                  activeTab={activeConsoleTab}
                  onTabChange={setActiveConsoleTab}
                  collapsed={consoleCollapsed}
                  onToggleCollapse={toggleConsolePanel}
                />
              </Panel>
            </Group>
          </Panel>
        </Group>
      )}

      <AnimatePresence>
        {showAiPanel && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-full border-l border-zinc-800 bg-zinc-950 shadow-2xl md:w-96"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
                <button onClick={() => setShowAiPanel(false)} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isAiLoading ? (
                  <p className="text-sm text-zinc-500 animate-pulse">Analyzing your code...</p>
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                    {aiResponse || "Click the AI Coach button to get hints about your solution."}
                  </div>
                )}
              </div>
              <div className="border-t border-zinc-800 p-3 text-center text-[10px] text-zinc-500">
                AI may produce inaccuracies. Use hints to improve your logic.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isTestMode && (
        <div className="fixed bottom-4 left-4 z-40 rounded-lg border-2 border-indigo-500/60 bg-black/80 p-1 backdrop-blur-sm">
          <video ref={videoRef} className="h-24 w-32 rounded-md object-cover md:h-32 md:w-48" playsInline autoPlay muted style={{ display: cameraStream ? "block" : "none" }} />
          {!cameraStream && (
            <div className="flex h-24 w-32 items-center justify-center rounded-md bg-zinc-900 text-xs text-zinc-400 md:h-32 md:w-48">
              Waiting for camera...
            </div>
          )}
        </div>
      )}

      {time > maxTime * 60 && (
        <div className="fixed bottom-4 right-4 z-20 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white shadow-xl">
          Time limit exceeded.
        </div>
      )}

      {showSuccessModal && <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} gravity={0.2} style={{ zIndex: 1000 }} />}

      {showSuccessModal && submissionData && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="border-b border-zinc-800 p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">{submissionData.status ?? "Accepted"}</h2>
              <p className="mt-1 font-medium text-emerald-400/80">{submissionData.message}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-zinc-900/40 p-6">
              {[
                { label: "Solved", value: submissionData.userStats?.solvedCount ?? 0, color: "text-indigo-400" },
                { label: "Streak", value: submissionData.userStats?.streak ?? 0, color: "text-orange-400" },
                { label: "Acceptance", value: `${submissionData.userStats?.acceptanceRate ?? 0}%`, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</p>
                  <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 p-8">
              <Link to="/problems" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]">
                Solve More Problems
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-2 font-medium text-zinc-400 transition hover:text-zinc-200">
                Review My Code
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProblemWorkspace;