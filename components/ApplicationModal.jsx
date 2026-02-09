import React, { useState, useRef } from "react";
import { X, Upload, Send } from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

const ApplicationModal = ({ isOpen, onClose, positionTitle }) => {
  if (!isOpen) return null;

  const [fileName, setFileName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We track form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    portfolio: "",
    reason: "",
  });

  const resumeRef = useRef(null);

  const handleChange = (e) => {
    let { name, value } = e.target;
    // Validate that firstName and lastName only contain alphabets and spaces
    if (name === "firstName" || name === "lastName") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    // Validate email to accept only alphabets, numbers, @, _, ., and -
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9@_.-]*$/;
      if (!emailRegex.test(value)) {
        return;
      }
    }

    // Validate phone to accept only numbers and max length 10
    if (name === "phone") {
      value = value.replace(/[^0-9]/g, ""); // Remove non-numeric chars
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeRef.current.files[0]) {
      toast.error("Please upload your resume.");
      return;
    }

    // Validate email pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate Portfolio URL
    const isValidUrl = (urlString) => {
      try {
        if (urlString.includes("://") || urlString.startsWith("localhost")) {
          new URL(
            urlString.startsWith("localhost")
              ? "http://" + urlString
              : urlString,
          );
          return true;
        }
        new URL("https://" + urlString);
        return true;
      } catch {
        return false;
      }
    };

    if (form.portfolio && !isValidUrl(form.portfolio)) {
      toast.error("Please enter a valid Portfolio URL.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting application...");

    const formData = new FormData();

    // Attach all fields
    formData.append("position", positionTitle || "General Application");
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("experience", form.experience);
    formData.append("portfolio", form.portfolio);
    formData.append("reason", form.reason);

    // Attach file
    formData.append("resume", resumeRef.current.files[0]);

    try {
      const response = await fetch(`${BASE_URL}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Application submitted successfully!", {
          id: loadingToast,
        });
        onClose();
      } else {
        toast.error("Failed to submit application. Please try again.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Error sending application.", { id: loadingToast });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-brand-500 font-semibold mb-1">
              <Send size={18} />
              <span>Apply for Position</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {positionTitle || "General Application"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Position
            </label>
            <input
              type="text"
              value={positionTitle || "General Application"}
              readOnly
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* First/Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name *
              </label>
              <input
                required
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                required
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              required
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              required
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Years of Experience *
            </label>
            <select
              required
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select...</option>
              <option>Less than 1 year</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Portfolio/LinkedIn URL *
            </label>
            <input
              required
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (
                  val &&
                  !val.startsWith("http://") &&
                  !val.startsWith("https://")
                ) {
                  setForm({ ...form, portfolio: `https://${val}` });
                }
              }}
              type="text"
              placeholder="e.g., linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resume/CV (PDF ) *
            </label>
            <div className="relative">
              <input
                type="file"
                name="resume"
                id="resume-upload"
                ref={resumeRef}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <label
                htmlFor="resume-upload"
                className="flex items-center w-full px-4 py-2 bg-white border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="px-3 py-1 bg-slate-200 rounded text-xs font-medium mr-3 text-slate-700">
                  Choose File
                </div>
                <span className="text-sm text-slate-500">
                  {fileName || "No file chosen"}
                </span>
              </label>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Why do you want to join eParivartan? *
            </label>
            <textarea
              required
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
