import React, { useState } from 'react';
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


const NeonInput = ({ id, name, type = "text", label, placeholder, value, onChange, Icon, required }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full group">
            <div className="flex justify-between items-end mb-0.5 px-1">
                <label
                    htmlFor={id}
                    className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] transition-colors group-focus-within:text-indigo-600"
                >
                    {label}
                </label>
                {required && (
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter italic">Required</span>
                )}
            </div>

            <div className="relative isolate">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <Icon className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-indigo-500 transition-all duration-300 group-focus-within:scale-110" />
                    </div>
                )}

                <input
                    id={id}
                    name={name}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`
            w-full py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4
            bg-gray-50/50 border border-gray-200 rounded-xl
            text-[14px] font-semibold text-gray-800
            placeholder:text-gray-400 placeholder:font-normal
            outline-none transition-all duration-300 ease-out
            
            /* Elevation & Focus */
            hover:border-gray-300 hover:bg-white
            focus:bg-white focus:border-indigo-500 focus:ring-[5px] focus:ring-indigo-500/10
            
            /* Subtle Inner Depth */
            shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]
          `}
                />

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-indigo-500 transition-all duration-500 ease-in-out group-focus-within:w-[40%] opacity-0 group-focus-within:opacity-100 rounded-full" />
            </div>
        </div>
    );
};

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

        const emailregex = /.*?@?[^@]*\.+.*/;

        if (!emailregex.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match the sequence.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`/api/users/register`, {
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.userName)}&background=4F46E5&color=fff&size=150`
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
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-50/50 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-gray-100 relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400"></div>

                    <div className="text-center">
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl rotate-6"></div>
                            <div className="relative bg-white border border-indigo-100 p-6 rounded-3xl shadow-sm">
                                <EnvelopeIcon className="h-12 w-12 text-indigo-600" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-[900] text-gray-900 tracking-tight leading-tight">
                            Verify your identity
                        </h2>

                        <p className="mt-6 text-gray-500 text-sm font-medium leading-relaxed">
                            An secure link to verif your account has been sent to:
                            <span className="block mt-2 text-indigo-600 font-bold text-base tracking-tight">
                                {formData.email}
                            </span>
                        </p>

                        <div className="mt-10 space-y-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-4.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95"
                            >
                                Go to Dashboard
                            </button>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                            <span className="h-1 w-8 rounded-full bg-indigo-600"></span>
                            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleGoogleLogin = () => {
        window.location.href = `/api/users/google-auth`
    };


    const handleGitHubLogin = () => {
        window.location.href = `/api/users/github-auth`
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
            <div className="mb-10 text-center relative z-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Your Account</h1>
                <p className="text-gray-500 text-sm mt-2 font-medium">Join the next generation of coders.</p>
            </div>

            <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                    <button onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-[10px] text-gray-600 uppercase tracking-widest">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="" />
                        Google
                    </button>
                    <button onClick={handleGitHubLogin} className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 border border-gray-900 rounded-2xl hover:bg-black transition-all font-bold text-[10px] text-white uppercase tracking-widest shadow-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" className="w-4 h-4 invert" alt="" />
                        GitHub
                    </button>
                </div>

                <div className="relative mb-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black text-gray-300">
                        <span className="bg-white px-4 text-gray-400">Personal Details</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                            <ShieldCheckIcon className="w-5 h-5" /> {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <NeonInput id="userName" name="userName" label="Codename" placeholder="e.g. pro_coder" value={formData.userName} onChange={handleChange} Icon={UserIcon} required />
                        <NeonInput id="email" name="email" type="email" label="Email Address" placeholder="johndoe@gmail.com" value={formData.email} onChange={handleChange} Icon={EnvelopeIcon} required />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <NeonInput id="password" name="password" type="password" label="Password" placeholder="Min 8 Characters" value={formData.password} onChange={handleChange} Icon={LockClosedIcon} required />
                            <NeonInput id="confirmPassword" name="confirmPassword" type="password" label="Confirm" placeholder="Retype your password" value={formData.confirmPassword} onChange={handleChange} Icon={LockClosedIcon} required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-gray-200 mt-4"
                    >
                        {loading ? "Creating Identity..." : "Generate Identity"}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-sm font-medium text-gray-400">
                By signing up, you agree to our <span className="text-gray-600 underline cursor-pointer">Terms</span>
            </p>

            <Link to="/login" className="mt-4 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                Already have an account? Login
            </Link>
        </div>
    );
};

export default Register;