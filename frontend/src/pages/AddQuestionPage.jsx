import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import MonacoEditor from 'react-monaco-editor';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, Clock, Cpu, Tag, Trash2, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from "react-toastify";


const difficultyOptions = ['easy', 'medium', 'hard'];
const ratingOptions = [1, 2, 3, 4, 5];
const complexityOptions = ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)', 'O(N!)'];


const DynamicListInput = ({ title, items, setItems, placeholder, Icon }) => {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (indexToRemove) => {
        setItems(items.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-3 p-5 bg-gray-50 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-indigo-200/50 dark:border-indigo-900/50 shadow-inner shadow-indigo-500/10">
            <label className="flex items-center text-lg font-extrabold text-gray-900 dark:text-white">
                <Icon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                {title}
            </label>
            <div className="flex space-x-3">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    placeholder={placeholder}
                    className="flex-1 px-5 py-3 border-2 border-indigo-400/50 rounded-xl focus:ring-indigo-600 focus:border-indigo-600 dark:bg-gray-900 dark:border-indigo-800 dark:text-gray-100 transition duration-300 transform hover:scale-[1.01] focus:scale-[1.01]"
                />
                <Button
                    type="button"
                    onClick={addItem}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-md font-bold transition duration-300 shadow-lg hover:shadow-xl shadow-indigo-500/50"
                >
                    <PlusCircle className="w-5 h-5 mr-1" /> Add
                </Button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2 p-1">
                {items.map((item, index) => (
                    <span key={index} className="inline-flex items-center text-sm mr-2 p-2 px-4 rounded-full bg-indigo-500/10 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/30 dark:border-indigo-700/50 transition duration-200 hover:bg-indigo-500/20 dark:hover:bg-indigo-800/50">
                        {item}
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="ml-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition duration-150"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};


const AddQuestionPage = () => {
    const initialState = {
        title: '',
        description: '',
        difficultyLevel: 'medium',
        testCases: [{ input: "[]", output: "0", isExample: true }],
        topicsList: [],
        ratingLevel: 3,
        constraints: [],
        expectedTimeComplexity: complexityOptions[3],
        expectedSpaceComplexity: complexityOptions[0],
        acceptedRate: 50,
        isDailyQuestion: false
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [activeTab, setActiveTab] = useState('details');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.testCases];
        newTestCases[index][field] = value;
        setFormData(prev => ({ ...prev, testCases: newTestCases }));
    };

    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            testCases: [...prev.testCases, { input: '', output: '', isExample: false }],
        }));
    };

    const removeTestCase = (index) => {
        setFormData(prev => ({
            ...prev,
            testCases: prev.testCases.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', type: '' });

        const dataToSend = {
            ...formData,
            difficultyRating: formData.ratingLevel
        };

        try {
            const _res = await axios.post(
                `/api/questions/post-question`,
                dataToSend,{
                    withCredentials : true
                }
            );


            setStatus({
                message: `Question posted successfully!. Redirecting...`,
                type: 'success'
            });

            setFormData(initialState);

            setTimeout(() => {
                navigate("/problems")
            }, 3000)

        } catch (err) {
            toast.error(err.response.data.message);
            const errorMessage = err.response?.data?.message || err.message;
            setStatus({
                message: `Error posting question: ${errorMessage}`,
                type: 'error'
            });

        } finally {
            setLoading(false);
        }
    };

    const statusClasses = status.type === 'success'
        ? 'bg-green-600/10 text-green-400 dark:bg-green-900/20 border-green-600/50 dark:border-green-800'
        : 'bg-red-600/10 text-red-400 dark:bg-red-900/20 border-red-600/50 dark:border-red-800';

    const difficultyColor = (level) => {
        switch (level) {
            case 'easy': return 'text-green-500 border-green-500';
            case 'medium': return 'text-yellow-500 border-yellow-500';
            case 'hard': return 'text-red-500 border-red-500';
            default: return 'text-gray-500 border-gray-500';
        }
    };

    const renderDetailsTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            <div className="space-y-8 p-6 bg-gray-900/5 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-gray-500/5 dark:shadow-indigo-500/5">
                <h3 className="flex items-center text-2xl font-black text-gray-900 dark:text-white border-b border-indigo-500/50 pb-3">
                    Core Question Data
                </h3>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Problem Title <Zap className="w-4 h-4 inline ml-1 text-yellow-500" /></label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., The Great Two Sum Challenge"
                            className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 shadow-md transition duration-300 focus:shadow-indigo-500/30"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="difficultyLevel" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                            <select
                                id="difficultyLevel"
                                name="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={handleChange}
                                required
                                className={`w-l px-5 py-3 border-2 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 font-bold transition duration-200 ${difficultyColor(formData.difficultyLevel)} ${formData.difficultyLevel === 'easy' ? 'border-green-500/50' : formData.difficultyLevel === 'medium' ? 'border-yellow-500/50' : 'border-red-500/50'}`}
                            >
                                {difficultyOptions.map(level => <option key={level} value={level} className="bg-white dark:bg-gray-900">{level.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ratingLevel" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Rating (1-5)
                            </label>
                            <select
                                id="ratingLevel"
                                name="ratingLevel"
                                value={formData.ratingLevel}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 font-bold"
                            >
                                {ratingOptions.map(rating => (
                                    <option key={rating} value={rating} className="bg-white dark:bg-gray-900">
                                        {rating} {Array(rating).fill('').join('')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="acceptedRate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Success Rate (%)</label>
                            <input
                                type="number"
                                id="acceptedRate"
                                name="acceptedRate"
                                value={formData.acceptedRate}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                required
                                className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="expectedTimeComplexity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time Complexity <Clock className="w-4 h-4 inline ml-1 text-blue-500" /></label>
                            <select
                                id="expectedTimeComplexity"
                                name="expectedTimeComplexity"
                                value={formData.expectedTimeComplexity}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 font-mono font-bold"
                            >
                                {complexityOptions.map(comp => <option key={comp} value={comp} className="bg-white dark:bg-gray-900">{comp}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="expectedSpaceComplexity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Space Complexity <Cpu className="w-4 h-4 inline ml-1 text-purple-500" /></label>
                            <select
                                id="expectedSpaceComplexity"
                                name="expectedSpaceComplexity"
                                value={formData.expectedSpaceComplexity}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 font-mono font-bold"
                            >
                                {complexityOptions.map(comp => <option key={comp} value={comp} className="bg-white dark:bg-gray-900">{comp}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center pt-4 p-3 bg-indigo-500/10 dark:bg-indigo-900/10 rounded-xl border border-indigo-500/20">
                        <input
                            type="checkbox"
                            id="isDailyQuestion"
                            name="isDailyQuestion"
                            checked={formData.isDailyQuestion}
                            onChange={handleChange}
                            className="h-6 w-6 text-indigo-600 border-indigo-300 rounded-lg focus:ring-indigo-500 dark:bg-gray-700 dark:border-indigo-600 transform scale-110"
                        />
                        <label htmlFor="isDailyQuestion" className="ml-3 block text-lg font-bold text-gray-800 dark:text-gray-200">
                            Mark as Daily Challenge
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <DynamicListInput
                    title="Topics/Tags"
                    items={formData.topicsList}
                    setItems={(newItems) => setFormData(prev => ({ ...prev, topicsList: newItems }))}
                    placeholder="e.g., Dynamic Programming, Arrays"
                    Icon={Tag}
                />

                <DynamicListInput
                    title="Constraints"
                    items={formData.constraints}
                    setItems={(newItems) => setFormData(prev => ({ ...prev, constraints: newItems }))}
                    placeholder="e.g., 0 <= nums.length <= 10^5"
                    Icon={Zap}
                />
            </div>

            <div className="md:col-span-2 space-y-4 pt-4">
                <label htmlFor="description" className="block text-xl font-black text-gray-900 dark:text-white flex items-center">
                    Problem Description
                </label>
                <MonacoEditor
                    width="100%"
                    height="400"
                    language="markdown"
                    theme="vs-dark"
                    value={formData.description}
                    onChange={(newValue) => setFormData(prev => ({ ...prev, description: newValue }))}
                    options={{
                        selectOnLineNumbers: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: 'on'
                    }}
                    className="rounded-xl shadow-2xl overflow-hidden border border-indigo-500/50"
                />
            </div>
        </div>
    );

    const renderTestCasesTab = () => (
        <div className="space-y-8">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center border-b border-indigo-500/50 pb-3">
                <Cpu className="w-6 h-6 mr-2 text-indigo-500" /> System Test Cases Configuration
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-300/50 dark:border-gray-700/50">
                Define the Input and Expected Output for verification. Remember to mark at least one case as an **Example** for public visibility.
            </p>

            <div className="max-h-[65vh] overflow-y-auto pr-3 space-y-6">
                {formData.testCases.map((tc, index) => (
                    <Card key={index} className="p-6 border-4 border-indigo-500/30 dark:border-indigo-800/50 shadow-2xl shadow-indigo-500/10 space-y-4 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl transition duration-300 hover:border-indigo-500/50">
                        <div className="flex justify-between items-center pb-3 border-b border-indigo-500/20 dark:border-indigo-700/50">
                            <span className="font-extrabold text-xl text-indigo-700 dark:text-indigo-300">Test Case <span className="text-2xl font-black">#{index + 1}</span></span>
                            <div className="flex items-center space-x-6">
                                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 transition duration-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                                    <input
                                        type="checkbox"
                                        checked={tc.isExample}
                                        onChange={(e) => handleTestCaseChange(index, 'isExample', e.target.checked)}
                                        className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="ml-2 font-bold">{tc.isExample ? '' : ''} Example</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeTestCase(index)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-semibold p-2 rounded-full transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed bg-red-100/50 dark:bg-red-900/20"
                                    disabled={formData.testCases.length === 1}
                                >
                                    <Trash2 className="w-5 h-5 inline mr-1" /> Remove Case
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-md font-bold text-gray-500 dark:text-gray-400 mb-2">Input Data <span className="text-red-500">*</span></label>
                                <textarea
                                    value={tc.input}
                                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                    placeholder='e.g., nums = [2,7,11,15], target = 9'
                                    required
                                    rows="5"
                                    className="w-full p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-sm font-mono dark:bg-gray-950 dark:text-gray-100 shadow-inner focus:border-indigo-500 transition duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-md font-bold text-gray-500 dark:text-gray-400 mb-2">Expected Output <span className="text-red-500">*</span></label>
                                <textarea
                                    value={tc.output}
                                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                    placeholder="e.g., [0, 1]"
                                    required
                                    rows="5"
                                    className="w-full p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-sm font-mono dark:bg-gray-950 dark:text-gray-100 shadow-inner focus:border-indigo-500 transition duration-200"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Button
                type="button"
                onClick={addTestCase}
                className="w-full h-20 bg-blue-500/10 hover:bg-red-900/20 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 py-4 text-lg font-extrabold border-2 border-indigo-500/30 dark:border-indigo-700/50 rounded-2xl shadow-lg transition duration-300 transform hover:scale-[1.005]"
            >
                <PlusCircle className="w-6 h-6 mr-2" /> Add a New Test Case
            </Button>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-8 relative">

            <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/pattern-dots.svg')" }}></div>
            </div>

            <Card className="max-w-8xl mx-auto bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-10 space-y-10 rounded-3xl relative z-10 border border-gray-200/50 dark:border-gray-800/50">

                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-300 dark:to-purple-400 border-b-4 border-purple-500/50 pb-4 flex items-center">
                    <Zap className="w-8 h-8 mr-3" />
                    Add a New Coding Problem
                </h1>

                {status.message && (
                    <div className={`p-5 rounded-xl font-extrabold border-2 ${statusClasses} flex items-center transition duration-500 transform ${status.type === 'success' ? 'scale-100' : 'scale-[0.99]'}`}>
                        {status.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <XCircle className="w-6 h-6 mr-3" />}
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">

                    <div className="flex border-b-4 border-gray-200 dark:border-gray-700/50">
                        {[{ id: 'details', label: 'Problem Details & Metadata' }, { id: 'tests', label: 'Test Cases' }].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-4 text-xl font-black transition duration-300 relative group 
                                    ${activeTab === tab.id
                                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800/50 shadow-inner rounded-t-xl"
                                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300 bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-t-xl"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 pt-8">
                        {activeTab === 'details' && renderDetailsTab()}
                        {activeTab === 'tests' && renderTestCasesTab()}
                    </div>

                    <div className="mt-12 pt-8 border-t-2 border-indigo-500/30 dark:border-indigo-700/50">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full max-w-lg mx-auto flex justify-center items-center bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-black text-xl py-4 px-8 rounded-full shadow-[0_10px_30px_rgba(56,189,248,0.7)] hover:shadow-[0_15px_40px_rgba(56,189,248,0.9)] transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin mr-3">🌀</span> Submitting Data ...
                                </>
                            ) : (
                                <>
                                    <Flame className="w-6 h-6 mr-2" /> Finalize & Launch Question
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddQuestionPage;