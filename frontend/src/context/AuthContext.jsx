import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"
import Loader from "../components/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;


  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/me`, {
        withCredentials: true
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }

    } catch (_error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const response = await axios.get(`/api/users/logout`, {
        withCredentials: true
      });

      if (response.data.success) {
        setUser(null);
        setIsAuthenticated(false);
        toast.success(response.data.message)
      }
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      if (!prev)
        return null;

      return { ...prev, ...newData };
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      setUser,
      updateUser,
      login,
      setIsAuthenticated,
      logout
    }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);