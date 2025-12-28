import { Navigate, Outlet } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = () => { 
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;