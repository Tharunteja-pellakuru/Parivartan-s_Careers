import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Phone, 
  Eye, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Briefcase,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { BASE_URL } from "../../constants";
import CustomSelect from "../../components/common/CustomSelect";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [departments, setDepartments] = useState(["All"]);

  useEffect(() => {
    fetchApplicants();
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

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/job-applications");
      // Map backend data to match frontend expectations
      const mappedData = response.data.map(app => ({
        ...app,
        _id: app.id,
        name: app.applicant_name,
        phone: app.applicant_phone,
        email: app.applicant_email,
        jobId: {
          title: app.job_title,
          category: app.job_category
        },
        status: app.status === "Submitted" ? "Pending" : app.status,
        createdAt: app.created_at
      }));
      setApplicants(mappedData);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;

    try {
      const res = await api.delete(`/api/job-applications/delete/${id}`);
      if (res.success) {
        toast.success("Application deleted successfully");
        setApplicants(prev => prev.filter(app => app._id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete application");
    }
  };


  const tabs = [
    { name: "All", count: applicants.length },
    { name: "New", count: applicants.filter(a => a.status === "Pending").length },
    { name: "Shortlisted", count: applicants.filter(a => a.status === "Shortlisted").length },
    { name: "Hold", count: 0 },
    { name: "Rejected", count: applicants.filter(a => a.status === "Rejected").length },
    { name: "Hired", count: 0 },
  ];

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || app.jobId?.category === filterDepartment;
    const matchesTab = activeTab === "All" || 
                       (activeTab === "New" && app.status === "Pending") ||
                       (activeTab === "Shortlisted" && app.status === "Shortlisted") ||
                       (activeTab === "Rejected" && app.status === "Rejected");
    return matchesSearch && matchesDept && matchesTab;
  });

  // Helper for progress bar
  const getStageProgress = (status) => {
    switch(status) {
      case "Pending": return "10%";
      case "Shortlisted": return "45%";
      case "Hired": return "100%";
      case "Rejected": return "100%";
      default: return "5%";
    }
  };

  const getStageColor = (status) => {
    if (status === "Rejected") return "bg-red-400";
    return "bg-[#73BF44]";
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Applications</h1>
        <p className="text-gray-500 font-medium text-sm mt-1">Review and manage candidate applications across all departments.</p>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
                activeTab === tab.name 
                  ? "text-[#73BF44]" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.name}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.name 
                  ? "bg-[#73BF44]/10 text-[#73BF44]" 
                  : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#73BF44] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by candidate or job..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <CustomSelect 
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={departments}
              icon={Building2}
              placeholder="All Departments"
              className="min-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Job Applied</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Current Stage</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Stage Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-6 h-20 bg-gray-50/30"></td>
                  </tr>
                ))
              ) : filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-[#73BF44] transition-colors">{app.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                        <Phone size={10} /> {app.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-700">{app.jobId?.title || "Unknown Job"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[150px]">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                            {app.status === "Pending" ? "Initial Review" : app.status}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${getStageColor(app.status)}`}
                            style={{ width: getStageProgress(app.status) }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        app.status === "Pending" 
                          ? "bg-blue-50 text-blue-600 border-blue-100" 
                          : app.status === "Shortlisted"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {app.status === "Pending" ? "Pending" : app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium font-mono">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/applicants/${app._id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                        >
                          <Eye size={14} /> View
                        </Link>
                        <button 
                          onClick={() => handleDelete(app._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-50 rounded-lg text-[11px] font-bold text-red-500 hover:bg-red-50 transition-all shadow-sm"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <Users size={40} className="mb-4 opacity-20" />
                      <p className="font-medium">No candidates found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Showing <span className="text-gray-900">{filteredApplicants.length}</span> of {applicants.length} candidates
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-white disabled:opacity-30 transition-all" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-white disabled:opacity-30 transition-all" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
