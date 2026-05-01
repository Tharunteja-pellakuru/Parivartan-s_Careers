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
  const [basicFields, setBasicFields] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
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
      
      if (jobData.success) {
        const foundJob = jobData.data.find(j => j.job_slug === slug);
        if (foundJob) {
          setJob(foundJob);
        } else {
          toast.error("Job not found");
          navigate("/positions");
          return;
        }
      }

      // Fetch Basic Form Fields
      const formResponse = await fetch(`${BASE_URL}/api/careers/master/basic-form-fields`);
      const formData = await formResponse.json();
      
      if (formData.success) {
        const mappedFields = formData.data.map(field => ({
          id: field.id.toString(),
          name: field.field_label.toLowerCase().replace(/\s+/g, '_'),
          label: field.field_label,
          type: field.field_type.toLowerCase(),
          required: field.is_required === 1 || field.is_required === true,
          placeholder: field.placeholder || "",
          helpText: field.helper_text || "",
          options: field.options ? JSON.parse(field.options) : null
        }));
        setBasicFields(mappedFields);
      }
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
      if (field.type === "url" && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
        return "Invalid URL";
      }
    }
    return null;
  };

  const validateStep = () => {
    const newErrors = {};
    let isValid = true;

    basicFields.forEach((field) => {
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

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      const fd = new FormData();
      fd.append("job_id", job.id);
      
      // Map data for backend
      const applicationData = basicFields.map(field => ({
        id: field.id,
        label: field.label,
        value: formData[field.id]
      }));
      
      fd.append("applicationData", JSON.stringify(applicationData));
      
      // Handle file uploads (e.g. Resume)
      basicFields.forEach(field => {
        if (field.type === "file" && formData[field.id] instanceof File) {
          fd.append(field.name, formData[field.id]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/applicants`, {
        method: "POST",
        body: fd,
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

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
                Personal Information
              </h2>
              <p className="text-slate-500">
                Please provide your contact details and resume.
              </p>
            </div>

            <div className="space-y-6">
              {basicFields.map((field) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={handleFieldChange}
                  error={errors[field.id]}
                />
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-slate-900 hover:bg-[#73BF44] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"} <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
