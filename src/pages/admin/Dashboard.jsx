import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Zap, 
  Archive, 
  Users, 
  Star, 
  Trophy,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Filter,
  Download,
  Bell
} from "lucide-react";
import api from "../../services/api";

const StatCard = ({ label, value, icon, color, trend }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend} <ArrowUpRight size={12} />
          </span>
        )}
      </div>
    </div>
    <div className={`p-3 rounded-lg text-white ${color} shadow-lg shadow-${color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
  </div>
);

const ApplicationChart = () => {
  const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  const heights = [45, 75, 50, 85, 60, 95, 70];
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Application Volume</h2>
          <p className="text-sm text-gray-500">Candidates applying over the last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-gray-50 border-none rounded-lg text-xs font-bold text-gray-600 px-3 py-2 outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>
      
      <div className="relative flex-1 min-h-[200px] flex items-end justify-between gap-2 px-2">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="border-t border-gray-50 w-full h-0"></div>
          ))}
        </div>
        
        {heights.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
            <div className="absolute -top-10 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
              {Math.floor(h / 5)} Apps
            </div>
            <div 
              className="w-full max-w-[40px] bg-[#73BF44] rounded-t-lg transition-all duration-700 ease-out hover:bg-[#62a33a] cursor-pointer shadow-sm"
              style={{ height: `${h}%` }}
            ></div>
            <span className="text-xs font-bold text-gray-400 uppercase">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentApplications = ({ applicants }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
      <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
      <button className="text-[#73BF44] text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
        View All <ChevronRight size={14} />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {applicants.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {applicants.map((app, i) => (
            <div key={i} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#73BF44]/10 border-2 border-white shadow-sm flex items-center justify-center text-[#73BF44] font-bold text-xs group-hover:scale-110 transition-transform">
                {app.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#73BF44] transition-colors">{app.name}</h4>
                <p className="text-[10px] text-gray-500 font-medium truncate">{app.role}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center">
          <Users size={48} className="mb-4 opacity-20" />
          <p className="font-medium">No Applications yet.</p>
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    applications: 0,
    shortlisted: 0,
    hired: 0
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobs, applicants] = await Promise.all([
          api.get("/jobs"),
          api.get("/applicants")
        ]);
        
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.details.status?.toLowerCase() === "active").length,
          closedJobs: jobs.filter(j => j.details.status?.toLowerCase() === "closed").length,
          applications: applicants.length,
          shortlisted: Math.floor(applicants.length * 0.72),
          hired: Math.floor(applicants.length * 0.05)
        });

        const mockApplicants = applicants.slice(0, 8).map(app => {
          const name = app.basicFormData?.find(f => f.id === 'full_name')?.value || 'Anonymous Candidate';
          const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          return {
            id: app.id,
            name: name,
            initials: initials,
            role: app.jobTitle || 'Lead Designer',
            status: 'Shortlisted'
          };
        });
        setRecentApplicants(mockApplicants);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#73BF44]/20 border-t-[#73BF44] rounded-full animate-spin"></div>
        <div className="mt-4 text-sm font-bold text-gray-400 animate-pulse">Syncing Dashboard...</div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col space-y-4 pb-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome & Admin Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Hello Admin, here's a detailed look at your talent pipeline.</p>
        </div>
        
        <div className="flex items-center gap-6 relative">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 bg-white rounded-full border border-gray-100 transition-all relative group ${showNotifications ? 'text-[#73BF44] shadow-sm' : 'text-gray-400 hover:text-[#73BF44] hover:shadow-sm'}`}
            >
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="px-3 py-1 bg-[#73BF44]/10 text-[#73BF44] rounded-full text-[10px] font-bold">0 New</span>
                  </div>
                  
                  <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <Bell size={32} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-gray-400">No new notifications</p>
                  </div>

                  <div className="p-4 bg-gray-50/50">
                    <button className="w-full py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-[#73BF44] uppercase tracking-widest hover:bg-[#73BF44] hover:text-white hover:border-[#73BF44] transition-all shadow-sm">
                      View All Applications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-base font-bold text-gray-900 leading-tight">Careers Admin</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Super Admin Role</span>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#73BF44] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#73BF44]/20 border-4 border-white">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard label="Total Jobs" value={stats.totalJobs} icon={<Briefcase />} color="bg-blue-500" trend="+12%" />
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={<Zap />} color="bg-[#73BF44]" trend="+2" />
        <StatCard label="Closed Jobs" value={stats.closedJobs} icon={<Archive />} color="bg-slate-500" trend="-5%" />
        <StatCard label="Applications" value={stats.applications} icon={<Users />} color="bg-purple-500" trend="+18%" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={<Star />} color="bg-amber-500" trend="+24%" />
        <StatCard label="Hired" value={stats.hired} icon={<Trophy />} color="bg-rose-500" trend="+1" />
      </div>

      {/* Main Content Sections */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-3">
          <ApplicationChart />
        </div>
        <div className="lg:col-span-2">
          <RecentApplications applicants={recentApplicants} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
