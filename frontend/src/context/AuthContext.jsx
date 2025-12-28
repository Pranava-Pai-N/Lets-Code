import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
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
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
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

  useEffect(() => { 
    fetchUser(); 
  }, []);

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated, 
        loading, 
        setUser, 
        login,
        setIsAuthenticated, 
        logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);