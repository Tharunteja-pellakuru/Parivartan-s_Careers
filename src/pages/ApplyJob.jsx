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
  const [jobsList, setJobsList] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  // Helper function to create slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const response = await fetch(`${BASE_URL}/jobs`);
      const data = await response.json();
      const validJobs = Array.isArray(data) ? data : data.jobs || [];
      const openJobs = validJobs.filter(
        (job) => job.details.status?.toLowerCase() !== "closed",
      );
      setJobsList(openJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Schema & Job Data
  const [schema, setSchema] = useState(null); // Now holds the transformed "steps" structure
  const [job, setJob] = useState(null);

  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 2. Data Loading & Transformation ---
  useEffect(() => {
    if (!jobsList.length) return;

    const foundJob = jobsList.find(
      (j) =>
        createSlug(j.job_title) === slug || String(j.uuid) === String(slug),
    );

    if (!foundJob) return;

    setJob(foundJob);

    const basicForm = foundJob.basicFormSchema || [];
    const appForm = Array.isArray(foundJob.applicationFormSchema)
      ? foundJob.applicationFormSchema
      : [];

    // -------------- BUILD STEPS ---------------
    const steps = [];

    // STEP 1 ? PERSONAL INFORMATION
    steps.push({
      step: 1,
      title: "Personal Information",
      fields: basicForm,
    });

    // STEP 2+ ? APPLICATION FORM STEPS
    appForm.forEach((stepObj, index) => {
      steps.push({
        step: index + 2,
        title: stepObj.stepName || stepObj.title || `Step ${index + 2}`,
        fields: stepObj.questions || [],
      });
    });

    const transformedSchema = { steps };

    // Add default values
    const defaults = {};
    [...basicForm, ...appForm.flatMap((s) => s.questions || [])].forEach(
      (field) => {
        if (field.defaultValue !== undefined)
          defaults[field.id] = field.defaultValue;
      },
    );

    setSchema(transformedSchema);
    setFormData((prev) => ({ ...defaults, ...prev }));
  }, [slug, jobsList]);

  // Scroll to top on step change
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  // --- 3. Validation Engine ---
  // Helper function to validate URLs comprehensively
  const isValidUrl = (urlString) => {
    try {
      // First try native URL parsing (handles most cases)
      if (urlString.includes("://") || urlString.startsWith("localhost")) {
        new URL(
          urlString.startsWith("localhost") ? "http://" + urlString : urlString,
        );
        return true;
      }
      // For URLs without protocol, prepend https and try
      new URL("https://" + urlString);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (field, value) => {
    if (field.required) {
      if (value === null || value === undefined || value === "")
        return "This field is required";
      if (Array.isArray(value) && value.length === 0)
        return "Please select at least one option";
      if (field.type === "file" && !value) return "Please upload a file";
    }

    if (value) {
      const emailStrictRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
      if (field.type === "email" && !emailStrictRegex.test(value)) {
        return "Invalid email address";
      }

      // Check for Full Name (Alphabets and spaces only)
      if (
        (field.label === "Full Name" || field.name === "full_name") &&
        !/^[a-zA-Z\s]+$/.test(value)
      ) {
        return "Full Name must contain only alphabets and spaces";
      }

      if (field.type === "url" && !isValidUrl(value)) {
        return "Invalid URL (e.g., https://linkedin.com/in/profile or example.com)";
      }
      if (field.type === "number" && isNaN(value)) {
        return "Must be a number";
      }
      if (field.type === "number" && Number(value) < 0) {
        return "Value cannot be negative";
      }
      const isPhone =
        field.type === "phone" ||
        /phone|mobile|contact/i.test(field.label || "") ||
        /phone|mobile|contact/i.test(field.name || "");

      if (isPhone) {
        if (!/^\d+$/.test(value))
          return "Phone number must contain only numbers";
        if (!/^\d{10}$/.test(value))
          return "Phone number must be exactly 10 digits";
      }

      // File Type Validation
      if (field.type === "file" && value) {
        const allowedFormats = field.validation?.allowedFormats;
        if (Array.isArray(allowedFormats) && allowedFormats.length > 0) {
          const fileName = value.name.toLowerCase();
          const isValid = allowedFormats.some((format) =>
            fileName.endsWith(format.toLowerCase().trim()),
          );
          if (!isValid) {
            return `Invalid file type. Allowed: ${allowedFormats.join(", ")}`;
          }
        }
      }
    }
    return null;
  };

  const validateStep = (stepIndex) => {
    if (!schema) return false;
    const currentStepFields = schema.steps[stepIndex].fields;
    const newErrors = {};
    let isValid = true;

    currentStepFields.forEach((field) => {
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

  // --- Load Saved Progress ---
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (slug) {
      const savedData = localStorage.getItem(`job_application_${slug}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Only restore if it matches the current job
          setFormData((prev) => ({ ...prev, ...parsed }));

          if (!toastShownRef.current) {
            toast.success("Resumed from saved progress", { icon: "??" });
            toastShownRef.current = true;
          }
        } catch (e) {
          console.error("Failed to parse saved progress", e);
        }
      }
    }
  }, [slug]);

  const handleSave = () => {
    try {
      // Filter out File objects as they can't be stringified
      const dataToSave = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (!(value instanceof File)) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      localStorage.setItem(
        `job_application_${slug}`,
        JSON.stringify(dataToSave),
      );
      toast.success("Progress saved locally!");
    } catch (e) {
      console.error("Failed to save progress", e);
      toast.error("Failed to save progress");
    }
  };

  // --- 4. Handlers ---
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

  const handleNext = () => {
    if (validateStep(currentStep - 1)) {
      setCurrentStep((prev) => prev + 1);
      // Auto-save on next
      handleSave();
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      const fd = new FormData();

      // 1. Attach job ID
      fd.append("job_id", job.id);

      // --------------------------------------------------------
      // 2. Build BASIC FORM DATA (step 1)
      // --------------------------------------------------------
      const basicFields = schema.steps[0].fields;

      const basicFormData = basicFields.map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        value:
          f.type === "file"
            ? formData[f.id]?.name || null
            : formData[f.id] || "",
      }));

      fd.append("basicFormData", JSON.stringify(basicFormData));

      // Attach actual resume file
      const resumeField = basicFields.find((f) => f.type === "file");
      if (resumeField && formData[resumeField.id] instanceof File) {
        fd.append("resume", formData[resumeField.id]);
      }

      // --------------------------------------------------------
      // 3. Build APPLICATION FORM STEP WISE DATA
      // --------------------------------------------------------

      const applicationSteps = schema.steps.slice(1);

      const applicationFormData = applicationSteps.map((step) => ({
        stepId: step.step,
        stepName: step.title,
        questions: step.fields.map((q) => ({
          id: q.id,
          label: q.label,
          type: q.type,
          value:
            q.type === "file"
              ? formData[q.id]?.name || null
              : Array.isArray(formData[q.id])
                ? formData[q.id]
                : (formData[q.id] ?? ""),
        })),
      }));

      fd.append("applicationFormData", JSON.stringify(applicationFormData));

      // --------------------------------------------------------
      // 4. API CALL
      // --------------------------------------------------------
      const response = await fetch(`${BASE_URL}/applicants`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: fd,
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // If not JSON (likely HTML error page for 413/500), read text
        const text = await response.text();

        throw new Error(
          "Submission failed: Please check your file size and type.",
        );
      }

      if (!response.ok) throw new Error(data.message || "Submission failed");

      toast.success("Application submitted successfully!", {
        id: loadingToast,
      });

      // Clear saved progress on success
      localStorage.removeItem(`job_application_${slug}`);

      setIsSuccess(true);
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err.message || "Failed to submit", { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  // --- 5. Renders ---

  if (isLoadingJobs || !job || !schema) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-500 gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-brand-500" />
        <p className="font-medium animate-pulse">Loading application...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-slate-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
            Application Submitted!
          </h2>
          <p className="text-slate-600 mb-10 text-lg leading-relaxed">
            Thank you for applying to <br />
            <span className="font-bold text-brand-600">{job.job_title}</span>.
            <br />
            We've received your application and will be in touch soon.
          </p>
          <button
            onClick={() => navigate("/positions")}
            className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Positions
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = schema.steps.length + 1; // +1 for Review step
  const isReviewStep = currentStep === totalSteps;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="bg-white min-h-screen pt-10 pb-32 font-sans" ref={topRef}>
      {/* Background Decoration - REMOVED */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="mb-10 animate-fade-in-up">
          <Link
            to={`/positions`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 transition-colors font-medium group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Jobs
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-heading">
                Apply for{" "}
                <span className="text-brand-600">{job.job_title}</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-600 font-medium text-sm">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <MapPin size={14} className="text-brand-500" />{" "}
                  {job.details.location}
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <Briefcase size={14} className="text-brand-500" />{" "}
                  {job.details.type}
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <Clock size={14} className="text-brand-500" />{" "}
                  {job.details.experienceRange.min}-
                  {job.details.experienceRange.max} Years
                </div>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {isReviewStep
                    ? "Review"
                    : schema.steps[currentStep - 1]?.title}
                </span>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={126}
                    strokeDashoffset={
                      126 - 126 * ((currentStep - 1) / (totalSteps - 1))
                    }
                    className="text-brand-500 transition-all duration-500 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-brand-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Main Form Card */}
          <div
            className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Top Progress Line */}
            <div className="h-1.5 w-full bg-white">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="p-6 md:p-12 min-h-[500px] flex flex-col">
              {!isReviewStep ? (
                // RENDER REGULAR STEPS
                <div className="flex-grow animate-in fade-in slide-in-from-right-4 duration-300 key={currentStep}">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
                      {schema.steps[currentStep - 1].title}
                    </h2>
                    <p className="text-slate-500">
                      Please fill in the details below.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {schema.steps[currentStep - 1].fields.map((field) => (
                      <DynamicField
                        key={field.id}
                        field={field}
                        value={formData[field.id]}
                        onChange={handleFieldChange}
                        error={errors[field.id]}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // RENDER DYNAMIC REVIEW PAGE
                <div className="flex-grow animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-brand-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
                      Review Application
                    </h2>
                    <p className="text-slate-500">
                      Please review your answers before submitting.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {schema.steps.map((step, idx) => (
                      <div
                        key={step.step || idx}
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-200 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <span className="bg-brand-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              {idx + 1}
                            </span>
                            {step.title}
                          </h3>
                          <button
                            onClick={() => setCurrentStep(idx + 1)}
                            className="text-slate-400 hover:text-brand-600 text-sm font-bold flex items-center gap-1 transition-colors px-3 py-1 rounded-full hover:bg-white"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                          {step.fields.map((field) => {
                            let displayValue = formData[field.id];

                            // Format display value based on type
                            if (field.type === "file" && displayValue) {
                              displayValue = (
                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="bg-brand-100 p-2 rounded-md">
                                    <FileText
                                      size={18}
                                      className="text-brand-600"
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
                                    {displayValue.name}
                                  </span>
                                </div>
                              );
                            } else if (Array.isArray(displayValue)) {
                              displayValue = (
                                <div className="flex flex-wrap gap-2">
                                  {displayValue.map((v, i) => (
                                    <span
                                      key={i}
                                      className="bg-white border border-slate-200 px-2 py-1 rounded-md text-xs font-medium text-slate-600"
                                    >
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              );
                            } else if (typeof displayValue === "boolean") {
                              displayValue = displayValue ? (
                                <span className="text-green-600 font-bold flex items-center gap-1">
                                  <CheckCircle size={14} /> Yes
                                </span>
                              ) : (
                                <span className="text-slate-500 font-medium">
                                  No
                                </span>
                              );
                            } else if (!displayValue) {
                              displayValue = (
                                <span className="text-slate-400 italic text-sm">
                                  Not answered
                                </span>
                              );
                            }

                            return (
                              <div
                                key={field.id}
                                className={
                                  field.type === "textarea" ||
                                  field.type === "file"
                                    ? "sm:col-span-2"
                                    : ""
                                }
                              >
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                                  {field.label}
                                </p>
                                <div className="text-slate-900 font-medium text-sm break-words whitespace-pre-wrap leading-relaxed">
                                  {displayValue}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 md:p-8 bg-white border-t border-slate-200 flex justify-between items-center gap-3 md:gap-4">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 md:gap-2 text-slate-600 font-bold hover:text-slate-900 hover:bg-white px-3 py-2 md:px-5 md:py-3 text-sm md:text-base rounded-xl transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                  <ChevronLeft size={18} className="md:w-5 md:h-5" /> Back
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-medium text-xs md:text-sm px-3 py-2 hover:bg-white rounded-lg transition-all"
                >
                  <Save size={16} />{" "}
                  <span className="hidden sm:inline">Save Progress</span>
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 text-sm md:text-base rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  Next Step <ChevronRight size={18} className="md:w-5 md:h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-slate-900 hover:bg-green-600 text-white font-bold py-2.5 px-6 md:py-3 md:px-10 text-sm md:text-base rounded-xl transition-all shadow-lg hover:shadow-green-500/25 flex items-center gap-2 transform hover:-translate-y-0.5 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}{" "}
                  {!isSubmitting && (
                    <Send size={16} className="md:w-[18px] md:h-[18px]" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
