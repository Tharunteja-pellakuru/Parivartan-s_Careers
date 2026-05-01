import React, { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout Imports
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Page Imports
import Home from "./pages/Home";
import OpenPositions from "./pages/OpenPositions";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import WhyJoin from "./pages/WhyJoin";
import Process from "./pages/Process";

// Admin Page Imports
import Dashboard from "./pages/admin/Dashboard";
import LoginPage from "./pages/admin/Login";
import Jobs from "./pages/admin/Jobs";
import Applicants from "./pages/admin/Applicants";
import CreateJob from "./pages/admin/CreateJob";
import Settings from "./pages/admin/Settings";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  useEffect(() => {
    if (window.location.pathname === "/a" || window.location.pathname === "/a/") {
      window.location.replace("/#/admin/login");
    }
  }, []);

  return (
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        {/* Standalone Admin Pages */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/a" element={<Navigate to="/admin/login" replace />} />

        {/* Admin Routes - Checked first */}
        <Route 
          path="/admin/*" 
          element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="jobs/new" element={<CreateJob />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="settings" element={<Settings />} />
                <Route index element={<Dashboard />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </AdminLayout>
          } 
        />

        {/* Public Routes */}
        <Route 
          path="/*" 
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/why-join" element={<WhyJoin />} />
                <Route path="/process" element={<Process />} />
                <Route path="/positions" element={<OpenPositions />} />
                <Route path="/positions/:slug" element={<JobDetails />} />
                <Route path="/apply/:slug" element={<ApplyJob />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </MainLayout>
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
