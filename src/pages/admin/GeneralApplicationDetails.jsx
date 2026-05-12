import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Download, 
  Calendar, 
  Briefcase,
  User,
  ExternalLink,
  Loader2,
  ArrowUpRight,
  X,
  Globe,
  Clock,
  Activity,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  PauseCircle,
  XCircle,
  FileText,
  Users
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { BASE_URL } from "../../constants";
import CustomSelect from "../../components/common/CustomSelect";

const GeneralApplicationDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: "" });

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Reviewed", value: "Reviewed" },
    { label: "Shortlisted", value: "Shortlisted" },
    { label: "Rejected", value: "Rejected" },
  ];

  useEffect(() => {
    fetchDetails();
  }, [uuid]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/general-applications/${uuid}`);
      if (res.success) {
        setData(res.data);
        setStatusForm({ status: res.data.status || "Pending" });
      }
    } catch (error) {
      console.error("Error fetching general application details:", error);
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if (!statusForm.status) {
        toast.error("Please select a status");
        return;
      }
      setUpdating(true);
      const res = await api.put(`/general-applications/${uuid}/status`, {
        status: statusForm.status
      });
      if (res.success) {
        toast.success("Status updated successfully");
        setShowStatusModal(false);
        fetchDetails();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    try {
      const response = await api.delete(`/general-applications/${uuid}`);
      if (response.success) {
        toast.success("Application deleted successfully");
        navigate("/admin/general-applications");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return Clock;
      case "Reviewed": return ShieldCheck;
      case "Shortlisted": return CheckCircle2;
      case "Rejected": return XCircle;
      default: return Activity;
    }
  };

  const getResumeUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#73BF44]" size={32} />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-gray-500">Application not found.</div>;

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in duration-500 font-['Inter']">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/general-applications")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#73BF44] transition-colors font-bold text-sm"
        >
          <ChevronLeft size={20} /> Back to Direct Submissions
        </button>
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 border border-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all shadow-sm"
        >
          <Trash2 size={18} /> Delete Submission
        </button>
      </div>

      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#73BF44]/10 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-[#73BF44]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Application Category</p>
            <h2 className="text-xl font-bold text-gray-900">Direct Submission Pool</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Basic Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-[#73BF44]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-[#73BF44]" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{data.full_name}</h2>
            
            <div className="mt-8 space-y-4 text-left border-t border-gray-50 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{data.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-gray-700">{data.phone_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applied On</p>
                  <p className="text-sm font-bold text-gray-700">{new Date(data.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {React.createElement(getStatusIcon(data.status), { size: 18 })}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</p>
                  <p className="text-sm font-bold text-gray-700">{data.status || "Pending"}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
                <button 
                  onClick={() => setShowStatusModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#73BF44] text-white rounded-xl text-sm font-bold hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/20 transition-all group"
                >
                  Update Status <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-[#73BF44]" /> Application Details
            </h3>
            
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Experience</p>
                <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-50 text-gray-700 font-bold text-sm">
                  {data.experience}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Portfolio / Professional URL</p>
                {data.portfolio_url ? (
                  <a 
                    href={data.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 p-4 bg-blue-50/50 rounded-xl border border-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all"
                  >
                    <Globe size={16} /> {data.portfolio_url} <ExternalLink size={14} />
                  </a>
                ) : (
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-gray-400 italic text-sm">
                    No portfolio provided
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reason to Join / Knowledge about Parivartan</p>
                <div className="p-6 bg-gray-50/50 rounded-xl border border-gray-50 text-gray-700 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                  {data.reason_to_join || <span className="text-gray-300 italic">No information provided</span>}
                </div>
              </div>

              {/* Candidate Resume */}
              {data.resume_file && (
                <div className="animate-in fade-in slide-in-from-left-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Candidate Resume</p>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 text-red-500 rounded flex items-center justify-center">
                        <span className="font-black text-[10px]">PDF</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate">{data.resume_file.split('/').pop()}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Uploaded Document</p>
                      </div>
                    </div>
                    <a 
                      href={getResumeUrl(data.resume_file)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-[#73BF44] hover:border-[#73BF44]/20 transition-all shadow-sm"
                    >
                      <Download size={14} /> Download Resume
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 animate-in fade-in duration-300"
            onClick={() => setShowStatusModal(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in slide-in-from-bottom-8 duration-300 relative z-[110]">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">Update Application Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Status</label>
                <CustomSelect 
                  value={statusForm.status}
                  onChange={(val) => setStatusForm({ status: val })}
                  options={statusOptions}
                  icon={Activity}
                  variant="white"
                  placeholder="Select Status"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3 rounded-b-2xl">
              <button onClick={() => setShowStatusModal(false)} className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleUpdateStatus} disabled={updating} className="flex-1 px-6 py-3 bg-[#73BF44] text-white rounded-xl text-sm font-bold hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {updating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralApplicationDetails;
