import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ThemeProvider } from "./context/themecontext.jsx";
import { CompilerProvider } from "./context/compilerContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
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
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <AuthProvider>
      <ThemeProvider>
        <CompilerProvider>
          <Router>
            <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} visible={sidebarVisible} onHide={() => setSidebarVisible(false)} onShow={() => setSidebarVisible(true)} />
              {!sidebarVisible && (
                <button
                  onClick={() => setSidebarVisible(true)}
                  className="fixed left-4 top-4 z-[60] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-700 dark:text-zinc-200 shadow-lg transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Show sidebar"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
              )}
              <div className={`flex-1 flex flex-col min-w-0 ${sidebarVisible ? "md:ml-72" : "md:ml-0"}`}>
                <Navbar onMenuClick={() => setSidebarOpen(true)} sidebarVisible={sidebarVisible} onToggleSidebar={() => setSidebarVisible((v) => !v)} />
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/about-me" element={<AboutPage />} />
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/problems/:id" element={<ProblemDetail />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/complete-profile" element={<CompleteProfile />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/post-question" element={<AddQuestionPage />} />
                      <Route path="/submissions" element={<SubmissionsPage />} />
                      <Route path="/submissions/:id" element={<SubmissionDetails />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </Router>
        </CompilerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
