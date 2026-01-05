import { Navigate, Outlet } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx"

const ProtectedRoute = () => { 
  const { isAuthenticated, loading } = useAuth();

  if(loading)
    <Loader />

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;