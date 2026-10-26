import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ProblemWorkspace from "../components/ProblemWorkspace.jsx";

const ProblemDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/questions/questions/${id}`,
          { withCredentials: true }
        );
        const data = res.data.question || res.data;
        if (!data) throw new Error("Failed to fetch problem");
        setProblem(data);
      } catch (err) {
        setError(err?.message || "Failed to fetch problem");
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    fetchProblem();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">Error: {error}</p>;
  if (!problem) return null;

  return (
    <ProblemWorkspace
      problem={problem}
      problemId={id}
      user={user}
      isAuthenticated={isAuthenticated}
    />
  );
};

export default ProblemDetail;