import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Layout, 
  ListChecks, 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings2,
  FileText,
  X,
  Layers,
  ArrowRight,
  ArrowUpRight,
  Filter,
  Download,
  Bell,
  Briefcase,
  Check,
  Building2,
  Tag,
  Monitor,
  Clock,
  CircleDot,
  ArrowLeft
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";
import CustomSelect from "../../components/common/CustomSelect";

const CreateJob = () => {
  const navigate = useNavigate();
  const { uuid } = useParams(); // Check if we are in Edit Mode
  const isEditMode = !!uuid;

  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(isEditMode);
  
  const [jobData, setJobData] = useState({
    title: "",
    slug: "",
    department: "",
    category: "",
    location: "Hyderabad",
    workType: "Onsite",
    employmentType: "Full-time",
    experienceMin: "0",
    experienceMax: "1",
    openings: "1",
    status: "Published",
    overview: "",
    responsibilities: [],
    requiredSkills: [],
    niceToHaveSkills: []
  });

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchBasicFormFields();
    if (isEditMode) {
      fetchJobDetails();
    }
  }, [uuid]);

  useEffect(() => {
    if (jobData.department && !loading) {
      fetchCategories(jobData.department);
    }
  }, [jobData.department]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/jobs/${uuid}`);
      const data = await response.json();
      if (data.success) {
        const job = data.data;
        
        setJobData({
          title: job.job_title,
          slug: job.job_slug,
          department: job.department,
          category: job.category,
          location: job.location,
          workType: job.work_type === "On-site" ? "Onsite" : job.work_type,
          employmentType: job.employment_type,
          experienceMin: job.min_experience.toString(),
          experienceMax: job.max_experience.toString(),
          openings: job.openings.toString(),
          status: job.status === "Draft" ? "Published" : job.status, // Map Draft to Published if it exists
          overview: job.job_description,
          responsibilities: typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities,
          requiredSkills: typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : job.required_skills,
          niceToHaveSkills: typeof job.nice_to_have_skills === 'string' ? JSON.parse(job.nice_to_have_skills) : job.nice_to_have_skills
        });
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/careers/master/departments`);
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchCategories = async (departmentId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/careers/master/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department: departmentId }),
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBasicFormFields = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/careers/master/basic-form-fields`);
      const data = await response.json();
      if (data.success) {
        const mappedFields = data.data.map(field => ({
          id: field.id,
          label: field.field_label,
          type: field.field_type.toUpperCase(),
          required: field.is_required === 1 || field.is_required === true,
          placeholder: field.placeholder || "",
          helpText: field.helper_text || ""
        }));
        setFormFields(mappedFields);
      }
    } catch (error) {
      console.error("Error fetching basic form fields:", error);
    }
  };

  const [skillInput, setSkillInput] = useState("");
  const [niceSkillInput, setNiceSkillInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");

  const handleAddItem = (e, field, value, setter) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = value.trim();
      if (val && !jobData[field].includes(val)) {
        setJobData({ ...jobData, [field]: [...jobData[field], val] });
      }
      setter("");
    }
  };

  const removeListItem = (item, field) => {
    setJobData({ ...jobData, [field]: jobData[field].filter(i => i !== item) });
  };

  const [expandedFields, setExpandedFields] = useState([]);

  const toggleFieldExpand = (id) => {
    setExpandedFields(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const [applicationSteps, setApplicationSteps] = useState([
    { id: Date.now(), name: "Step 1", questions: [], isEditing: false }
  ]);

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      name: `Step ${applicationSteps.length + 1}`,
      questions: [],
      isEditing: false
    };
    setApplicationSteps([...applicationSteps, newStep]);
  };

  const removeStep = (stepId) => {
    if (applicationSteps.length > 1) {
      setApplicationSteps(applicationSteps.filter(s => s.id !== stepId));
    }
  };

  const toggleStepEdit = (stepId) => {
    setApplicationSteps(applicationSteps.map(s => 
      s.id === stepId ? { ...s, isEditing: !s.isEditing } : s
    ));
  };

  const renameStep = (stepId, newName) => {
    setApplicationSteps(applicationSteps.map(s => 
      s.id === stepId ? { ...s, name: newName } : s
    ));
  };

  const addQuestionToStep = (stepId) => {
    setApplicationSteps(applicationSteps.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          questions: [
            ...s.questions,
            { id: Date.now(), label: "New Question", type: "TEXT", required: false }
          ]
        };
      }
      return s;
    }));
  };

  const removeQuestionFromStep = (stepId, questionId) => {
    setApplicationSteps(applicationSteps.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          questions: s.questions.filter(q => q.id !== questionId)
        };
      }
      return s;
    }));
  };

  const [draggedAppItem, setDraggedAppItem] = useState(null);

  const handleAppDragStart = (e, stepId, index) => {
    setDraggedAppItem({ stepId, index });
    e.target.style.opacity = "0.5";
  };

  const handleAppDragEnter = (stepId, index) => {
    if (!draggedAppItem || draggedAppItem.stepId !== stepId || draggedAppItem.index === index) return;
    
    setApplicationSteps(applicationSteps.map(s => {
      if (s.id === stepId) {
        const newQuestions = [...s.questions];
        const draggedItem = newQuestions[draggedAppItem.index];
        newQuestions.splice(draggedAppItem.index, 1);
        newQuestions.splice(index, 0, draggedItem);
        return { ...s, questions: newQuestions };
      }
      return s;
    }));
    setDraggedAppItem({ stepId, index });
  };

  const handleAppDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedAppItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSubmit = async () => {
    try {
      const dept = departments.find(d => d.id === parseInt(jobData.department) || d.department_name === jobData.department);
      const deptName = dept ? dept.department_name : jobData.department;

      const cat = categories.find(c => c.id === parseInt(jobData.category) || c.category_name === jobData.category);
      const catName = cat ? cat.category_name : jobData.category;

      if (!jobData.title || !deptName || !catName) {
        toast.error("Please fill in the required fields (Title, Department, Category)");
        return;
      }

      const payload = {
        job_title: jobData.title,
        job_slug: jobData.slug,
        department: deptName,
        category: catName,
        location: jobData.location,
        work_type: jobData.workType === "Onsite" ? "On-site" : jobData.workType,
        employment_type: jobData.employmentType,
        min_experience: parseInt(jobData.experienceMin),
        max_experience: parseInt(jobData.experienceMax),
        openings: parseInt(jobData.openings),
        status: jobData.status,
        job_description: jobData.overview,
        required_skills: jobData.requiredSkills,
        nice_to_have_skills: jobData.niceToHaveSkills,
        responsibilities: jobData.responsibilities,
        created_by: 1
      };

      const url = isEditMode ? `${BASE_URL}/api/jobs/${uuid}` : `${BASE_URL}/api/jobs`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isEditMode ? "Job updated successfully!" : "Job created successfully!");
        navigate("/admin/jobs");
      } else {
        toast.error(data.message || `Failed to ${isEditMode ? "update" : "create"} job`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} job:`, error);
      toast.error("An error occurred");
    }
  };

  const departmentOptions = departments.map(d => ({ label: d.department_name, value: d.id.toString() }));
  const categoryOptions = categories.map(c => ({ label: c.category_name, value: c.id.toString() }));
  const workTypeOptions = ["Onsite", "Hybrid", "Remote"];
  const employmentTypeOptions = ["Full-time", "Part-time", "Contract", "Internship"];
  const statusOptions = [
    { label: "Published", value: "Published" },
    { label: "Closed", value: "Closed" }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#73BF44]/20 border-t-[#73BF44] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/jobs")}
            className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-[#73BF44] rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isEditMode ? "Edit Job" : "Create Job"}</h1>
            <p className="text-gray-500 font-normal text-sm mt-1">
              {isEditMode ? `Update details for ${jobData.title}` : "Fill in the details below to publish a new career opportunity."}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-8 min-w-max">
          <button 
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "details" 
                ? "text-[#73BF44]" 
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <FileText size={18} />
            Job Details
            {activeTab === "details" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#73BF44] rounded-full"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("forms")}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "forms" 
                ? "text-[#73BF44]" 
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            <ListChecks size={18} />
            Forms
            {activeTab === "forms" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#73BF44] rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8 min-h-[400px]">
        {activeTab === "details" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            {/* Basic Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#73BF44] rounded-full"></div>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Job Title</label>
                  <input 
                    type="text"
                    value={jobData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
                      setJobData({ ...jobData, title, slug });
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Slug</label>
                  <input 
                    type="text"
                    value={jobData.slug}
                    onChange={(e) => setJobData({ ...jobData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    placeholder="senior-product-designer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Department</label>
                  <CustomSelect 
                    variant="outline"
                    value={jobData.department}
                    onChange={(val) => setJobData({ ...jobData, department: val, category: "" })}
                    options={departmentOptions}
                    icon={Building2}
                    placeholder="Select Department"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Category</label>
                  <CustomSelect 
                    variant="outline"
                    value={jobData.category}
                    onChange={(val) => setJobData({ ...jobData, category: val })}
                    options={categoryOptions}
                    icon={Tag}
                    placeholder={jobData.department ? "Select Category" : "Choose Dept First"}
                    className={!jobData.department ? "opacity-50 pointer-events-none" : ""}
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Location</label>
                  <input 
                    type="text"
                    value={jobData.location}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    placeholder="e.g. Hyderabad"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Work Type</label>
                  <CustomSelect 
                    variant="outline"
                    value={jobData.workType}
                    onChange={(val) => setJobData({ ...jobData, workType: val })}
                    options={workTypeOptions}
                    icon={Monitor}
                    placeholder="Select Work Type"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Employment Type</label>
                  <CustomSelect 
                    variant="outline"
                    value={jobData.employmentType}
                    onChange={(val) => setJobData({ ...jobData, employmentType: val })}
                    options={employmentTypeOptions}
                    icon={Clock}
                    placeholder="Select Employment"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Experience Range (Years)</label>
                  <div className="flex gap-4">
                    <input 
                      type="number"
                      placeholder="Min"
                      value={jobData.experienceMin}
                      onChange={(e) => setJobData({ ...jobData, experienceMin: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    />
                    <input 
                      type="number"
                      placeholder="Max"
                      value={jobData.experienceMax}
                      onChange={(e) => setJobData({ ...jobData, experienceMax: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Openings</label>
                  <input 
                    type="number"
                    value={jobData.openings}
                    onChange={(e) => setJobData({ ...jobData, openings: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Status</label>
                  <CustomSelect 
                    variant="outline"
                    value={jobData.status}
                    onChange={(val) => setJobData({ ...jobData, status: val })}
                    options={statusOptions}
                    icon={CircleDot}
                    placeholder="Select Status"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#73BF44] rounded-full"></div>
                Job Description
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Overview</label>
                  <textarea 
                    rows="4"
                    value={jobData.overview}
                    onChange={(e) => setJobData({ ...jobData, overview: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal resize-none"
                    placeholder="Briefly describe the role and company mission..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Key Responsibilities</label>
                  <div className="space-y-3 mb-4">
                    {jobData.responsibilities.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl group hover:border-[#73BF44]/30 transition-all">
                        <div className="w-1.5 h-1.5 bg-[#73BF44] rounded-full"></div>
                        <span className="flex-1 text-sm text-gray-700">{item}</span>
                        <button 
                          onClick={() => removeListItem(item, 'responsibilities')}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <input 
                      type="text"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={(e) => handleAddItem(e, 'responsibilities', responsibilityInput, setResponsibilityInput)}
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal pr-24"
                      placeholder="Type a responsibility and press Enter..."
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                      Press Enter
                    </div>
                  </div>
                </div>
                
                {/* Skills Builder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Required Skills</label>
                    <div className="space-y-3 mb-4">
                      {jobData.requiredSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-[#73BF44]/5 border border-[#73BF44]/10 rounded-xl group hover:border-[#73BF44]/30 transition-all">
                          <div className="w-1.5 h-1.5 bg-[#73BF44] rounded-full shadow-[0_0_8px_rgba(115,191,68,0.5)]"></div>
                          <span className="flex-1 text-sm font-medium text-gray-700">{skill}</span>
                          <button 
                            onClick={() => removeListItem(skill, 'requiredSkills')}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal pr-24"
                        placeholder="e.g. React.js"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => handleAddItem(e, 'requiredSkills', skillInput, setSkillInput)}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                        Press Enter
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Nice-to-have Skills</label>
                    <div className="space-y-3 mb-4">
                      {jobData.niceToHaveSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl group hover:border-[#73BF44]/30 transition-all">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span className="flex-1 text-sm font-medium text-gray-700">{skill}</span>
                          <button 
                            onClick={() => removeListItem(skill, 'niceToHaveSkills')}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal pr-24"
                        placeholder="e.g. Docker"
                        value={niceSkillInput}
                        onChange={(e) => setNiceSkillInput(e.target.value)}
                        onKeyDown={(e) => handleAddItem(e, 'niceToHaveSkills', niceSkillInput, setNiceSkillInput)}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                        Press Enter
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Form Builder Section */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#73BF44] rounded-full"></div>
                  Basic Form Fields
                </h2>
              </div>

              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="group relative border border-gray-100 bg-gray-50/30 rounded-2xl p-6 transition-all"
                  >
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-1 flex justify-center text-gray-300">
                        <ListChecks size={20} />
                      </div>
                      <div className="col-span-6">
                        <label className="block text-xs font-normal text-gray-500 uppercase tracking-[0.15em] mb-1.5">Label</label>
                        <div className="w-full px-4 py-2.5 bg-gray-100/50 border border-gray-100 rounded-lg text-sm font-bold text-gray-700">
                          {field.label}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs font-normal text-gray-500 uppercase tracking-[0.15em] mb-1.5">Type</label>
                        <div className="w-full px-4 py-2.5 bg-gray-100/50 border border-gray-100 rounded-lg text-sm font-normal text-gray-600">
                          {field.type}
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center mt-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full border ${field.required ? "bg-[#73BF44] border-[#73BF44]" : "border-gray-200"} flex items-center justify-center transition-all shadow-sm`}>
                            {field.required && <Check size={12} className="text-white stroke-[3px]" />}
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Application Form Builder</h2>
                <button 
                  onClick={addStep}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold text-xs hover:bg-gray-200 transition-all active:scale-95"
                >
                  <Layers size={16} /> Add Step
                </button>
              </div>

              <div className="space-y-8">
                {applicationSteps.map((step) => (
                  <div key={step.id} className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-gray-100/50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {step.isEditing ? (
                            <input 
                              autoFocus
                              type="text" 
                              value={step.name}
                              onChange={(e) => renameStep(step.id, e.target.value)}
                              onBlur={() => toggleStepEdit(step.id)}
                              onKeyDown={(e) => e.key === "Enter" && toggleStepEdit(step.id)}
                              className="text-sm font-bold text-gray-900 border-b border-[#73BF44] bg-transparent outline-none min-w-[150px]"
                            />
                          ) : (
                            <h3 className="text-sm font-bold text-gray-700">{step.name}</h3>
                          )}
                        </div>
                        <button 
                          onClick={() => toggleStepEdit(step.id)}
                          className="p-1 text-gray-400 hover:text-[#73BF44] transition-colors"
                        >
                          <Settings2 size={16} />
                        </button>
                      </div>
                      {applicationSteps.length > 1 && (
                        <button 
                          onClick={() => removeStep(step.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="p-8 space-y-4">
                      {step.questions.map((question, index) => (
                        <div 
                          key={question.id}
                          className={`group relative border border-gray-100 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all`}
                        >
                          <div className="grid grid-cols-12 gap-6 items-center">
                            <div className="col-span-1 flex justify-center text-gray-300">
                              <GripVertical size={20} />
                            </div>
                            <div className="col-span-5">
                              <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1.5">Question Label</label>
                              <input 
                                type="text" 
                                defaultValue={question.label}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-bold"
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1.5">Type</label>
                              <CustomSelect 
                                variant="outline"
                                value={question.type}
                                onChange={(val) => {
                                  setApplicationSteps(applicationSteps.map(s => {
                                    if (s.id === step.id) {
                                      return {
                                        ...s,
                                        questions: s.questions.map(q => q.id === question.id ? { ...q, type: val } : q)
                                      };
                                    }
                                    return s;
                                  }));
                                }}
                                options={["TEXT", "LONG TEXT", "MULTIPLE CHOICE", "FILE UPLOAD"]}
                                placeholder="Select Type"
                              />
                            </div>
                            <div className="col-span-2 flex items-center mt-6">
                              <label className="flex items-center gap-2 cursor-pointer group/check">
                                <input 
                                  type="checkbox" 
                                  defaultChecked={question.required} 
                                  onChange={(e) => {
                                    setApplicationSteps(applicationSteps.map(s => {
                                      if (s.id === step.id) {
                                        return {
                                          ...s,
                                          questions: s.questions.map(q => q.id === question.id ? { ...q, required: e.target.checked } : q)
                                        };
                                      }
                                      return s;
                                    }));
                                  }}
                                  className="w-4 h-4 rounded border-gray-300 text-[#73BF44] focus:ring-[#73BF44]/20" 
                                />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover/check:text-gray-600 transition-colors">Required</span>
                              </label>
                            </div>
                            <div className="col-span-1 flex justify-end mt-6">
                              <button 
                                onClick={() => removeQuestionFromStep(step.id, question.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addQuestionToStep(step.id)}
                        className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 hover:text-[#73BF44] hover:border-[#73BF44]/30 transition-all flex items-center justify-center gap-2 group"
                      >
                        <Plus size={20} className="group-hover:scale-125 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Add Question</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION BUTTONS */}
      <div className="flex justify-end items-center gap-4 mt-12 pt-8 border-t border-gray-100">
        {activeTab === "forms" && (
          <button 
            onClick={() => setActiveTab("details")}
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        )}
        {activeTab === "details" ? (
          <button 
            onClick={() => setActiveTab("forms")}
            className="flex items-center gap-2 px-8 py-3 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all hover:scale-105 active:scale-95 group"
          >
            Next <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all hover:scale-105 active:scale-95"
          >
            {isEditMode ? <Save size={18} /> : <Plus size={18} />}
            {isEditMode ? "Update Job" : "Create Job"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
