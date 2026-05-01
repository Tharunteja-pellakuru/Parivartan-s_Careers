import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  Calendar,
  Trash2,
  SquarePen,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";
import CustomSelect from "../../components/common/CustomSelect";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [departments, setDepartments] = useState(["All"]);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    confirmText: "",
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/careers/master/departments`);
      const data = await response.json();
      if (data.success) {
        const deptNames = data.data.map(d => d.department_name);
        setDepartments(["All", ...deptNames]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/jobs`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = (uuid) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Job Posting",
      message: "Are you sure you want to delete this job? This action is permanent and cannot be undone.",
      type: "danger",
      confirmText: "Delete Job",
      onConfirm: async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/jobs/${uuid}`, {
            method: "DELETE",
          });
          const data = await response.json();
          
          if (data.success) {
            toast.success("Job deleted successfully");
            setJobs(jobs.filter(job => job.uuid !== uuid));
          } else {
            toast.error(data.message || "Failed to delete job");
          }
        } catch (error) {
          console.error("Error deleting job:", error);
          toast.error("An error occurred while deleting the job");
        }
      }
    });
  };

  const handleToggleStatus = (job) => {
    // Treat "Closed" and "Draft" both as closed states that need "Publishing"
    const isCurrentlyClosed = job.status === "Closed" || job.status === "Draft";
    const newStatus = isCurrentlyClosed ? "Published" : "Closed";
    const actionLabel = isCurrentlyClosed ? "Publish" : "Close";
    
    setModalConfig({
      isOpen: true,
      title: `${actionLabel} Job`,
      message: isCurrentlyClosed 
        ? `Are you sure you want to publish this job? This will make it live and visible to all candidates.`
        : `Are you sure you want to close this job? This will make it invisible to candidates.`,
      type: isCurrentlyClosed ? "info" : "warning",
      confirmText: `${actionLabel} Job`,
      onConfirm: async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/jobs/${job.uuid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });
          const data = await response.json();
          
          if (data.success) {
            toast.success(`Job ${actionLabel.toLowerCase()}d successfully`);
            setJobs(jobs.map(j => j.uuid === job.uuid ? { ...j, status: newStatus } : j));
          } else {
            toast.error(data.message || `Failed to ${actionLabel.toLowerCase()} job`);
          }
        } catch (error) {
          console.error(`Error ${actionLabel.toLowerCase()}ing job:`, error);
          toast.error("An error occurred");
        }
      }
    });
  };

  const statuses = ["All", "Published", "Closed"];

  const filteredJobs = jobs.filter(job => {
    const title = job.job_title || "";
    const dept = job.department || "";
    const status = job.status || "";
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || dept === filterDepartment;
    
    let matchesStatus = true;
    if (filterStatus === "Published") {
      matchesStatus = status === "Published";
    } else if (filterStatus === "Closed") {
      matchesStatus = status === "Closed" || status === "Draft";
    }
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
      />

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
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <CustomSelect 
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={departments}
              icon={Building2}
              placeholder="All Departments"
              className="min-w-[180px]"
            />
            <CustomSelect 
              value={filterStatus}
              onChange={setFilterStatus}
              options={statuses}
              icon={CheckCircle2}
              placeholder="All Status"
              className="min-w-[180px]"
            />
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Job Title</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Department</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Posted</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-6 h-20"></td>
                  </tr>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.uuid || job.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 border-r border-gray-50 last:border-0">
                      <div className="font-bold text-gray-900 group-hover:text-[#73BF44] transition-colors">{job.job_title}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <Briefcase size={10} /> {job.employment_type}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-50 last:border-0">
                      <span className="text-sm font-bold text-gray-600">{job.department}</span>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-50 last:border-0">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <MapPin size={14} className="text-gray-400" /> {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-50 last:border-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        job.status === "Published" 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          job.status === "Published" ? "bg-green-500" : "bg-red-500"
                        }`}></span>
                        {job.status === "Draft" ? "Closed" : job.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-50 last:border-0">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <Calendar size={14} className="text-gray-400" /> 
                        {new Date(job.created_at).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleToggleStatus(job)}
                          className={`p-2 rounded-lg transition-all ${
                            job.status === "Closed" || job.status === "Draft"
                              ? "text-green-500 hover:text-green-600 hover:bg-green-50" 
                              : "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                          }`} 
                          title={job.status === "Closed" || job.status === "Draft" ? "Publish Job" : "Close Job"}
                        >
                          {job.status === "Closed" || job.status === "Draft" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </button>
                        <Link to={`/admin/jobs/${job.uuid}`} className="p-2 text-gray-400 hover:text-[#73BF44] hover:bg-[#73BF44]/5 rounded-lg transition-all" title="Edit Job">
                          <SquarePen size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteJob(job.uuid)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Delete Job"
                        >
                          <Trash2 size={18} />
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
                      <p className="font-bold text-lg">No jobs found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between mt-auto">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
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
