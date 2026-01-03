import React, { useEffect, useState, useRef } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext.jsx";

const getCodingStats = (user) => [
    { title: "Problems Solved", value: user.problemsSolved, icon: "", color: "text-red-500" },
    { title: "Accepted Rate", value: `${user.acceptance_rate}%`, icon: "", color: "text-green-500" },
    { title: "Current Streak", value: user.currentStreak, icon: "", color: "text-yellow-500" },
    { title: "Maximum Streak", value: user.maximumStreak, icon: "", color: "text-blue-500" },
];

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { updateUser } = useAuth()

    const [formData, setFormData] = useState({
        userName: "",
        collegeName: "",
        languagesProficient: "",
        interests: "",
        targetingCompanies: "",
        socialLinks: { github: "", linkedin: "", twitter: "", portfolio: "" }
    });


    const handleImageClick = () => {
        if(isEditing){
            toast.info("Please change your profile image seperately ...")
            return;
        }
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file)
            return;

        const formData = new FormData();

        formData.append("profileImage", file);

        try {
            setSaveLoading(true);

            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/update-profileurl`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (response.data.success) {
                setUser(prev => ({ ...prev, profile_url: response.data.user.profile_url }));
                toast.success(response.data.message);
                updateUser({ profile_url : response.data.user.profile_url })
            }

        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error);
        } finally {
            setSaveLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
                withCredentials: true,
            });

            const data = res.data.user;


            if (data) {
                const userData = {
                    ...data,
                    languagesProficient: data.languagesProficient || [],
                    targetingCompanies: data.targetingCompanies || [],
                    interests: data.interests || [],
                    socialLinks: data.socialLinks || {}
                };

                setUser(userData);

                setFormData({
                    userName: userData.userName || "",
                    collegeName: userData.collegeName || "",
                    languagesProficient: userData.languagesProficient.join(", "),
                    interests: userData.interests.join(", "),
                    targetingCompanies: userData.targetingCompanies.join(", "),
                    socialLinks: userData.socialLinks
                });
            }
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (!user.profileCompleted) {
            toast.info("Please complete profile before editing");
            navigate("/complete-profile");
            return;
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }));
    };


    const handleSave = async () => {
        setSaveLoading(true);
        try {

            const githubregex = /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z\d](?:-?[a-zA-Z\d]){0,38})\/?$/;
            const linkedinregex = /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([a-zA-Z0-9](?:-?[a-zA-Z0-9]){2,99})\/?$/;

            if (formData.socialLinks.github === '') {
                toast.error("Please provide your Github url");
                return;
            }

            if (!githubregex.test(formData.socialLinks.github)) {
                toast.error("Please enter a valid Github url");
                return;
            }

            if (formData.socialLinks.linkedin !== '' && !linkedinregex.test(formData.socialLinks.linkedin)) {
                toast.error("Please enter a valid Linkedin url");
                return;
            }

            const payload = {
                userName: formData.userName,
                collegeName: formData.collegeName,
                languagesProficient: formData.languagesProficient.split(",").map(i => i.trim()).filter(i => i !== ""),
                interests: formData.interests.split(",").map(i => i.trim()).filter(i => i !== ""),
                targetingCompanies: formData.targetingCompanies.split(",").map(i => i.trim()).filter(i => i !== ""),
                socialLinks: formData.socialLinks
            };

            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/edit-profile`, payload, {
                withCredentials: true
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-200 text-lg animate-pulse">Fetching Coder Profile...</p>
        </div>
    );

    if (!user) return null;
    const stats = getCodingStats(user);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 md:p-10">
            <div className="w-full max-w-6xl mx-auto">
                <Card className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
                        <div className="flex-shrink-0 text-center relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            <div
                                className="relative inline-block cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <img
                                    src={user?.profile_url}
                                    alt="User Avatar"
                                    className={`w-40 h-40 rounded-full border-4 border-indigo-500 shadow-md mx-auto object-cover transition duration-300 ${saveLoading ? 'opacity-50 grayscale' : 'group-hover:brightness-75'}`}
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    {saveLoading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                    ) : (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CameraIcon className="w-10 h-10 text-white shadow-lg" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isEditing ? (
                                <input
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className="mt-4 p-2 w-full text-center bg-gray-50 dark:bg-gray-700 border border-indigo-500 rounded-lg dark:text-white"
                                />
                            ) : (
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-4">{user.userName}</h1>
                            )}
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div className="flex flex-wrap gap-3">
                                {isEditing ? (
                                    <input
                                        name="collegeName"
                                        value={formData.collegeName}
                                        onChange={handleInputChange}
                                        placeholder="College Name"
                                        className="bg-indigo-50 dark:bg-indigo-700/50 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-500 outline-none"
                                    />
                                ) : (
                                    <span className="bg-indigo-50 dark:bg-indigo-700/50 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center">
                                        {user.collegeName}
                                    </span>
                                )}
                                <span className="bg-green-50 dark:bg-green-700/50 text-green-700 dark:text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center">
                                    Age {user.age}
                                </span>
                                <span className="bg-blue-50 dark:bg-blue-700/50 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center">
                                    Rating: {user.rating || "N/A"}
                                </span>
                            </div>

                            <div className="mt-6 flex gap-3">
                                {!isEditing ? (
                                    <Button
                                        className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-[1.02]"
                                        onClick={handleEditToggle}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.646 3.646l-2.121 2.121-8.1 8.1 2.828 2.828 8.1-8.1-2.121-2.121z" /></svg>
                                        <span>Edit Profile</span>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 transition"
                                            onClick={handleSave}
                                            disabled={saveLoading}
                                        >
                                            {saveLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                        <Button
                                            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-lg shadow-lg hover:bg-red-700 transition"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Technical Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{isEditing ? "Languages Proficient (Comma Seperated)" : "Languages Proficient"} </h3>
                                    {isEditing ? (
                                        <input
                                            name="languagesProficient"
                                            value={formData.languagesProficient}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
                                            placeholder="C++, Java, Python..."
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {user.languagesProficient.map((lang, idx) => (
                                                <span key={idx} className="bg-yellow-100 dark:bg-yellow-700/50 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-md text-sm font-medium">{lang}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{isEditing ? "Targeting Companies (Comma Seperated)" : "Targeting Companies"}</h3>
                                    {isEditing ? (
                                        <input
                                            name="targetingCompanies"
                                            value={formData.targetingCompanies}
                                            onChange={handleInputChange}
                                            className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
                                            placeholder="Google, Meta, Microsoft..."
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {user.targetingCompanies.map((company, idx) => (
                                                <span key={idx} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md text-sm font-medium">{company}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{isEditing ? "Interests/Domains (Comma-Seperated)" : "Interests/Domains"}</h3>
                                {isEditing ? (
                                    <input
                                        name="interests"
                                        value={formData.interests}
                                        onChange={handleInputChange}
                                        className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
                                        placeholder="Web Dev, AI, Blockchain..."
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {user.interests.map((interest, idx) => (
                                            <span key={idx} className="bg-pink-100 dark:bg-pink-700/50 text-pink-800 dark:text-pink-300 px-3 py-1 rounded-full text-sm font-medium">{interest}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Social Presence</h2>
                            <div className="flex flex-wrap gap-3">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        {['github', 'linkedin', 'twitter', 'portfolio'].map((platform) => (
                                            <div key={platform}>
                                                <label className="text-xs text-gray-500 uppercase font-bold">{platform}</label>
                                                <input
                                                    name={platform}
                                                    value={formData.socialLinks[platform] || ""}
                                                    onChange={handleSocialChange}
                                                    placeholder={`Enter your ${platform} url`}
                                                    required={platform === 'github'}
                                                    className="w-full p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    Object.entries(user.socialLinks).map(([platform, url], idx) => (
                                        url && url !== "#" && (
                                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 hover:text-white transition shadow-md">
                                                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                                            </a>
                                        )
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                        <Card className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-indigo-500">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Performance Metrics</h2>
                            <div className="space-y-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.title}</span>
                                        </div>
                                        <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
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