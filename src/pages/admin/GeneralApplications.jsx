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
  Building2,
  Mail,
  ExternalLink,
  Download,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { BASE_URL } from "../../constants";

const GeneralApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/general-applications");
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error fetching direct submissions:", error);
      toast.error("Failed to load direct submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) return;
    try {
      const response = await api.delete(`/general-applications/${uuid}`);
      if (response.success) {
        toast.success("Submission deleted successfully");
        setApplications(prev => prev.filter(app => app.uuid !== uuid));
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Direct Submissions</h1>
        <p className="text-gray-500 font-medium text-sm mt-1">Review candidates who want to join our journey beyond specific roles.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-[40%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Experience</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6 h-20 bg-gray-50/30"></td>
                  </tr>
                ))
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.uuid} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-[#73BF44] transition-colors">{app.full_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-700">{app.email}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                        <Phone size={10} /> {app.phone_number || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-700">{app.experience}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium font-mono">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB') : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {app.portfolio_url && (
                          <a 
                            href={app.portfolio_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Portfolio"
                            className="w-9 h-9 flex items-center justify-center border border-blue-100 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link 
                          to={`/admin/general-applications/${app.uuid}`}
                          title="View Profile"
                          className="w-9 h-9 flex items-center justify-center border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-900 transition-all shadow-sm"
                        >
                          <Eye size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(app.uuid)}
                          title="Delete Submission"
                          className="w-9 h-9 flex items-center justify-center border border-red-50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <Users size={40} className="mb-4 opacity-20" />
                      <p className="font-medium">No submissions found matching your criteria.</p>
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
            Showing <span className="text-gray-900">{filteredApplications.length}</span> of {applications.length} submissions
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

export default GeneralApplications;
