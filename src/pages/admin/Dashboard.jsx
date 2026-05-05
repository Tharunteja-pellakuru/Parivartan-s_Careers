import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const ApplicationChart = ({ applications = [] }) => {
  const [range, setRange] = useState('7D');
  const daysCount = range === '7D' ? 7 : 30;

  const dates = [...Array(daysCount)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (daysCount - 1 - i));
    return d;
  });

  const labels = dates.map(d => {
    if (range === '7D') {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
  });
  
  const counts = dates.map(d => {
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);
    
    return applications.filter(app => {
      const appDate = new Date(app.created_at);
      return appDate >= startOfDay && appDate <= endOfDay;
    }).length;
  });

  const totalInPeriod = counts.reduce((a, b) => a + b, 0);
  const actualMax = Math.max(...counts);
  const maxCount = actualMax <= 4 ? 4 : Math.ceil(actualMax / 4) * 4;
  const heights = counts.map(c => (c / maxCount) * 100);
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Application Volume</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="flex h-2 w-2 rounded-full bg-[#73BF44] animate-pulse"></span>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{totalInPeriod} candidates last {range === '7D' ? '7 days' : '30 days'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setRange('7D')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${range === '7D' ? 'bg-white shadow-sm text-[#73BF44]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              7D
            </button>
            <button 
              onClick={() => setRange('30D')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${range === '30D' ? 'bg-white shadow-sm text-[#73BF44]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              30D
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative h-[240px] mt-2 mb-10">
        {/* Y-Axis Grid Lines & Values */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[4, 3, 2, 1, 0].map((i) => (
            <div key={i} className="flex items-center gap-4 w-full h-0">
              <span className="text-[10px] font-black text-gray-300 w-10 text-right tabular-nums">
                {Math.round((maxCount / 4) * i)}
              </span>
              <div className="flex-1 border-t border-gray-100 border-dashed"></div>
            </div>
          ))}
        </div>
        
        {/* Bars Container */}
        <div className="absolute inset-0 ml-14 flex items-end justify-between gap-1 z-10">
          {heights.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              <div className="absolute -top-12 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-2 whitespace-nowrap z-20 font-black shadow-xl scale-90 group-hover:scale-100 origin-bottom pointer-events-none">
                {labels[i]}: {counts[i]} {counts[i] === 1 ? 'Candidate' : 'Candidates'}
              </div>
              
              {/* Bar Track Background Hover Effect */}
              <div className={`absolute inset-x-0 bottom-0 top-0 bg-gray-50/30 rounded-lg -z-10 mx-0 opacity-0 group-hover:opacity-100 transition-opacity ${range === '30D' ? 'hidden' : ''}`}></div>

              {/* The Bar */}
              <div 
                className={`w-full ${range === '7D' ? 'max-w-[32px]' : 'max-w-[12px]'} bg-gradient-to-t from-[#73BF44] to-[#8ad65c] rounded-t-sm transition-all duration-700 ease-out hover:brightness-110 cursor-pointer shadow-lg shadow-[#73BF44]/5 relative group-hover:scale-x-110 group-hover:shadow-[#73BF44]/20`}
                style={{ height: `${Math.max(h, 1)}%` }}
              >
                {/* Count Tag visible on non-zero bars (Only for 7D) */}
                {range === '7D' && counts[i] > 0 && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-[#73BF44] bg-white px-2 py-0.5 rounded-full shadow-sm border border-[#73BF44]/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {counts[i]}
                  </span>
                )}
              </div>

              {/* Label - Filtered for 30D to prevent overlap */}
              {(range === '7D' || i % 6 === 0 || i === daysCount - 1) && (
                <span className="absolute -bottom-8 text-[9px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap">{labels[i]}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentApplications = ({ applicants, navigate }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
      <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
      <Link 
        to="/admin/applicants"
        className="text-[#73BF44] text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
      >
        View All <ChevronRight size={14} />
      </Link>
    </div>
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {applicants.length > 0 ? (
        <div className="divide-y divide-gray-50">
          {applicants.map((app, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/admin/applicants/${app.id}`)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#73BF44]/10 border-2 border-white shadow-sm flex items-center justify-center text-[#73BF44] font-bold text-xs group-hover:scale-110 transition-transform">
                {app.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#73BF44] transition-colors">{app.name}</h4>
                <p className="text-[10px] text-gray-500 font-medium truncate">{app.role}</p>
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
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    applications: 0,
    shortlisted: 0,
    hired: 0
  });
  const [allApplications, setAllApplications] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get("/api/jobs"),
          api.get("/api/job-applications")
        ]);
        
        const jobs = jobsRes.success ? jobsRes.data : [];
        const apps = appsRes.success ? appsRes.data : [];
        
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.status?.toLowerCase() === "published").length,
          closedJobs: jobs.filter(j => j.status?.toLowerCase() === "closed").length,
          applications: apps.length,
          shortlisted: 0, // Column was removed, so this is now 0
          hired: 0 // Column was removed, so this is now 0
        });

        setAllApplications(apps);

        const mappedApplicants = apps.slice(0, 8).map(app => {
          const initials = app.applicant_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          return {
            id: app.id,
            name: app.applicant_name,
            initials: initials,
            role: app.job_title || 'Application Received'
          };
        });
        setRecentApplicants(mappedApplicants);

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
        <StatCard label="Total Jobs" value={stats.totalJobs} icon={<Briefcase />} color="bg-blue-500" />
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={<Zap />} color="bg-[#73BF44]" />
        <StatCard label="Closed Jobs" value={stats.closedJobs} icon={<Archive />} color="bg-slate-500" />
        <StatCard label="Applications" value={stats.applications} icon={<Users />} color="bg-purple-500" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={<Star />} color="bg-amber-500" />
        <StatCard label="Hired" value={stats.hired} icon={<Trophy />} color="bg-rose-500" />
      </div>

      {/* Main Content Sections */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-3">
          <ApplicationChart applications={allApplications} />
        </div>
        <div className="lg:col-span-2">
          <RecentApplications applicants={recentApplicants} navigate={navigate} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
