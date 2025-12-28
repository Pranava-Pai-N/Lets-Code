import React, { useState } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


const NeonInput = ({ id, name, type = 'text', label, placeholder, value, onChange, required = false, disabled = false, Icon }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-pink-500" />}
            {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className="block w-full px-4 py-3 bg-gray-900/80 border-2 border-teal-500/50 text-white placeholder-gray-500 rounded-lg shadow-xl shadow-teal-500/10 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-300 ease-in-out font-mono text-base disabled:opacity-50"
            />
        </div>
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match the sequence.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                profileUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.userName)}&background=4F46E5&color=fff&size=150`
            });


            if (response.data.success) {
                toast.success(response.data.message);
                setIsEmailSent(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
            toast.error(err.response?.data?.message || "Connection Error");
        } finally {
            setLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-gray-900/95 p-8 rounded-2xl border-2 border-teal-500/30 text-center space-y-6">
                    <div className="inline-flex p-4 rounded-full bg-teal-500/10 border-2 border-teal-500 animate-bounce">
                        <EnvelopeIcon className="h-12 w-12 text-teal-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Check your Inbox</h2>
                    <p className="text-gray-400 font-mono"> We've sent a verification link to <span className="text-pink-400">{formData.email}</span>. Activate your account to enter the matrix.</p>
                    <button onClick={() => navigate("/login")} className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition">
                        RETURN TO LOGIN
                    </button>
                </div>
            </div>
        );
    }

    const handleGoogleLogin = () => {
       window.location.href = `${import.meta.env.VITE_BACKEND_URL}/users/google-auth`
    };

    
    const handleGitHubLogin = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/users/github-auth`
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl"></div>
            </div>

            <div className="w-full max-w-lg bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 sm:p-12 shadow-[0_0_50px_rgba(52,211,217,0.2)] border-2 border-teal-500/30 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-teal-500/10 rounded-xl border border-teal-500/50 mb-4">
                        <RocketLaunchIcon className="h-10 w-10 text-pink-500" />
                    </div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-pink-500 uppercase tracking-tighter">
                        Initialize Your Account
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-2">Step 1: Establish Authentication</p>
                </div>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-teal-500/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#050505] px-4 text-gray-500 font-mono tracking-[0.3em]">
                            Authentication Uplinks
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="group relative flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
                        />
                        <span className="text-sm font-bold tracking-widest text-gray-300 group-hover:text-white font-mono">
                            Google
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleGitHubLogin}
                        className="group relative flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                            alt="GitHub"
                            className="h-5 w-5 mr-3 invert transition-transform group-hover:scale-110"
                        />
                        <span className="text-sm font-bold tracking-widest text-gray-300 group-hover:text-white font-mono">
                            Github
                        </span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 text-xs font-bold text-red-400 bg-red-900/20 border border-red-500 rounded flex items-center">
                            <ShieldCheckIcon className="h-4 w-4 mr-2" /> {error}
                        </div>
                    )}

                    <NeonInput id="userName" name="userName" label="Codename" placeholder="eg: terminal_warrior" value={formData.userName} onChange={handleChange} Icon={UserIcon} required />
                    <NeonInput id="email" name="email" type="email" label="Email" placeholder="johndoe@gmail.com" value={formData.email} onChange={handleChange} Icon={EnvelopeIcon} required />

                    <div className="grid grid-cols-1 gap-4">
                        <NeonInput id="password" name="password" type="password" label="Password" placeholder="Min 8 Characters" value={formData.password} onChange={handleChange} Icon={LockClosedIcon} required />
                        <NeonInput id="confirmPassword" name="confirmPassword" type="password" label="Confirm" placeholder="Retype your password" value={formData.confirmPassword} onChange={handleChange} Icon={LockClosedIcon} required />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 mt-4 rounded-xl text-white font-black tracking-widest transition-all transform active:scale-95 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20 hover:brightness-110'}`}
                        disabled={loading}
                    >
                        {loading ? "INITIALIZING..." : "GENERATING IDENTITY"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-mono text-gray-500">
                    Already a member? <Link to="/login" className="text-pink-500 hover:underline">ACCESS TERMINAL</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;