import React, { useState, useEffect } from 'react';
import {
    AcademicCapIcon,
    BriefcaseIcon,
    CodeBracketIcon,
    CalendarIcon,
    LinkIcon,
    HeartIcon,
    GlobeAltIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

const InputGroup = ({ label, children, icon: Icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-pink-500" />}
            {label}
        </label>
        {children}
    </div>
);


const CompleteProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        age: '',
        collegeName: '',
        languagesProficient: '',
        targetingCompanies: '',
        interests: '',
        github: '',
        linkedin: '',
        twitter: '',
        portfolio: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        const githubregex = /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z\d](?:-?[a-zA-Z\d]){0,38})\/?$/;
        const linkedinregex = /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([a-zA-Z0-9](?:-?[a-zA-Z0-9]){2,99})\/?$/;

        if (!githubregex.test(formData.github)) {
            toast.error("Please enter a valid Github url.");
            setLoading(false);
            return;
        }

        if (formData.linkedin !== '' && !linkedinregex.test(formData.linkedin)) {
            toast.error("Please enter a valid Linkedin url.");
            setLoading(false);
            return;
        }

        if (Number(formData.age) < 0 || Number(formData.age) > 100) {
            toast.error("Please enter a valid age.");
            setLoading(false);
            return;
        }


        const payload = {
            age: Number(formData.age),
            collegeName: formData.collegeName,
            languagesProficient: formData.languagesProficient.split(',').map(s => s.trim()).filter(Boolean),
            targetingCompanies: formData.targetingCompanies.split(',').map(s => s.trim()).filter(Boolean),
            interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
            socialLinks: {
                github: formData.github,
                linkedin: formData.linkedin,
                twitter: formData.twitter,
                portfolio: formData.portfolio
            }
        };

        try {
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/complete-profile`,
                payload,
                { withCredentials: true });


            if (res.data.success) {
                toast.success(res.data.message);
                setUser(res.data.user);
                navigate("/dashboard");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Transmission Failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.profileCompleted) {
            setTimeout(() => {
                navigate("/profile", { replace: true });
            }, 2000)
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none"></div>

            <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-14 shadow-xl shadow-indigo-100/50 relative z-10">

                <header className="mb-12 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                        <span className="text-indigo-600 font-bold text-[10px] tracking-[0.2em] uppercase">Step 2: Profile Setup</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Complete Your <span className="text-indigo-600">Profile</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Let us know a bit more about your technical background.</p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Age</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="number" name="age" required placeholder="Years"
                                        className="w-full bg-transparent py-3 outline-none font-semibold text-gray-700"
                                        onChange={handleChange} value={formData.age}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">College</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                                    <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text" name="collegeName" required placeholder="College Name"
                                        className="w-full bg-transparent py-3 outline-none text-sm font-medium"
                                        onChange={handleChange} value={formData.collegeName}
                                    />
                                </div>
                            </div>
                        </div>

                        <InputGroup label="Tech Stack (Comma Seperated)" icon={CodeBracketIcon}>
                            <input
                                name="languagesProficient" required placeholder="e.g. React, Node.js, Python"
                                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition shadow-sm"
                                onChange={handleChange} value={formData.languagesProficient}
                            />
                        </InputGroup>

                        <InputGroup label="Targeting Companies (Comma Seperated)" icon={BriefcaseIcon}>
                            <input
                                name="targetingCompanies" placeholder="e.g. Google, Facebook, Netflix"
                                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition shadow-sm"
                                onChange={handleChange} value={formData.targetingCompanies}
                            />
                        </InputGroup>

                        <InputGroup label="Core Interests (Comma Seperated)" icon={HeartIcon}>
                            <input
                                name="interests" required placeholder="e.g. BlockChain, Web3, AI"
                                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition shadow-sm"
                                onChange={handleChange} value={formData.interests}
                            />
                        </InputGroup>

                        <button type="button" onClick={() => navigate("/profile")} className="block text-center w-full text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium">
                            Already completed? Go to Profile
                        </button>
                    </div>

                    <div className="flex flex-col justify-between space-y-8">
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center">
                                <GlobeAltIcon className="w-4 h-4 mr-2" /> Digital Presence
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {['github', 'linkedin', 'twitter', 'portfolio'].map((social) => (
                                    <div key={social} className="flex items-center gap-4 bg-white rounded-xl px-4 py-1 border border-gray-200 focus-within:border-indigo-500 transition-all shadow-sm">
                                        <LinkIcon className="h-4 w-4 text-indigo-400" />
                                        <input
                                            type="url" name={social} placeholder={`${social.charAt(0).toUpperCase() + social.slice(1)} URL`}
                                            className="w-full bg-transparent text-sm outline-none py-3 text-gray-600"
                                            required={social === 'github'}
                                            onChange={handleChange} value={formData[social]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed italic">
                                By clicking finish, you agree to our terms of service regarding data synchronization.
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative flex items-center justify-center px-8 py-6 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all duration-300"
                            >
                                <span className="flex items-center text-lg">
                                    {loading ? "Saving..." : "Finish Setup"}
                                    {!loading && <RocketLaunchIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;