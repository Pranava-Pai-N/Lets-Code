import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from "@heroicons/react/24/outline";
import Card from "../components/Card.jsx";
import { useNavigate } from 'react-router-dom';
import Loader from "../components/Loader.jsx"

const SubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCode, setSelectedCode] = useState(null);
    const navigate = useNavigate();

    if(loading)
        <Loader />

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/submissions`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    setSubmissions(response.data.submissions);
                }

            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000)
            }
        };
        fetchSubmissions();
    }, []);

    const getStatusStyle = (status) => {
        return status === 'Accepted'
            ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
            : 'text-red-600 bg-red-50 dark:bg-red-900/20';
    };

    return (
        <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">My Submissions</h1>
                <p className="text-gray-500 dark:text-gray-400">History of all your code attempts</p>
            </header>
            {submissions.length == 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Please submit aleast one submission to view your submissions. Currently empty</p>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">All your {`${submissions.length}`} submissions</p>
            )}

            <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Problem</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Runtime</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Memory</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="p-8 bg-gray-50/50 dark:bg-gray-900/20" />
                                    </tr>
                                ))
                            ) : submissions.map((sub) => (
                                <tr key={sub._id} onClick={() => navigate(`/submissions/${sub._id}`)} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                    <td className="p-4">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(sub.status)}`}>
                                            {sub.status === 'Accepted' ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                            {sub.status}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 dark:text-white">{sub.question_title}</p>
                                        <p className="text-[10px] text-gray-400 font-mono">ID: {sub.problem.slice(-6)}</p>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                                        {sub.totalRuntime}s
                                    </td>
                                    <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                                        {(sub.totalMemory / 1024).toFixed(1)} MB
                                    </td>
                                    <td className="p-4 text-xs text-gray-500">
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCode(sub);
                                            }}
                                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 rounded-lg transition-all"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {selectedCode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <Card className="w-full max-w-3xl max-h-[80vh] flex flex-col bg-white dark:bg-gray-900 overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg dark:text-white">{selectedCode.question_title}</h3>
                                <p className="text-xs text-gray-500">Submitted on {new Date(selectedCode.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedCode(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-black/40">
                            <pre className="font-mono text-sm text-gray-800 dark:text-gray-300 leading-relaxed">
                                <code>{selectedCode.sourceCode}</code>
                            </pre>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                            <button
                                onClick={() => setSelectedCode(null)}
                                className="px-6 py-2 bg-gray-900 dark:bg-white dark:text-black text-white rounded-lg font-bold text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SubmissionsPage;