import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/themecontext.jsx";
import { CompilerProvider } from "./context/compilerContext.jsx";
import Navbar from "./components/Navbar.jsx"
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProblemList from "./pages/ProblemList.jsx";
import ProblemDetail from "./pages/ProblemDetail.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AddQuestionPage from "./pages/AddQuestionPage.jsx";
import RegisterPage from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { AuthProvider } from "./context/AuthContext.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import NotFound from "./pages/NotFound.jsx";
import SubmissionsPage from "./pages/SubmissionsPage.jsx";
import SubmissionDetails from "./pages/SubmissionDetails.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Privacy from "./pages/Privacy.jsx"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CompilerProvider>
          <Router>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto p-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/about-me" element ={<AboutPage />}/>
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/problems/:id" element={<ProblemDetail />} />
                    <Route path="/privacy" element={<Privacy />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/complete-profile" element={<CompleteProfile />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/post-question" element={<AddQuestionPage />} />
                      <Route path="/submissions" element={<SubmissionsPage />} />
                      <Route path="/submissions/:id" element={<SubmissionDetails />} />
                    </Route>

                    <Route path="*" element={<NotFound/>} />
                  </Routes>
                </main>
              </div>
            </div>
          </Router>
        </CompilerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
