import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DynamicField from "../components/common/DynamicField";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Save,
  Edit2,
  ArrowLeft,
  FileText,
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  Send,
} from "lucide-react";
import { BASE_URL } from "../constants/index.js";

const ApplyJob = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [job, setJob] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchJobAndFormFields();
  }, [slug]);

  const fetchJobAndFormFields = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Job Details
      const jobResponse = await fetch(`${BASE_URL}/api/jobs`);
      const jobData = await jobResponse.json();
      
      let foundJob = null;
      if (jobData.success) {
        foundJob = jobData.data.find(j => j.job_slug === slug);
        if (foundJob) {
          setJob(foundJob);
        } else {
          toast.error("Job not found");
          navigate("/positions");
          return;
        }
      }

      const allSteps = [];

      // 1. Fetch Basic Form Fields (Step 1)
      const basicFormResponse = await fetch(`${BASE_URL}/api/careers/master/basic-form-fields`);
      const basicFormData = await basicFormResponse.json();
      
      if (basicFormData.success) {
        const mappedBasicFields = basicFormData.data.map(field => ({
          id: field.id.toString(),
          name: field.field_label.toLowerCase().replace(/\s+/g, '_'),
          label: field.field_label,
          type: field.field_type.toLowerCase(),
          required: field.is_required === 1 || field.is_required === true,
          placeholder: field.placeholder || "",
          helpText: field.helper_text || "",
          options: typeof field.field_options === 'string' ? JSON.parse(field.field_options) : field.field_options
        }));
        
        allSteps.push({
          name: "Personal Information",
          description: "Please provide your contact details and resume.",
          fields: mappedBasicFields
        });
      }

      // 2. Fetch Dynamic Application Fields (Subsequent Steps)
      if (foundJob) {
        const appFieldsResponse = await fetch(`${BASE_URL}/api/job-application-fields/job/${foundJob.id}`);
        const appFieldsData = await appFieldsResponse.json();

        if (appFieldsData.success && appFieldsData.data.length > 0) {
          const stepsMap = {};
          appFieldsData.data.forEach(field => {
            if (!stepsMap[field.step_number]) {
              stepsMap[field.step_number] = {
                name: field.step_name,
                description: "Please fill in the details below.",
                fields: []
              };
            }
            const fieldOptions = typeof field.field_options === 'string' ? JSON.parse(field.field_options) : field.field_options;
          
            const fieldObj = {
              id: `custom_${field.id}`,
              name: field.field_name,
              label: field.field_name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              type: field.field_type === 'select' ? 'dropdown' : field.field_type,
              required: field.is_required === 1,
              placeholder: field.placeholder_text,
              helpText: field.helper_text,
              options: field.field_type === 'range' ? null : fieldOptions
            };

            if (field.field_type === 'range' && fieldOptions) {
              fieldObj.validation = {
                min: fieldOptions.min,
                max: fieldOptions.max,
                step: fieldOptions.step
              };
              fieldObj.defaultValue = fieldOptions.defaultValue;
            }

            stepsMap[field.step_number].fields.push(fieldObj);
          });

          const sortedAppSteps = Object.values(stepsMap).sort((a, b) => a.step_number - b.step_number);
          allSteps.push(...sortedAppSteps);
        }
      }

      setSteps(allSteps);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load application form");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const validateField = (field, value) => {
    if (field.required) {
      if (value === null || value === undefined || value === "")
        return "This field is required";
      if (Array.isArray(value) && value.length === 0)
        return "Please select at least one option";
    }

    if (value) {
      if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Invalid email address";
      }
      if (field.type === "url" && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(value)) {
        return "Invalid URL";
      }
    }
    return null;
  };

  const validateStep = () => {
    if (steps.length === 0) return true;
    
    const currentFields = steps[currentStep].fields;
    const newErrors = {};
    let isValid = true;

    currentFields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (!isValid) {
      toast.error("Please fix the errors before proceeding.");
    }
    return isValid;
  };

  const handleFieldChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[id];
        return newErr;
      });
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      // Structure the data for the new backend
      const basicInfo = {};
      const answers = [];

      steps.forEach(step => {
        step.fields.forEach(field => {
          const val = formData[field.id];
          
          // Map basic info fields
          if (field.name === 'full_name' || field.label === 'Full Name') basicInfo.applicant_name = val;
          if (field.name === 'email' || field.label === 'Email') basicInfo.applicant_email = val;
          if (field.name === 'phone_number' || field.label === 'Phone Number') basicInfo.applicant_phone = val;
          if (field.name === 'resume' || field.label === 'Resume') basicInfo.resume_file = val?.name || val;

          // Add to answers array for custom fields (including basic ones for record)
          if (field.id.toString().startsWith('custom_')) {
            answers.push({
              field_id: field.id.replace('custom_', ''),
              field_value: typeof val === 'object' ? JSON.stringify(val) : val
            });
          }
        });
      });

      const payload = {
        job_id: job.id,
        applicant_name: basicInfo.applicant_name,
        applicant_email: basicInfo.applicant_email,
        applicant_phone: basicInfo.applicant_phone,
        resume_file: basicInfo.resume_file,
        answers: answers
      };

      const response = await fetch(`${BASE_URL}/api/job-applications/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Application submitted successfully!", { id: loadingToast });
        setIsSuccess(true);
      } else {
        throw new Error(result.message || "Failed to submit");
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-500 gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-[#73BF44]" />
        <p className="font-medium animate-pulse">Loading application...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-slate-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
            Application Submitted!
          </h2>
          <p className="text-slate-600 mb-10 text-lg leading-relaxed">
            Thank you for applying to <br />
            <span className="font-bold text-[#73BF44]">{job.job_title}</span>.
            <br />
            We've received your application and will be in touch soon.
          </p>
          <button
            onClick={() => navigate("/positions")}
            className="w-full bg-slate-900 hover:bg-[#73BF44] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Positions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-10 pb-32 font-sans" ref={topRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <Link
            to={`/positions/${slug}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#73BF44] mb-6 transition-colors font-medium group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Job Details
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-heading">
                Apply for <span className="text-[#73BF44]">{job.job_title}</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-600 font-medium text-sm">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <MapPin size={14} className="text-[#73BF44]" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <Briefcase size={14} className="text-[#73BF44]" /> {job.employment_type}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        {steps.length > 1 && (
          <div className="mb-8 flex items-center justify-between px-2">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    idx === currentStep 
                      ? "bg-[#73BF44] text-white shadow-lg shadow-[#73BF44]/30 scale-110" 
                      : idx < currentStep 
                        ? "bg-green-100 text-[#73BF44]" 
                        : "bg-slate-100 text-slate-400"
                  }`}>
                    {idx < currentStep ? <CheckCircle size={20} /> : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${idx === currentStep ? "text-slate-900" : "text-slate-400"}`}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-700 ${idx < currentStep ? "bg-[#73BF44]" : "bg-slate-100"}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[400px]">
          <div className="p-8 md:p-12">
            {steps[currentStep] && (
              <>
                <div className="mb-8 border-b border-slate-100 pb-6 animate-in fade-in slide-in-from-left-2 duration-500">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
                    {steps[currentStep].name}
                  </h2>
                  <p className="text-slate-500">
                    {steps[currentStep].description}
                  </p>
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {steps[currentStep].fields.map((field) => (
                    <DynamicField
                      key={field.id}
                      field={field}
                      value={formData[field.id]}
                      onChange={handleFieldChange}
                      error={errors[field.id]}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
              {currentStep > 0 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Previous
                </button>
              ) : <div></div>}
              
              <button
                onClick={nextStep}
                disabled={isSubmitting}
                className={`bg-slate-900 hover:bg-[#73BF44] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : currentStep === steps.length - 1 ? "Submit Application" : "Next Step"} 
                {currentStep === steps.length - 1 ? <Send size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
