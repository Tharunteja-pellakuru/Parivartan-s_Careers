import React, { useState } from "react";
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
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateJob = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [jobData, setJobData] = useState({
    title: "",
    slug: "",
    department: "Development",
    category: "Full Stack Developer",
    location: "Hyderabad",
    workType: "Onsite",
    employmentType: "Full-time",
    experienceMin: "1",
    experienceMax: "3",
    openings: "3",
    status: "Published",
    overview: "",
    responsibilities: "",
    requiredSkills: [],
    niceToHaveSkills: []
  });

  const [formFields, setFormFields] = useState([
    { id: 1, label: "Full Name", type: "TEXT", required: true },
    { id: 2, label: "Email", type: "EMAIL", required: true },
    { id: 3, label: "Phone Number", type: "NUMBER", required: true },
    { id: 4, label: "Resume Upload", type: "FILE", required: true },
    { id: 5, label: "LinkedIn URL", type: "URL", required: false },
  ]);

  const [skillInput, setSkillInput] = useState("");
  const [niceSkillInput, setNiceSkillInput] = useState("");

  const handleAddSkill = (e, field) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !jobData[field].includes(val)) {
        setJobData({ ...jobData, [field]: [...jobData[field], val] });
      }
      if (field === 'requiredSkills') setSkillInput("");
      else setNiceSkillInput("");
    }
  };

  const removeSkill = (skill, field) => {
    setJobData({ ...jobData, [field]: jobData[field].filter(s => s !== skill) });
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

  const [draggedAppItem, setDraggedAppItem] = useState(null); // { stepId, index }

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

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.target.style.opacity = "0.5";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (index) => {
    if (draggedItemIndex === index) return;
    const newItems = [...formFields];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setFormFields(newItems);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItemIndex(null);
  };

  const addFormField = () => {
    const newField = {
      id: Date.now(),
      label: "New Field",
      type: "TEXT",
      required: false
    };
    setFormFields([...formFields, newField]);
  };

  const removeFormField = (id) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Job</h1>
        <p className="text-gray-500 font-normal text-sm mt-1">Fill in the details below to publish a new career opportunity.</p>
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
      <div className="space-y-8">
        {activeTab === "details" ? (
          <div className="space-y-6">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Slug</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    placeholder="senior-product-designer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Department</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal appearance-none">
                    <option>Design</option>
                    <option>Development</option>
                    <option>Marketing</option>
                    <option>Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal appearance-none">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>UI/UX Designer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Location</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    defaultValue="Hyderabad"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Work Type</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal appearance-none">
                    <option>Onsite</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Employment Type</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal appearance-none">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Experience Range (Years)</label>
                  <div className="flex gap-4">
                    <input 
                      type="number"
                      placeholder="Min"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    />
                    <input 
                      type="number"
                      placeholder="Max"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Openings</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                    defaultValue="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Save As</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal text-[#73BF44] appearance-none">
                    <option>Published</option>
                    <option>Draft / Closed</option>
                  </select>
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal resize-none"
                    placeholder="Briefly describe the role and company mission..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Responsibilities</label>
                  <textarea 
                    rows="6"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal resize-none"
                    placeholder="List the key responsibilities..."
                  ></textarea>
                </div>
                
                {/* Skills Builder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Required Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {jobData.requiredSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#73BF44]/10 text-[#73BF44] rounded-lg text-xs font-bold">
                          {skill}
                          <button onClick={() => removeSkill(skill, 'requiredSkills')}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                      placeholder="Type and press Enter..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => handleAddSkill(e, 'requiredSkills')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">Nice-to-have Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {jobData.niceToHaveSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                          {skill}
                          <button onClick={() => removeSkill(skill, 'niceToHaveSkills')}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                      placeholder="Type and press Enter..."
                      value={niceSkillInput}
                      onChange={(e) => setNiceSkillInput(e.target.value)}
                      onKeyDown={(e) => handleAddSkill(e, 'niceToHaveSkills')}
                    />
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
                  Basic Form
                </h2>
                <button 
                  onClick={addFormField}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#73BF44] text-white rounded-xl font-bold text-xs hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95"
                >
                  <Plus size={16} /> Add Field
                </button>
              </div>

              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div 
                    key={field.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    className={`group relative border border-gray-100 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-default ${
                      draggedItemIndex === index ? "border-[#73BF44] bg-gray-50/50 scale-[0.98] z-50 shadow-lg" : ""
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-1 flex justify-center text-gray-300 cursor-grab active:cursor-grabbing group-hover:text-[#73BF44] transition-colors">
                        <GripVertical size={20} />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-normal text-gray-500 uppercase tracking-[0.15em] mb-1.5">Label</label>
                        <input 
                          type="text" 
                          defaultValue={field.label}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs font-normal text-gray-500 uppercase tracking-[0.15em] mb-1.5">Type</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal appearance-none">
                          <option>{field.type}</option>
                          <option>TEXT</option>
                          <option>EMAIL</option>
                          <option>NUMBER</option>
                          <option>FILE</option>
                          <option>URL</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex items-center mt-6">
                        <label className="flex items-center gap-2 cursor-pointer group/check">
                          <input type="checkbox" defaultChecked={field.required} className="w-4 h-4 rounded border-gray-300 text-[#73BF44] focus:ring-[#73BF44]/20" />
                          <span className="text-xs font-bold text-gray-500 group-hover/check:text-gray-700 transition-colors">Required</span>
                        </label>
                      </div>
                      <div className="col-span-1 flex justify-end mt-6">
                        <button 
                          onClick={() => removeFormField(field.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleFieldExpand(field.id)}
                      className="flex items-center gap-1.5 text-[10px] font-normal text-[#73BF44] mt-4 ml-11 hover:underline tracking-wider uppercase transition-all"
                    >
                      <Settings2 size={12} /> Advanced Settings
                    </button>

                    {expandedFields.includes(field.id) && (
                      <div className="mt-4 ml-11 p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-[0.15em] mb-1.5">Placeholder</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal"
                              placeholder="e.g. John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-[0.15em] mb-1.5">Help Text</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal"
                              placeholder="Describe this field's purpose"
                            />
                          </div>
                        </div>
                      </div>
                    )}
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
                          draggable
                          onDragStart={(e) => handleAppDragStart(e, step.id, index)}
                          onDragOver={handleDragOver}
                          onDragEnter={() => handleAppDragEnter(step.id, index)}
                          onDragEnd={handleAppDragEnd}
                          className={`group relative border border-gray-100 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                            draggedAppItem?.stepId === step.id && draggedAppItem?.index === index ? "border-[#73BF44] bg-gray-50/50 scale-[0.98] z-50 shadow-lg" : ""
                          }`}
                        >
                          <div className="grid grid-cols-12 gap-6 items-center">
                            <div className="col-span-1 flex justify-center text-gray-300 cursor-grab active:cursor-grabbing group-hover:text-[#73BF44] transition-colors">
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
                              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal appearance-none">
                                <option>{question.type}</option>
                                <option>SHORT TEXT</option>
                                <option>LONG TEXT</option>
                                <option>MULTIPLE CHOICE</option>
                                <option>FILE UPLOAD</option>
                              </select>
                            </div>
                            <div className="col-span-2 flex items-center mt-6">
                              <label className="flex items-center gap-2 cursor-pointer group/check">
                                <input type="checkbox" defaultChecked={question.required} className="w-4 h-4 rounded border-gray-300 text-[#73BF44] focus:ring-[#73BF44]/20" />
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
                          <button 
                            onClick={() => toggleFieldExpand(question.id)}
                            className="flex items-center gap-1.5 text-[10px] font-normal text-[#73BF44] mt-4 ml-11 hover:underline tracking-wider uppercase transition-all"
                          >
                            <Settings2 size={12} /> Advanced Settings
                          </button>
                          {expandedFields.includes(question.id) && (
                            <div className="mt-4 ml-11 p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-6 animate-in slide-in-from-top-2 duration-300">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-[0.15em] mb-1.5">Placeholder</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal"
                                    placeholder="e.g. Type your answer..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-normal text-gray-400 uppercase tracking-[0.15em] mb-1.5">Help Text</label>
                                  <input 
                                    type="text" 
                                    className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#73BF44]/20 transition-all text-sm font-normal"
                                    placeholder="Instructions for candidates"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button 
                        onClick={() => addQuestionToStep(step.id)}
                        className="w-full py-6 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 group hover:border-[#73BF44] hover:bg-white transition-all text-gray-400 hover:text-[#73BF44]"
                      >
                        <Plus size={18} />
                        <span className="text-sm font-medium">Add Question to {step.name}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions - non-sticky */}
      <div className="pt-12 pb-20 flex justify-end items-center gap-4">
        <button 
          onClick={() => setActiveTab("details")}
          className={`px-10 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all ${activeTab === "details" ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={activeTab === "details"}
        >
          Back
        </button>
        {activeTab === "details" ? (
          <button 
            onClick={() => setActiveTab("forms")}
            className="flex items-center gap-2 px-12 py-3 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95"
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-12 py-3 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95">
            <Briefcase size={18} /> Create Job
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
