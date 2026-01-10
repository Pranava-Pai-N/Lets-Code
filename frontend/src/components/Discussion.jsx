import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChatBubbleLeftRightIcon, PlusIcon, ChevronLeftIcon, LockClosedIcon, ArrowPathIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Discussion = ({ problemId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postLiked, setPostLiked] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: ""
  });

  useEffect(() => {
    if (problemId)
      fetchDiscussions();
  }, [problemId]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/discussions/question/${problemId}`, { withCredentials: true });

      setDiscussions(res.data.allDiscussions || []);

    } catch (err) {
      console.error("Error fetching discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to post.");
      return;
    }

    const payload = {
      questionId: problemId,
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      userName: user.userName
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/discussions/post-discussion`, payload,
        {
          withCredentials: true
        });

      if (res.data.success) {
        toast.success("Discussion posted successfully ..");

        setFormData({ title: "", description: "", tags: "" });
        setShowForm(false);
        fetchDiscussions();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to post discussion";
      toast.error(msg);
    }
  };

  if (loading)
    return <div className="py-10"><Loader /></div>;

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/discussions/question/${problemId}`,
        {
          withCredentials: true
        });

      setDiscussions(res.data.allDiscussions || []);
      setIsRefreshing(false);

    } catch (err) {
      console.error("Error fetching discussions:", err);
      setIsRefreshing(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      setIsRefreshing(false);
    }
  }

  const handleLikes = async (id) => {
    if (postLiked) {
      return;

    }
    setPostLiked(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/discussions/like-discussion/${id}`, {},
        {
          withCredentials: true
        });

      if (res.data.success) {
        toast.success(res.data.message);
        setDiscussions(prevDiscussions =>
          prevDiscussions.map(item =>
            item._id === id ? { ...item, likedBy: res.data.discussion.likedBy } : item
          )
        );
      }

      if (!res.data.success) {
        toast.error(res.data.message);
        setPostLiked(false);
      }

    } catch (err) {
      setPostLiked(false);
      console.error("Error liking the posts:", err);
      toast.error(err);
    }
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-500" />
          Community Discussions
        </h3>

        {!showForm ? (
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all active:scale-90 disabled:opacity-50"
            title="Refresh Discussions"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        ) : null}


        {user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition font-medium"
          >
            {showForm ? <><ChevronLeftIcon className="w-4 h-4" /> Back</> : <><PlusIcon className="w-4 h-4" /> New Discussion</>}
          </button>
        ) : (
          <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            <LockClosedIcon className="w-3 h-3" /> Login to post
          </span>
        )}
      </div>

      {showForm && user ? (
        <form onSubmit={handlePost} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
              {user.userName?.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Posting as {user.userName.toUpperCase()}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discussion Title</label>
            <input
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
              placeholder="Give a suitable title to your discussion"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Details (Min 5 Characters)</label>
            <textarea
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
              rows="4"
              placeholder="Provide a suitable explaination to your approach"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (max 5, comma separated)</label>
            <input
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="DP, Recursion, Sliding-Window"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md active:scale-[0.98]">
            Publish Thread
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {discussions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No discussions yet. Be the first to start a conversation!</p>
            </div>
          ) : (
            discussions.map((item) => (
              <div key={item._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition cursor-pointer group shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition tracking-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>
                <button
                  onClick={() => handleLikes(item._id)}
                  className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 ${postLiked
                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                    }`}
                >
                  <HandThumbUpIcon
                    className={`w-4 h-4 transition-transform group-hover:-rotate-12 ${item.isLiked ? "fill-current" : ""
                      }`}
                  />
                  <span className="text-xs font-bold">
                    {item.likedBy?.length || 0}
                  </span>
                </button>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-gray-700/50">
                  <div className="flex gap-1.5">
                    {item.tags?.map((tag, i) => (
                      <span key={i} className="text-[9px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-[8px] font-bold">
                      {item.userName?.substring(0, 2).toUpperCase() || "?"}
                    </div>
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                      {item.userName || "Anonymous"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Discussion;