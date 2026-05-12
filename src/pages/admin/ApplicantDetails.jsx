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
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  ArrowUpRight,
  X,
  Video,
  Users,
  Bell,
  MapPin,
  Link2,
  ChevronDown,
  Layers,
  Activity,
  History,
  ClipboardList,
  Inbox,
  FileSearch,
  Code2,
  Terminal,
  UserCheck,
  FileText,
  Send,
  Heart,
  Home,
  RefreshCw,
  Check,
  ShieldCheck,
  PauseCircle
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { BASE_URL } from "../../constants";
import CustomSelect from "../../components/common/CustomSelect";

const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Modal States
  const [showStageModal, setShowStageModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  // Form States
  const [stageForm, setStageForm] = useState({
    stage_id: "",
    status_id: "",
    notify: true
  });
  
  const [hiringStages, setHiringStages] = useState([]);
  const [hiringStatuses, setHiringStatuses] = useState([]);
  
  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "12:00",
    period: "AM",
    mode: "Online",
    link: "",
    interviewer: "",
    notify: true
  });

  useEffect(() => {
    fetchHiringStages();
  }, []);

  const fetchHiringStages = async () => {
    try {
      const res = await api.get("/api/careers/master/hiring-stages");
      if (res.success) {
        setHiringStages(res.data.map(s => ({ label: s.name, value: s.id })));
      }
    } catch (error) {
      console.error("Error fetching hiring stages:", error);
    }
  };

  const fetchStatusesByStage = async (stageId) => {
    try {
      const res = await api.get(`/api/careers/master/status-by-stage?stage_id=${stageId}`);
      if (res.success) {
        setHiringStatuses(res.data.map(s => ({ label: s.name, value: s.id })));
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const handleStageChange = (stageId) => {
    setStageForm({ ...stageForm, stage_id: stageId, status_id: "" });
    fetchStatusesByStage(stageId);
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case "Application received": return Inbox;
      case "Resume screening": return FileSearch;
      case "Technical test": return Code2;
      case "Technical interview": return Terminal;
      case "Managerial interview": return Briefcase;
      case "HR final round": return UserCheck;
      case "Offer preparation": return FileText;
      case "Offer issued": return Send;
      case "Offer accepted": return Heart;
      case "Rejected": return XCircle;
      case "Joined": return Home;
      default: return ClipboardList;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return Clock;
      case "Shortlisted": return CheckCircle2;
      case "In Progress": return RefreshCw;
      case "Completed": return Check;
      case "Cleared": return ShieldCheck;
      case "Failed": return XCircle;
      case "Rejected": return X;
      case "On Hold": return PauseCircle;
      default: return Activity;
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/job-applications/${id}`);
      if (res.success) {
        setData(res);
        setStageForm({
          stage_id: res.application.current_stage_id || "",
          status_id: res.application.current_status_id || "",
          notify: true
        });
        if (res.application.current_stage_id) {
          fetchStatusesByStage(res.application.current_stage_id);
        }
      }
    } catch (error) {
      console.error("Error fetching applicant details:", error);
      toast.error("Failed to load applicant details");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateStage = async () => {
    try {
      if (!stageForm.stage_id || !stageForm.status_id) {
        toast.error("Please select both stage and status");
        return;
      }
      setUpdating(true);
      const res = await api.put(`/api/job-applications/update-stage/${id}`, {
        stage_id: stageForm.stage_id,
        status_id: stageForm.status_id,
        notify: stageForm.notify
      });
      if (res.success) {
        toast.success("Stage updated successfully");
        setShowStageModal(false);
        fetchDetails();
      }
    } catch (error) {
      console.error("Error updating stage:", error);
      toast.error("Failed to update stage");
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#73BF44]" size={32} />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-gray-500">Applicant not found.</div>;

  const { application, answers } = data;

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in duration-500 font-['Inter']">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/applicants")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#73BF44] transition-colors font-bold text-sm"
        >
          <ChevronLeft size={20} /> Back to Applicants
        </button>
        
      </div>

      {/* Stage Control Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#73BF44]/10 rounded-xl flex items-center justify-center">
            <Briefcase size={20} className="text-[#73BF44]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Applied For Position</p>
            <h2 className="text-xl font-bold text-gray-900">{application.job_title}</h2>
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
            <h2 className="text-xl font-bold text-gray-900">{application.applicant_name}</h2>
            
            <div className="mt-8 space-y-4 text-left border-t border-gray-50 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{application.applicant_email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-gray-700">{application.applicant_phone || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applied On</p>
                  <p className="text-sm font-bold text-gray-700">{new Date(application.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hiring Stage</p>
                  <p className="text-sm font-bold text-gray-700">{application.stage_name || "Application Submission"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hiring Status</p>
                  <p className="text-sm font-bold text-gray-700">{application.status_name || "Pending"}</p>
                </div>
              </div>


              <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
                <button 
                  onClick={() => setShowStageModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#73BF44] text-white rounded-xl text-sm font-bold hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/20 transition-all group"
                >
                  Update Stage <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => setShowInterviewModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  <Calendar size={18} className="text-gray-400" /> Schedule Interview
                </button>
              </div>
            </div>
          </div>

          {/* Resume Card */}
          {application.resume_file && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-[#73BF44]" /> Candidate Resume
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded flex items-center justify-center">
                    <span className="font-black text-[10px]">PDF</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{application.resume_file}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Uploaded File</p>
                  </div>
                </div>
                <a 
                  href={`${BASE_URL}/${application.resume_file.replace(/\\/g, '/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-[#73BF44] transition-colors"
                >
                  <Download size={18} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Custom Answers */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-[#73BF44]" /> Application Responses
            </h3>
            
            <div className="space-y-8">
              {answers.length > 0 ? (
                answers.map((answer, index) => (
                  <div key={answer.id} className="animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${index * 50}ms` }}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{answer.field_name}</p>
                    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-50 text-gray-700 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                      {answer.field_value || <span className="text-gray-300 italic">No response provided</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No additional information provided for this application.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Update Stage Modal */}
      {showStageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 animate-in fade-in duration-300"
            onClick={() => setShowStageModal(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in slide-in-from-bottom-8 duration-300 relative z-[110]">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">Update Hiring Stage</h3>
              <button onClick={() => setShowStageModal(false)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Stage</label>
                <CustomSelect 
                  value={stageForm.stage_id}
                  onChange={handleStageChange}
                  options={hiringStages}
                  icon={Layers}
                  variant="white"
                  placeholder="Select Stage"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Status</label>
                <CustomSelect 
                  value={stageForm.status_id}
                  onChange={(val) => setStageForm({...stageForm, status_id: val})}
                  options={hiringStatuses}
                  icon={Activity}
                  variant="white"
                  placeholder={stageForm.stage_id ? "Select Status" : "Select Stage First"}
                />
              </div>

              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    id="notify" 
                    checked={stageForm.notify}
                    onChange={(e) => setStageForm({...stageForm, notify: e.target.checked})}
                    className="w-4 h-4 text-[#73BF44] rounded border-gray-300 focus:ring-[#73BF44]"
                  />
                </div>
                <label htmlFor="notify" className="cursor-pointer">
                  <p className="text-sm font-bold text-blue-900">Notify Candidate</p>
                  <p className="text-[10px] text-blue-600 font-medium">Send Email & WhatsApp notification</p>
                </label>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3 rounded-b-2xl">
              <button 
                onClick={() => setShowStageModal(false)}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStage}
                disabled={updating}
                className="flex-1 px-6 py-3 bg-[#73BF44] text-white rounded-xl text-sm font-bold hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Update Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 animate-in fade-in duration-300"
            onClick={() => setShowInterviewModal(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-in slide-in-from-bottom-8 duration-300 relative z-[110]">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#73BF44]/10 rounded-lg flex items-center justify-center">
                  <Calendar size={18} className="text-[#73BF44]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Schedule Interview</h3>
              </div>
              <button onClick={() => setShowInterviewModal(false)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#73BF44]/20 focus:border-[#73BF44] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Time</label>
                <div className="flex gap-2">
                  <CustomSelect 
                    value={interviewForm.time}
                    onChange={(val) => setInterviewForm({...interviewForm, time: val})}
                    options={[12,1,2,3,4,5,6,7,8,9,10,11].map(h => h.toString())}
                    variant="white"
                    className="flex-1"
                    icon={Clock}
                  />
                  <CustomSelect 
                    value={interviewForm.minutes || "00"}
                    onChange={(val) => setInterviewForm({...interviewForm, minutes: val})}
                    options={["00", "15", "30", "45"]}
                    variant="white"
                    className="flex-1"
                    icon={Clock}
                  />
                  <CustomSelect 
                    value={interviewForm.period}
                    onChange={(val) => setInterviewForm({...interviewForm, period: val})}
                    options={["AM", "PM"]}
                    variant="white"
                    className="flex-1"
                    icon={Clock}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interview Mode</label>
                <div className="flex gap-6">
                  {["Online", "Offline", "Phone"].map(mode => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="mode" 
                        checked={interviewForm.mode === mode}
                        onChange={() => setInterviewForm({...interviewForm, mode: mode})}
                        className="w-4 h-4 text-[#73BF44] focus:ring-[#73BF44]" 
                      />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Meeting Link</label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Zoom / Google Meet URL"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#73BF44]/20 focus:border-[#73BF44] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interviewer Name</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Who is conducting this interview?"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#73BF44]/20 focus:border-[#73BF44] outline-none"
                  />
                </div>
              </div>



              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                <div className="mt-0.5">
                  <input type="checkbox" id="sendInvite" defaultChecked className="w-4 h-4 text-[#73BF44] rounded border-gray-300 focus:ring-[#73BF44]" />
                </div>
                <label htmlFor="sendInvite" className="cursor-pointer">
                  <p className="text-sm font-bold text-amber-900 flex items-center gap-2">Send Invitation <Bell size={14} /></p>
                  <p className="text-[10px] text-amber-600 font-medium">Automatically sends Email & WhatsApp with meeting details.</p>
                </label>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3 rounded-b-2xl">
              <button 
                onClick={() => setShowInterviewModal(false)}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-6 py-3 bg-[#73BF44] text-white rounded-xl text-sm font-bold hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={18} /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDetails;
