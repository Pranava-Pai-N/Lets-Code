import React, { useState } from 'react';
import { Shield, Lock, Trash2, Globe, ChevronDown, Cookie, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Privacy = () => {
    const [openSection, setOpenSection] = useState(null);

    const themeStyles = {
        blue: {
            accent: 'text-blue-400',
            border: 'border-blue-500/30',
            bg: 'bg-blue-500/10',
            glow: 'shadow-blue-500/20',
            gradient: 'from-blue-600/20'
        },
        cyan: {
            accent: 'text-cyan-400',
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-500/10',
            glow: 'shadow-cyan-500/20',
            gradient: 'from-cyan-600/20'
        },
        red: {
            accent: 'text-red-400',
            border: 'border-red-500/30',
            bg: 'bg-red-500/10',
            glow: 'shadow-red-500/20',
            gradient: 'from-red-600/20'
        }
    };

    const [activeTheme, setActiveTheme] = useState(themeStyles.blue);

    const sections = [
        {
            id: 'google',
            title: 'Google Data Integration',
            icon: <Globe size={22} />,
            color: 'blue',
            content: 'We only access essential identity information : your verified email, display name, and profile picture to personalize your DSA dashboard.'
        },
        {
            id: 'security',
            title: 'Cryptographic Security',
            icon: <Lock size={22} />,
            color: 'cyan',
            content: 'Sessions are protected via HttpOnly strict cookies and RSA-256 JWT signatures, password hashing and shorter sessions ensuring your solve-history remains tamper-proof.'
        },
        {
            id: 'Cookies',
            title: 'Customisation and Cookie Data',
            icon: <Cookie size={22} />,
            color: 'blue',
            content: 'We provide customised feeds and notifications via cookies and thus make experience better'
        }
    ];

    const handleToggle = (s) => {
        if (openSection === s.id) {
            setOpenSection(null);
            setActiveTheme(themeStyles.blue);
        } else {
            setOpenSection(s.id);
            setActiveTheme(themeStyles[s.color]);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-gray-100 selection:bg-indigo-100 selection:text-indigo-700 transition-colors duration-300">

            <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-gradient-to-b ${activeTheme.gradient} to-transparent transition-all duration-1000 ease-in-out pointer-events-none opacity-50`}
                style={{ filter: 'blur(120px)', borderRadius: '100%' }}
            />

            <div className="relative max-w-5xl mx-auto px-6 py-24">
                <Link to="/">
                    <Button
                        className="group flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-black-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </Link>
                <header className="text-center mb-20">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${activeTheme.bg} border ${activeTheme.border} ${activeTheme.accent} text-xs font-bold uppercase tracking-widest mb-8 transition-all duration-500`}>
                        <Shield size={14} strokeWidth={3} />
                        <span>Encrypted Privacy</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        <span className={`transition-colors duration-500 text-red-600`}>Built to stay</span> <span className={`transition-colors duration-500 ${activeTheme.accent}`}>Private.</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Our platform is designed around one principle: <strong>Minimal Data, Maximum Security. </strong>
                        We focus on your DSA growth, not your personal data.
                    </p>
                </header>

                <div className="grid gap-6">
                    {sections.map((s) => {
                        const isOpened = openSection === s.id;
                        const style = themeStyles[s.color];

                        return (
                            <div
                                key={s.id}
                                className={`group relative rounded-[40px] transition-all duration-500 border backdrop-blur-sm ${isOpened
                                        ? `bg-white/[0.05] ${style.border} ${style.glow} scale-[1.02]`
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                                    }`}
                            >
                                <button
                                    onClick={() => handleToggle(s)}
                                    className="w-full p-10 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-8">
                                        <div className={`p-4 rounded-2xl transition-all duration-500 ${isOpened ? `${style.bg} ${style.accent} shadow-lg shadow-${s.color}-500/20` : 'bg-slate-800 text-slate-500'}`}>
                                            {s.icon}
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${isOpened ? 'text-yellow' : 'text-purple-400'}`}>
                                                {s.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium">Click to expand details</p>
                                        </div>
                                    </div>
                                    <div className={`h-12 w-12 rounded-full border border-white/5 flex items-center justify-center transition-all duration-500 ${isOpened ? 'rotate-180 bg-white text-black' : 'bg-transparent text-slate-500'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out ${isOpened ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="px-10 pb-10">
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
                                        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl italic">
                                            {s.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Privacy;