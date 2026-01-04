import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeftIcon, CommandLineIcon, DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import Card from "../components/Card.jsx";
import { toast } from 'react-toastify';
import Loader from "../components/Loader.jsx"

const SubmissionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/submissions/${id}`, {
                    withCredentials: true
                });
                if (response.data.success) setSubmission(response.data.foundSubmission);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000)
            }
        };
        fetchDetail();
    }, [id]);

    const copyToClipboard = () => {
        window.navigator.clipboard.writeText(submission.sourceCode)
        toast.success("Code copied to clipboard successfully !");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading)
        <Loader />

    if (!submission) return <div className="p-10 text-center">Submission not found</div>;

    const isAccepted = submission.status === 'Accepted';

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-all group"
                >
                    <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to History
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 bg-gray-200/50 dark:bg-gray-800 px-3 py-1 rounded-full">
                        ID: {submission._id}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-8">

                    <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all border border-white/20 ${isAccepted
                            ? 'bg-gradient-to-br from-green-500 to-emerald-700 text-white'
                            : 'bg-gradient-to-br from-red-500 to-rose-700 text-white'
                        }`}>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-sm uppercase tracking-widest font-black opacity-80 mb-2">Submission Result</h2>
                                <h1 className="text-5xl font-black tracking-tight mb-4">{submission.status}</h1>
                                <p className="text-xl font-medium opacity-90">{submission.question_title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-black/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase opacity-70 mb-1">Runtime</p>
                                    <p className="text-lg font-mono font-bold">{submission.totalRuntime}s</p>
                                </div>
                                <div className="text-center border-l border-white/10 pl-4">
                                    <p className="text-[10px] uppercase opacity-70 mb-1">Memory</p>
                                    <p className="text-lg font-mono font-bold">{(submission.totalMemory / 1024).toFixed(1)}MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="rounded-3xl overflow-hidden bg-[#1e1e2e] shadow-2xl border border-gray-800">
                        <div className="bg-[#181825] px-6 py-4 flex justify-between items-center border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <span className="ml-4 text-xs font-mono text-gray-400">solution.txt</span>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg"
                            >
                                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="relative group">
                            <pre className="p-8 text-sm leading-relaxed overflow-x-auto custom-scrollbar text-indigo-100 font-mono">
                                <code className="block">
                                    {submission.sourceCode.split('\n').map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="w-10 shrink-0 text-gray-600 select-none text-right pr-4 italic">{i + 1}</span>
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CommandLineIcon className="w-5 h-5 text-indigo-500" />
                            Testcases
                        </h3>
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-1 rounded">
                            TOTAL: {submission.testResults.length}
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                        {submission.testResults.map((test, index) => (
                            <div key={test._id} className="group relative">
                                <Card className="p-5 border-transparent bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all border border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-500 mb-1 tracking-widest uppercase">Test {index + 1}</p>
                                            <p className={`text-sm font-bold ${test.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {test.status}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-400 text-right leading-tight">
                                            <p>{test.time}s</p>
                                            <p>{(test.memory / 1024).toFixed(1)}MB</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-50 dark:bg-black/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <p className="text-[9px] uppercase font-black text-gray-400 mb-2">Output</p>
                                            <p className="font-mono text-xs text-gray-600 dark:text-gray-300 break-all leading-tight">
                                                {test.stdout || <span className="italic opacity-50">Empty stdout</span>}
                                            </p>
                                        </div>

                                        {test.stderr && (
                                            <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-100 dark:border-rose-900/20">
                                                <p className="text-[9px] uppercase font-black text-rose-400 mb-1">Standard Error</p>
                                                <p className="font-mono text-xs text-rose-600 dark:text-rose-300 break-all">{test.stderr}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetails;