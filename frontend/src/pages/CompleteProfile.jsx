import React, { useState , useEffect } from 'react';
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
    const { user , setUser } = useAuth();
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

        if(!githubregex.test(formData.github)){
            toast.error("Please enter a valid Github url.");
            setLoading(false);
            return;
        }

        if(formData.linkedin !== '' &&!linkedinregex.test(formData.linkedin)){
            toast.error("Please enter a valid Linkedin url.");
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
            console.log(err)
            toast.error(err.response?.data?.message || "Transmission Failed");
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
    if(user && user.profileCompleted){
        setTimeout(() => {
            navigate("/profile",{ replace : true });
        },2000)
    }
},[user , navigate])

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(20,184,166,0.05)_0%,_transparent_50%)] pointer-events-none"></div>

            <div className="w-full max-w-5xl bg-gray-900/30 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 md:p-14 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-20 animate-scan"></div>

                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-[2px] w-12 bg-teal-500"></div>
                        <span className="text-teal-500 font-mono text-xs tracking-[0.5em] uppercase">Security Clearance: Level 1</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        Digital<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-pink-500"> Avatar</span>
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputGroup label="Age" icon={CalendarIcon}>
                                <input 
                                    type="number" name="age" required placeholder="Lifecycle Count" 
                                    className="w-full bg-white/5 border-b-2 border-teal-500/20 px-0 py-3 focus:border-pink-500 outline-none transition font-mono text-xl"
                                    onChange={handleChange} value={formData.age}
                                />
                            </InputGroup>
                            <InputGroup label="College Name" icon={AcademicCapIcon}>
                                <input 
                                    type="text" name="collegeName" required placeholder="College Name" 
                                    className="w-full bg-white/5 border-b-2 border-teal-500/20 px-4 py-3 focus:border-pink-500 outline-none transition font-mono"
                                    onChange={handleChange} value={formData.collegeName}
                                />
                            </InputGroup>
                        </div>

                        <InputGroup label="Tech Stack (Comma Separated)" icon={CodeBracketIcon}>
                            <input 
                                name="languagesProficient" required placeholder="React, Node, C++"
                                className="w-full bg-white/5 border-b-2 border-teal-500/20 px-4 py-3 focus:border-pink-500 outline-none transition font-mono"
                                onChange={handleChange} value={formData.languagesProficient}
                            />
                        </InputGroup>

                        <InputGroup label="Targeting Companies" icon={BriefcaseIcon}>
                            <input 
                                name="targetingCompanies" placeholder="Google, NVIDIA, Apple"
                                className="w-full bg-white/5 border-b-2 border-teal-500/20 px-4 py-3 focus:border-pink-500 outline-none transition font-mono"
                                onChange={handleChange} value={formData.targetingCompanies}
                            />
                        </InputGroup>

                        <InputGroup label="Core Interests / Domains" icon={HeartIcon}>
                            <input 
                                name="interests" required placeholder="Web3, AI, CyberSec, Low-Level"
                                className="w-full bg-white/5 border-b-2 border-teal-500/20 px-4 py-3 focus:border-pink-500 outline-none transition font-mono"
                                onChange={handleChange} value={formData.interests}
                            />
                        </InputGroup>
                        <p className="text-[10px] text-gray-500 font-mono text-center" onClick={() => navigate("/profile")}>
                                Profile Completed ?
                            </p>
                    </div>

                    <div className="flex flex-col justify-between space-y-8">
                        <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-4 flex items-center">
                                <GlobeAltIcon className="w-4 h-4 mr-2" /> Social Connects
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {['github', 'linkedin', 'twitter', 'portfolio'].map((social) => (
                                    <div key={social} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-2 border border-transparent focus-within:border-teal-500/30 transition">
                                        <LinkIcon className="h-4 w-4 text-pink-500" />
                                        <input 
                                            type="url" name={social} placeholder={`${social.toUpperCase()} URL`}
                                            className="w-full bg-transparent text-sm font-mono outline-none py-1"
                                            required={social === 'github'}
                                            onChange={handleChange} value={formData[social]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] text-gray-500 font-mono text-center">
                                By clicking initialize, you agree to sync your technical data with the platform . &copy; Terms and Conditions apply.
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative flex items-center justify-center px-8 py-6 font-black uppercase tracking-[0.3em] bg-white text-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center text-lg">
                                    {loading ? "Completing..." : "Start your journey"}
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