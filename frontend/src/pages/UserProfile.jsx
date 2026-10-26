import React, { useEffect, useState, useRef } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CameraIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { Linkedin, Github, Twitter, User2 as User2Icon } from "lucide-react";

const getCodingStats = (user) => [
  { title: "Problems Solved", value: user.problemsSolved, color: "text-rose-500" },
  { title: "Accepted Rate", value: `${user.acceptance_rate}%`, color: "text-emerald-500" },
  { title: "Current Streak", value: user.currentStreak, color: "text-amber-500" },
  { title: "Maximum Streak", value: user.maximumStreak, color: "text-indigo-500" },
];

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  portfolio: User2Icon,
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    userName: "",
    collegeName: "",
    languagesProficient: "",
    interests: "",
    targetingCompanies: "",
    socialLinks: { github: "", linkedin: "", twitter: "", portfolio: "" },
  });

  const handleImageClick = () => {
    if (isEditing) {
      toast.info("Please change your profile image separately ...");
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("profileImage", file);
    try {
      setSaveLoading(true);
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/update-profileurl`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.data.success) {
        setUser((prev) => ({ ...prev, profile_url: response.data.user.profile_url }));
        toast.success(response.data.message);
        updateUser({ profile_url: response.data.user.profile_url });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setTimeout(() => setSaveLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, { withCredentials: true });
      const data = res.data.user;
      if (data) {
        const userData = {
          ...data,
          languagesProficient: data.languagesProficient || [],
          targetingCompanies: data.targetingCompanies || [],
          interests: data.interests || [],
          socialLinks: data.socialLinks || {},
        };
        setUser(userData);
        setFormData({
          userName: userData.userName || "",
          collegeName: userData.collegeName || "",
          languagesProficient: userData.languagesProficient.join(", "),
          interests: userData.interests.join(", "),
          targetingCompanies: userData.targetingCompanies.join(", "),
          socialLinks: userData.socialLinks,
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  const handleEditToggle = () => {
    if (!user?.profileCompleted) {
      toast.info("Please complete profile before editing");
      navigate("/complete-profile");
      return;
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const githubregex = /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z\d](?:-?[a-zA-Z\d]){0,38})\/?$/;
      const linkedinregex = /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([a-zA-Z0-9](?:-?[a-zA-Z0-9]){2,99})\/?$/;

      if (formData.socialLinks.github === "") {
        toast.error("Please provide your Github url");
        return;
      }
      if (!githubregex.test(formData.socialLinks.github)) {
        toast.error("Please enter a valid Github url");
        return;
      }
      if (formData.socialLinks.linkedin !== "" && !linkedinregex.test(formData.socialLinks.linkedin)) {
        toast.error("Please enter a valid Linkedin url");
        return;
      }

      const payload = {
        userName: formData.userName,
        collegeName: formData.collegeName,
        languagesProficient: formData.languagesProficient.split(",").map((i) => i.trim()).filter((i) => i !== ""),
        interests: formData.interests.split(",").map((i) => i.trim()).filter((i) => i !== ""),
        targetingCompanies: formData.targetingCompanies.split(",").map((i) => i.trim()).filter((i) => i !== ""),
        socialLinks: formData.socialLinks,
      };

      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/edit-profile`, payload, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Profile Updated Successfully");
        setUser(res.data.updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!user) return null;

  const stats = getCodingStats(user);

  const inputClass =
    "w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-10">
      <div className="mx-auto max-w-6xl">
        <Card className="mb-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
            <div className="text-center">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className="relative inline-block cursor-pointer" onClick={handleImageClick}>
                <img
                  src={user?.profile_url}
                  alt="User Avatar"
                  className={`h-28 w-28 rounded-full border-4 border-indigo-500 object-cover shadow-md transition md:h-40 md:w-40 ${
                    saveLoading ? "grayscale opacity-50" : "hover:brightness-90"
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {saveLoading ? (
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
                  ) : (
                    <CameraIcon className="h-8 w-8 text-white opacity-0 transition hover:opacity-100" />
                  )}
                </div>
              </div>
              {isEditing ? (
                <input
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`mt-4 text-center ${inputClass}`}
                />
              ) : (
                <h1 className="mt-4 text-2xl font-extrabold md:text-3xl">{user.userName}</h1>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <input
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    placeholder="College Name"
                    className="rounded-full border border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 outline-none"
                  />
                ) : (
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    {user.collegeName}
                  </span>
                )}
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Age {user.age}
                </span>
                <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Rating: {user.rating || "N/A"}
                </span>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button
                    onClick={handleEditToggle}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h2 className="mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                Technical Profile
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    {isEditing ? "Languages Proficient (comma separated)" : "Languages Proficient"}
                  </h3>
                  {isEditing ? (
                    <input name="languagesProficient" value={formData.languagesProficient} onChange={handleInputChange} placeholder="C++, Java, Python..." className={inputClass} />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.languagesProficient.map((lang, idx) => (
                        <span key={idx} className="rounded-md bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    {isEditing ? "Targeting Companies (comma separated)" : "Targeting Companies"}
                  </h3>
                  {isEditing ? (
                    <input name="targetingCompanies" value={formData.targetingCompanies} onChange={handleInputChange} placeholder="Google, Meta, Microsoft..." className={inputClass} />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.targetingCompanies.map((company, idx) => (
                        <span key={idx} className="rounded-md bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                          {company}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  {isEditing ? "Interests/Domains (comma separated)" : "Interests/Domains"}
                </h3>
                {isEditing ? (
                  <input name="interests" value={formData.interests} onChange={handleInputChange} placeholder="Web Dev, AI, Blockchain..." className={inputClass} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, idx) => (
                      <span key={idx} className="rounded-full bg-pink-100 dark:bg-pink-900/30 px-3 py-1 text-xs font-medium text-pink-800 dark:text-pink-300">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h2 className="mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-lg font-bold text-indigo-600 dark:text-indigo-400">
                Social Presence
              </h2>
              <div className="flex flex-wrap gap-3">
                {isEditing ? (
                  <div className="grid w-full gap-4 md:grid-cols-2">
                    {["github", "linkedin", "twitter", "portfolio"].map((platform) => (
                      <div key={platform}>
                        <label className="text-xs font-bold uppercase text-zinc-500">{platform}</label>
                        <input
                          name={platform}
                          value={formData.socialLinks[platform] || ""}
                          onChange={handleSocialChange}
                          placeholder={`Enter your ${platform} url`}
                          required={platform === "github"}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  Object.entries(user.socialLinks).map(([platform, url], idx) => {
                    if (!url || url === "#") return null;
                    const IconComponent = socialIconMap[platform];
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm transition hover:bg-indigo-600 hover:text-white"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />}
                        <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                      </a>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-l-4 border-indigo-500 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-zinc-800 dark:text-white">Performance Metrics</h2>
              <div className="space-y-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-b-0">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{stat.title}</span>
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
