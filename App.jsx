import React, { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { JobProvider } from "./context/JobProvider"; // ✅ Import Provider here

// Component Imports
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import OpenPositions from "./pages/OpenPositions";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import WhyJoin from "./pages/WhyJoin";
import Process from "./pages/Process";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    // ✅ 1. The Provider WRAPS everything
    <JobProvider>
      <HashRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ScrollToTop />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex flex-col min-h-screen font-sans">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/why-join" element={<WhyJoin />} />
              <Route path="/process" element={<Process />} />
              <Route path="/positions" element={<OpenPositions />} />
              <Route path="/positions/:slug" element={<JobDetails />} />
              <Route path="/apply/:slug" element={<ApplyJob />} />

              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </JobProvider>
  );
};

export default App;
