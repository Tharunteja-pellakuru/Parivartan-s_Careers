import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FavIcon from "../assets/Logo.svg";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
  Zap,
  Mail
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Jobs", path: "/admin/jobs", icon: <Briefcase size={18} /> },
    { name: "Applications", path: "/admin/applicants", icon: <Users size={18} /> },
    { name: "Create Job", path: "/admin/jobs/new", icon: <PlusCircle size={18} /> },
    { name: "Add ons", path: "/admin/add-ons", icon: <Zap size={18} /> },
    { name: "Direct Submissions", path: "/admin/general-applications", icon: <Mail size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter antialiased text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-24"
        } fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-500 ease-in-out md:relative flex flex-col font-['Inter']`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-start h-24 bg-white px-8 mb-2">
          <img 
            src={FavIcon} 
            alt="Careers Admin Logo" 
            className="w-48 h-20 object-contain" 
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-[#73BF44] text-white shadow-lg shadow-[#73BF44]/25 font-bold" 
                    : "text-slate-500 hover:bg-gray-50 hover:text-[#73BF44]"
                }`}
              >
                <span className={`shrink-0 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                <span className={`${!isSidebarOpen && "md:hidden"} truncate text-sm`}>{item.name}</span>
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto space-y-4">

          <div className="space-y-1">
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${
                location.pathname === "/admin/settings"
                  ? "bg-[#73BF44] text-white shadow-lg shadow-[#73BF44]/25 font-bold"
                  : "text-slate-500 hover:bg-gray-50 hover:text-[#73BF44]"
              }`}
            >
              <Settings size={18} />
              <span className={`${!isSidebarOpen && "md:hidden"} text-sm`}>Settings</span>
              {location.pathname === "/admin/settings" && isSidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"></div>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-300 text-sm font-bold"
            >
              <LogOut size={18} />
              <span className={`${!isSidebarOpen && "md:hidden"}`}>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
