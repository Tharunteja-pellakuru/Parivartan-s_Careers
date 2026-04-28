import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Briefcase, 
  MapPin, 
  Calendar,
  Archive,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  SquarePen
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const departments = ["All", "Design", "Development", "Marketing", "Media", "Operations", "Sales"];
  const statuses = ["All", "Published", "Closed", "Draft"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || job.category === filterDepartment;
    const matchesStatus = filterStatus === "All" || (filterStatus === "Published" && job.isActive) || (filterStatus === "Closed" && !job.isActive);
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Jobs</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage your job postings and hiring campaigns.</p>
        </div>
        <Link to="/admin/jobs/new">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all hover:scale-105 active:scale-95">
            <Plus size={18} /> Create Job
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative min-w-[160px]">
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#73BF44]/20 transition-all cursor-pointer"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            <div className="relative min-w-[160px]">
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#73BF44]/20 transition-all cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status === "All" ? "All Status" : status}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Posted</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-6 h-20 bg-gray-50/30"></td>
                  </tr>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-[#73BF44] transition-colors">{job.title}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                        <Briefcase size={10} /> {job.type || "Full-time"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{job.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <MapPin size={14} className="text-gray-400" /> {job.location || "Hyderabad"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        job.isActive 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${job.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                        {job.isActive ? "Published" : "Closed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <Calendar size={14} className="text-gray-400" /> 
                        {new Date(job.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Archive Job">
                          <Archive size={16} />
                        </button>
                        <Link to={`/admin/jobs/${job._id || job.id}`} className="p-2 text-gray-400 hover:text-[#73BF44] hover:bg-[#73BF44]/5 rounded-lg transition-all" title="Edit Job">
                          <SquarePen size={16} />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Job">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <Briefcase size={40} className="mb-4 opacity-20" />
                      <p className="font-medium">No jobs found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between mt-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Showing <span className="text-gray-900">{filteredJobs.length}</span> of {jobs.length} jobs
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
