import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import axios from "axios";
import CountUpTimer from "../components/CountdownTimer.jsx";
import { XCircleIcon, StopCircleIcon, CheckCircleIcon, ArrowRightIcon, SparklesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify"
import ReactConfetti from "react-confetti";
import Discussion from "../components/Discussion.jsx"
import { useAuth } from "../context/AuthContext.jsx";


const getDifficultyBadge = (level) => {
    const normalizedLevel = level?.toLowerCase() || "";
    let colorClass = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    if (normalizedLevel === "easy") {
        colorClass = "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border border-green-300";
    } else if (normalizedLevel === "medium") {
        colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-300";
    } else if (normalizedLevel === "hard") {
        colorClass = "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border border-red-300";
    }

    return (
        <span className={`px-3 py-1 text-xs font-semibold uppercase rounded-full ${colorClass}`}>
            {level}
        </span>
    );
};

const ProblemDetail = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [code, setCode] = useState("// Write your solution here");
    const [leftWidth, setLeftWidth] = useState(45);
    const [editorHeight, setEditorHeight] = useState(75);
    const [time] = useState(0);
    const [maxTime] = useState(6);
    const [activeTab, setActiveTab] = useState("tests");
    const [isTestMode, setIsTestMode] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [languageId, setLanguageId] = useState(45);
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [testResults, setTestResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState("");
    const [enableSubmit, setenableSubmit] = useState(true);
    const [isSubmitting, setisSubmitting] = useState(false);
    const [_questionCompleted, setQuestionCompleted] = useState(false);
    const [alreadySubmitted, setisalreadySubmitted] = useState(false); // This is for only one submission
    const [showSuccessModal, setShowSuccessModal] = useState(false); // This is for pop out ui
    const [submissionData, setSubmissionData] = useState(null); // To show submission stats
    const [aiResponse, setAiResponse] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);
    const responseEndRef = useRef(null);
    const [leftActiveTab, setLeftActiveTab] = useState("description");

    const hDividerRef = useRef();
    const vDividerRef = useRef();
    const rootRef = useRef(null);
    const videoRef = useRef(null);

    const preventTabSwitch = useCallback((e) => {
        if (e.key === 'Tab' && e.ctrlKey) {
            e.preventDefault();
        }
    }, []);

    const handleExitTestMode = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsTestMode(false);
    };

    useEffect(() => {
        responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiResponse]);

    const handleTestMode = () => {
        const element = rootRef.current;
        if (element) {
            element.requestFullscreen().then(() => {
                setIsTestMode(true);
            }).catch(err => {
                console.error("Error attempting to enable fullscreen mode:", err);
                setIsTestMode(true);
            });
        }
    };


    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsTestMode(false);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        if (isTestMode) {
            document.addEventListener('keydown', preventTabSwitch);
        } else {
            document.removeEventListener('keydown', preventTabSwitch);
        }

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', preventTabSwitch);
        };
    }, [isTestMode, preventTabSwitch]);

    const stopCameraTracks = (stream) => {
        if (stream && typeof stream.getTracks === 'function') {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        let currentStream = null;

        const startCamera = async () => {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                currentStream = newStream;

                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                    videoRef.current.play().catch(e => console.error("Video play failed:", e));
                }

                setCameraStream(newStream);
            } catch (err) {
                console.error("Error accessing camera:", err);
                toast.error("Camera access denied or failed. Please check permissions.");
                setCameraStream(null);
            }
        };

        if (isTestMode) {
            startCamera();
        }

        return () => {
            if (cameraStream) {
                stopCameraTracks(cameraStream);
                setCameraStream(null);
            }
            if (currentStream) {
                stopCameraTracks(currentStream);
            }
        };
    }, [isTestMode]);

    const handleHorizontalSplitMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const initialLeftWidth = leftWidth;
        const topContainer = hDividerRef.current.parentElement;
        const containerWidth = topContainer.offsetWidth;

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newWidthPx = (initialLeftWidth / 100) * containerWidth + deltaX;
            const newLeftWidth = (newWidthPx / containerWidth) * 100;
            setLeftWidth(Math.min(70, Math.max(30, newLeftWidth)));
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleVerticalSplitMouseDown = (e) => {
        e.preventDefault();
        const startY = e.clientY;
        const initialEditorHeight = editorHeight;
        const editorContainer = vDividerRef.current.parentElement;
        const containerHeight = editorContainer.offsetHeight;

        const handleMouseMove = (e) => {
            const deltaY = e.clientY - startY;
            const newHeightPx = (initialEditorHeight / 100) * containerHeight + deltaY;
            const newEditorHeight = (newHeightPx / containerHeight) * 100;
            setEditorHeight(Math.min(90, Math.max(50, newEditorHeight)));
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/questions/questions/${id}`, {
                    withCredentials: true
                }
                );

                const data = res.data.question || res.data;

                if (!data)
                    throw new Error("Failed to fetch problem");

                setProblem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000)
            }
        };
        fetchProblem();
    }, [id]);


    const handleRunCode = async () => {
        if (!languageId) {
            toast.error("Please select a language first.");
            return;
        }

        try {
            setIsRunning(true);
            setTestResults(null);

            const body = {
                question_no: problem._id,
                source_code: code,
                language_id: languageId,
                test_cases: problem.testCases
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/questions/run-question`, body, {
                withCredentials: true
            });

            if (!response.data.allPassed) {
                setenableSubmit(true);
                toast.error("Some of the test cases have not passed.Please optimise your code and try again.")
            }

            if (response.data.allPassed) {
                setenableSubmit(false);
                toast.success("Congratulations. All test cases passed . You can submit your answer now ...")
            }

            setTestResults(response.data);

            const errors = response.data.results
                .map(r => r.stderr)
                .filter(Boolean)
                .join("\n");

            setConsoleOutput(errors || "> Program executed successfully with no errors.");
            setActiveTab("output");

        } catch (err) {
            toast.error(err.response.data.message);
            console.error(err);
        } finally {
            setIsRunning(false);
        }
    };


    const handleSubmitSolution = async () => {
        if (enableSubmit) {
            toast.info("Please pass all test cases to submit code");
            return;
        };

        if (alreadySubmitted) {
            toast.info("Already submitted. You can submit final submission only once . ");
            return;
        }

        try {
            setisSubmitting(true);

            const body = {
                question_no: problem._id,
                source_code: code,
                language_id: languageId,
                test_cases: problem.testCases
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/questions/submit-question`, body, {
                withCredentials: true
            });


            if (response.data.success && response.data.allPassed) {
                setSubmissionData(response.data);
                setQuestionCompleted(true)
                toast.success(response.data.message);
                setShowSuccessModal(true);
                setisalreadySubmitted(true);
            }

            setisSubmitting(false);

            const errors = response.data.results
                .map(r => r.stderr)
                .filter(Boolean)
                .join("\n");

            setConsoleOutput(errors || "> Program executed successfully with no errors.");

        } catch (error) {

            toast.error("Code Submission Failed . Try again later");
            console.error(error);
        } finally {
            setisSubmitting(false);
        }
    }

    if (loading)
        return <Loader />

    if (error)
        return <p className="text-red-500 p-6">Error: {error}</p>;

    if (!problem)
        return null;

    const helpfulAI = async () => {
        try {
            setAiResponse("");
            setShowAiPanel(true);
            setIsAiLoading(true);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/ai-help`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ source_code: code, problem })
            })

            if (!response.ok)
                throw new Error("Failed to fetch AI help");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            setIsAiLoading(false);

            let result = "";

            while (true) {
                const { value, done } = await reader.read();

                if (done)
                    break;
                result = result + decoder.decode(value).replace(/<thought>[\s\S]*?<\/thought>/g, "");

                const chunk = decoder.decode(value, { stream: true });
                setAiResponse((prev) => prev + chunk);

            }
        } catch (error) {
            console.log(error);
            toast.error("AI Assistant is currently unavailable.Try again later : ", error);
            setIsAiLoading(false);
        }
    }

    return (
        <div ref={rootRef} className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

            <header className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 z-10">
                <div className="flex items-center space-x-4">
                    <Link to="/problems">
                        <Button
                            className="group flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white truncate max-w-xs md:max-w-xl">
                        {problem.title}
                    </h1>
                    {getDifficultyBadge(problem.difficultyLevel)}
                </div>

                <div className="flex items-center space-x-3">
                    <CountUpTimer maxTime={maxTime} />

                    <Button
                        className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-md transition duration-200 shadow-md flex items-center border-none"
                        onClick={helpfulAI}
                    >
                        <SparklesIcon className="w-5 h-5 mr-2 animate-pulse-slow" />
                    </Button>

                    {isTestMode ? (
                        <Button
                            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-200 shadow-md flex items-center"
                            onClick={handleExitTestMode}
                        >
                            <XCircleIcon className="w-5 h-5 mr-1" />
                            Exit Test Mode
                        </Button>
                    ) : (
                        <Button
                            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-600 text-gray-800 font-medium rounded-md transition duration-200 shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                            onClick={isAuthenticated ? handleTestMode : null}
                            disabled={!isAuthenticated}
                        >
                            Test Mode
                        </Button>
                    )}
                    <Button
                        className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200 shadow-md flex items-center justify-center min-w-[100px] disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={isAuthenticated ? handleRunCode : null}
                        disabled={!isAuthenticated}
                    >
                        {isRunning ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w- text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Running...
                            </>
                        ) : (
                            "Run Code"
                        )}
                    </Button>
                    <Button
                        className="px-5 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmitSolution}
                        disabled={enableSubmit || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w- text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting ...
                            </>
                        ) : (
                            "Submit Code"
                        )}
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 h-full overflow-hidden">
                <div
                    className="bg-white dark:bg-gray-800 flex flex-col overflow-hidden transition-all duration-100 ease-linear flex-shrink-0"
                    style={{ width: `${leftWidth}%` }}
                >

                    <div className="flex px-6 pt-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
                        <button
                            onClick={() => setLeftActiveTab("description")}
                            className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${leftActiveTab === "description"
                                ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                                : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setLeftActiveTab("discussion")}
                            className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${leftActiveTab === "discussion"
                                ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                                : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Discussion
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {leftActiveTab === "description" ? (
                            <>
                                <section className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-4 border-indigo-500/50 inline-block pb-1">
                                        Problem Statement
                                    </h2>
                                    <div
                                        className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed text-base"
                                        dangerouslySetInnerHTML={{ __html: problem.description }}
                                    />
                                </section>

                                <section className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Details & Constraints</h3>

                                    {problem.constraints?.length > 0 && (
                                        <Card className="p-4 mb-4 bg-gray-50 dark:bg-gray-900 border-l-4 border-yellow-500 rounded-lg shadow-sm">
                                            <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2">Constraints</h4>
                                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                                {problem.constraints.map((c, idx) => (
                                                    <li key={idx}>{c}</li>
                                                ))}
                                            </ul>
                                        </Card>
                                    )}

                                    <Card className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-2">Stats</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <p><strong>Rating:</strong> <span className="text-yellow-500">{problem.ratingLevel} / 5</span></p>
                                            <p><strong>Accepted Rate:</strong> <span className="text-green-500">{problem.acceptedRate}%</span></p>
                                            <p><strong>Max Time:</strong> {maxTime} mins</p>
                                        </div>
                                    </Card>
                                </section>
                            </>
                        ) : (
                            <div className="animate-fadeIn">
                                <Discussion problemId={id} user={user} />
                            </div>
                        )}
                    </div>
                </div>

                <div
                    ref={hDividerRef}
                    onMouseDown={handleHorizontalSplitMouseDown}
                    className="w-2 bg-gray-200 dark:bg-gray-700 cursor-col-resize flex justify-center items-center group transition duration-150"
                >
                    <div className="w-1 h-10 bg-indigo-500 dark:bg-indigo-400 rounded-full group-hover:h-16 transition-all duration-150"></div>
                </div>

                <div className="flex-1 bg-gray-50 dark:bg-gray-950 flex flex-col h-full overflow-hidden">
                    <div className="flex-shrink-0 overflow-hidden" style={{ height: `${editorHeight}%` }}>
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            languages={problem.languagesAvailableIn}
                            setLanguageId={setLanguageId}
                            height="400px"
                        />
                    </div>

                    <div
                        ref={vDividerRef}
                        onMouseDown={handleVerticalSplitMouseDown}
                        className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize flex justify-center items-center group transition duration-150"
                    >
                        <div className="h-1 w-10 bg-indigo-500 dark:bg-indigo-400 rounded-full group-hover:w-16 transition-all duration-150"></div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex px-4 pt-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 flex-shrink-0">
                            {["tests", "output", "console"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-semibold transition duration-200 rounded-t-lg ${activeTab === tab
                                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-800"
                                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                                        }`}
                                >
                                    {tab === "tests" ? "Test Cases" : tab === "output" ? "Result" : "Debug Console"}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800 text-sm">
                            {activeTab === "tests" && (
                                <div className="h-full flex flex-col">
                                    {problem.testCases?.length > 0 ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-md font-semibold text-gray-900 dark:text-white">Test Cases</h3>
                                            </div>

                                            <div className="flex gap-2">
                                                {problem.testCases.slice(0, 3).map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedTestCase(idx)}
                                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${selectedTestCase === idx
                                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500"
                                                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        Case {idx + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="space-y-4 pt-2">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Input</p>
                                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                                                        <pre className="whitespace-pre-wrap">{problem.testCases[selectedTestCase].input}</pre>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Expected Output</p>
                                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                                                        <pre className="whitespace-pre-wrap">{problem.testCases[selectedTestCase].output}</pre>
                                                    </div>
                                                </div>
                                            </div>

                                            {problem.testCases.length > 3 && (
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic mt-4">
                                                    * Showing first 3 test cases. More cases will be checked on submission.
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 italic">
                                            No example test cases available.
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "output" && (
                                <div className="h-full space-y-4">
                                    {!testResults ? (
                                        <div className="flex flex-col items-center justify-center h-full space-y-2 py-20">
                                            <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-700">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400">Run your code to see results here.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">

                                            <div className={`p-4 rounded-lg border ${testResults.allPassed ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                                                <h3 className={`text-xl font-bold ${testResults.allPassed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {testResults.allPassed ? 'Accepted' : 'Wrong Answer'}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {testResults.results.filter(r => r.passed).length} / {testResults.results.length} Test Cases Passed
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                {testResults.results.map((res, index) => (
                                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                        <div className={`px-4 py-2 flex justify-between items-center ${res.passed ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-red-50/50 dark:bg-red-900/10'}`}>
                                                            <span className={`font-semibold ${res.passed ? 'text-green-600' : 'text-red-500'}`}>
                                                                Case {index + 1}: {res.status}
                                                            </span>
                                                        </div>

                                                        <div className="p-4 bg-white dark:bg-gray-800 space-y-3">
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Actual Output</p>
                                                                <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-100 dark:border-gray-700 font-mono text-xs">
                                                                    {res.stdout || (res.stderr ? <span className="text-red-400">{res.stderr}</span> : "No Output")}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "console" && (
                                <div className="h-full flex flex-col bg-gray-950 rounded-lg overflow-hidden border border-gray-800 shadow-2xl">


                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">bash — debug_logs</span>
                                    </div>


                                    <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                                        {consoleOutput ? (
                                            <div className="space-y-1">
                                                <p className="text-gray-500 italic mb-2">Backend Debug Output :</p>
                                                <pre className={`whitespace-pre-wrap ${consoleOutput.includes('Error') || consoleOutput.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
                                                    {consoleOutput}
                                                </pre>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-gray-600">
                                                <span className="mr-2 text-indigo-500">➜</span>
                                                <span className="animate-pulse">_</span>
                                                <span className="ml-2 italic text-gray-500">Ready to execute...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isTestMode && (
                <Card className="fixed bottom-4 left-4 z-40 p-1 rounded-lg shadow-2xl border-2 border-indigo-600 dark:border-indigo-400 bg-black/80 backdrop-blur-sm">
                    <video
                        ref={videoRef}
                        className="rounded-lg w-48 h-33 object-cover"
                        playsInline
                        autoPlay
                        muted
                        style={{ display: cameraStream ? 'block' : 'none' }}
                    />

                    {!cameraStream && (
                        <div className="w-48 h-36 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400 text-xs text-center p-2">
                            <StopCircleIcon className="w-5 h-5 mr-1 text-red-500" />
                            Waiting for Camera...
                        </div>
                    )}
                </Card>
            )}

            {time > maxTime && (
                <div className="absolute bottom-0 right-0 m-4 p-3 bg-red-600 text-white rounded-lg shadow-xl font-medium z-20 transition duration-300">
                    Time limit exceeded! You can no longer submit.
                </div>
            )}

            {showSuccessModal && (
                <ReactConfetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.2}
                    style={{ zIndex: 1000 }}
                />
            )}


            {showSuccessModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20 dark:border-gray-700/50 transform animate-in zoom-in-95 duration-300">

                        <div className="p-8 text-center border-b border-white/10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 backdrop-blur-lg rounded-full mb-4 border border-green-500/30">
                                <CheckCircleIcon className="w-12 h-12 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
                                {submissionData?.status || "Accepted"}
                            </h2>
                            <p className="text-green-400/80 font-medium mt-1">
                                {submissionData?.message}
                            </p>
                        </div>

                        <div className="p-6 bg-white/5 dark:bg-black/10">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1">Problems Solved</p>
                                    <p className="text-2xl font-mono font-bold text-indigo-400">
                                        {submissionData?.userStats?.solvedCount || 0}
                                    </p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1">Current Streak</p>
                                    <p className="text-2xl font-mono font-bold text-orange-400">
                                        {submissionData?.userStats?.streak || 0}
                                    </p>
                                </div>
                                <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold mb-1">Acceptance Rate</p>
                                    <p className="text-2xl font-mono font-bold text-green-400">
                                        {submissionData?.userStats?.acceptanceRate || 0}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-4">
                            <button
                                onClick={() => window.location.href = "/problems"}
                                className="w-full py-4 bg-indigo-500/80 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                            >
                                Solve More Problems
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-2 text-white/60 font-medium hover:text-white transition-colors"
                            >
                                Review My Code
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200 dark:border-gray-700 ${showAiPanel ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-indigo-600 text-white">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            <span className="font-bold">AI Coding Coach</span>
                        </div>
                        <button onClick={() => setShowAiPanel(false)} className="hover:bg-indigo-700 p-1 rounded">
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50 dark:bg-gray-900">
                        {isAiLoading ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <p className="text-sm text-gray-500 animate-pulse">Analyzing your code...</p>
                            </div>
                        ) : (
                            <div className="prose dark:prose-invert prose-sm max-w-none text-gray-800 dark:text-gray-200">
                                <div className="whitespace-pre-wrap font-sans leading-relaxed">
                                    {aiResponse || "Click the Sparkle icon to get hints about your current solution!"}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <p className="text-[10px] text-gray-400 text-center">
                            AI may produce inaccuracies. Use hints to improve your logic.
                        </p>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default ProblemDetail;