import { useState, useEffect } from "react";
import axios from "axios";

const useFetchProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/questions/questions`, {
                withCredentials: true
            });
            if (!response.data.success)
                throw new Error("Failed to fetch problems");

            const data = response.data.questions;
            setProblems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);

        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    return { problems, loading, error, refetch: fetchProblems };
};

export default useFetchProblems;
