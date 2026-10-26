import React, { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  CalendarIcon,
  LinkIcon,
  HeartIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

const inputClass =
  "w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const CompleteProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    collegeName: "",
    languagesProficient: "",
    targetingCompanies: "",
    interests: "",
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    if (formData.linkedin !== "" && !linkedinregex.test(formData.linkedin)) {
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
      languagesProficient: formData.languagesProficient.split(",").map((s) => s.trim()).filter(Boolean),
      targetingCompanies: formData.targetingCompanies.split(",").map((s) => s.trim()).filter(Boolean),
      interests: formData.interests.split(",").map((s) => s.trim()).filter(Boolean),
      socialLinks: {
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        portfolio: formData.portfolio,
      },
    };

    try {
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/complete-profile`, payload, {
        withCredentials: true,
      });
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
      setTimeout(() => navigate("/profile", { replace: true }), 1500);
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-5xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm md:p-12">
        <header className="mb-10 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
            Step 2: Profile Setup
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Complete your <span className="text-indigo-500">profile</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Let us know a bit more about your technical background.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">Age</label>
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                  <CalendarIcon className="h-5 w-5 text-zinc-500" />
                  <input type="number" name="age" required placeholder="Years" value={formData.age} onChange={handleChange} className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-zinc-500">College</label>
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                  <AcademicCapIcon className="h-5 w-5 text-zinc-500" />
                  <input type="text" name="collegeName" required placeholder="College Name" value={formData.collegeName} onChange={handleChange} className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none" />
                </div>
              </div>
            </div>

            {[
              { label: "Tech Stack (comma separated)", name: "languagesProficient", icon: CodeBracketIcon, placeholder: "e.g. React, Node.js, Python", required: true },
              { label: "Targeting Companies", name: "targetingCompanies", icon: BriefcaseIcon, placeholder: "e.g. Google, Meta, Netflix", required: false },
              { label: "Core Interests", name: "interests", icon: HeartIcon, placeholder: "e.g. Blockchain, Web3, AI", required: true },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name}>
                  <label className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-zinc-500">
                    <Icon className="h-4 w-4 text-indigo-500" /> {f.label}
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                    <input name={f.name} required={f.required} placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange} className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none" />
                  </div>
                </div>
              );
            })}

            <button type="button" onClick={() => navigate("/profile")} className="block w-full text-center text-xs font-medium text-zinc-500 transition hover:text-indigo-500">
              Already completed? Go to Profile
            </button>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                <GlobeAltIcon className="h-4 w-4" /> Digital Presence
              </h3>
              <div className="space-y-3">
                {["github", "linkedin", "twitter", "portfolio"].map((social) => (
                  <div key={social} className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                    <LinkIcon className="h-4 w-4 text-indigo-400" />
                    <input
                      type="url"
                      name={social}
                      placeholder={`${social.charAt(0).toUpperCase() + social.slice(1)} URL`}
                      required={social === "github"}
                      value={formData[social]}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-[11px] italic leading-relaxed text-zinc-500">
                By clicking finish, you agree to our terms of service regarding data synchronization.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold uppercase tracking-widest text-white transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Saving..." : "Finish Setup"}
                {!loading && <RocketLaunchIcon className="ml-3 h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
