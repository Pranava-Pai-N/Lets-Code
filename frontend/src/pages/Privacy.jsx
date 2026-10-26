import React, { useState } from "react";
import { Shield, Lock, Cookie, Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Privacy = () => {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      id: "google",
      title: "Google Data Integration",
      icon: <Globe className="h-5 w-5" />,
      content:
        "We only access essential identity information: your verified email, display name, and profile picture to personalize your DSA dashboard.",
    },
    {
      id: "security",
      title: "Cryptographic Security",
      icon: <Lock className="h-5 w-5" />,
      content:
        "Sessions are protected via HttpOnly strict cookies and RSA-256 JWT signatures, password hashing and shorter sessions ensuring your solve-history remains tamper-proof.",
    },
    {
      id: "cookies",
      title: "Customisation & Cookie Data",
      icon: <Cookie className="h-5 w-5" />,
      content:
        "We provide customised feeds and notifications via cookies to make your experience better.",
    },
  ];

  const toggle = (id) => setOpenSection((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12),_transparent_60%)]" />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 transition hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Link>

        <header className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
            <Shield className="h-3.5 w-3.5" /> Encrypted Privacy
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
            Built to stay <span className="text-indigo-600 dark:text-indigo-400">private.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Our platform is designed around one principle: <strong className="text-zinc-800 dark:text-zinc-200">minimal data, maximum security.</strong>{" "}
            We focus on your DSA growth, not your personal data.
          </p>
        </header>

        <div className="space-y-4">
          {sections.map((s) => {
            const isOpen = openSection === s.id;
            return (
              <div
                key={s.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen ? "border-indigo-500/40 bg-white dark:bg-zinc-900/80 shadow-sm" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500/40 dark:hover:border-zinc-700"
                }`}
              >
                <button
                  onClick={() => toggle(s.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-xl p-3 transition ${
                        isOpen ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {s.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{s.title}</h3>
                      <p className="text-xs text-zinc-500">Click to expand details</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-300" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-5">
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.content}</p>
                    </div>
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
