import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Check,
  Calendar,
  Clock,
  Star,
  Link as LinkIcon,
  Plus,
  ChevronDown,
} from "lucide-react";

const DynamicField = ({ field, value, onChange, error }) => {
  const [tags, setTags] = useState(Array.isArray(value) ? value : []);
  const [tagInput, setTagInput] = useState("");

  // Sync tags internal state with parent value
  useEffect(() => {
    if (field.type === "tags" && Array.isArray(value)) {
      setTags(value);
    }
  }, [value, field.type]);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      onChange(field.id, newTags);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(field.id, newTags);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(field.id, e.target.files[0]);
    }
  };

  const handleMultiSelectChange = (option) => {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(option)) {
      onChange(
        field.id,
        current.filter((item) => item !== option),
      );
    } else {
      onChange(field.id, [...current, option]);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "tel":
      case "number":
      case "url":
        // Check for Phone type OR Label containing "Phone"/"Mobile"/"Contact"
        const isPhone =
          field.type === "phone" ||
          field.type === "tel" ||
          /phone|mobile|contact/i.test(field.label || "") ||
          /phone|mobile|contact/i.test(field.name || "");

        return (
          <div className="relative group">
            <input
              type={isPhone ? "tel" : field.type}
              value={value || ""}
              onChange={(e) => {
                let val = e.target.value;
                // Strict Input Masking for Full Name
                if (
                  (field.label === "Full Name" || field.name === "full_name") &&
                  field.type === "text"
                ) {
                  // Replace any character that is NOT a letter or space
                  val = val.replace(/[^a-zA-Z\s]/g, "");
                }

                if (field.type === "email") {
                  val = val.replace(/[^a-zA-Z0-9@._-]/g, "");
                }

                if (isPhone) {
                  val = val.replace(/[^0-9]/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                }
                onChange(field.id, val);
              }}
              placeholder={field.placeholder}
              maxLength={isPhone ? 10 : undefined}
              min={field.type === "number" ? "0" : undefined}
              onKeyDown={(e) => {
                if (
                  (field.type === "number" || isPhone) &&
                  ["e", "E", "+", "-", "."].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400 ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-slate-300"}`}
            />
            {field.type === "url" && (
              <LinkIcon
                size={18}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"
              />
            )}
          </div>
        );

      case "textarea":
        return (
          <textarea
            rows={5}
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none transition-all duration-300 text-slate-900 placeholder:text-slate-400 ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-slate-300"}`}
          />
        );

      case "dropdown":
        return (
          <div className="relative group">
            <select
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none appearance-none transition-all duration-300 text-slate-900 cursor-pointer ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-slate-300"}`}
            >
              <option value="">Select an option...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-brand-500 transition-colors">
              <ChevronDown size={20} />
            </div>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 group ${value === opt ? "border-brand-500 bg-brand-50/50 shadow-sm" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${value === opt ? "border-brand-500" : "border-slate-300 group-hover:border-slate-400"}`}
                >
                  {value === opt && (
                    <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="hidden"
                />
                <span
                  className={`font-medium transition-colors ${value === opt ? "text-brand-900" : "text-slate-700"}`}
                >
                  {opt}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        const selectedChecks = Array.isArray(value) ? value : [];
        const handleCheck = (opt) => {
          if (selectedChecks.includes(opt))
            onChange(
              field.id,
              selectedChecks.filter((i) => i !== opt),
            );
          else onChange(field.id, [...selectedChecks, opt]);
        };
        return (
          <div className="space-y-3">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 group ${selectedChecks.includes(opt) ? "border-brand-500 bg-brand-50/50 shadow-sm" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 transition-colors ${selectedChecks.includes(opt) ? "bg-brand-500 border-brand-500" : "border-slate-300 group-hover:border-slate-400"}`}
                >
                  {selectedChecks.includes(opt) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedChecks.includes(opt)}
                  onChange={() => handleCheck(opt)}
                  className="hidden"
                />
                <span
                  className={`font-medium transition-colors ${selectedChecks.includes(opt) ? "text-brand-900" : "text-slate-700"}`}
                >
                  {opt}
                </span>
              </label>
            ))}
          </div>
        );

      case "yesno":
        return (
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <label
                key={opt}
                className={`flex-1 flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${value === opt ? "border-brand-500 bg-brand-50 text-brand-700 font-bold shadow-sm" : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:border-slate-300"}`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="hidden"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "toggle":
        return (
          <label className="flex items-center cursor-pointer group p-2">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!value}
                onChange={(e) => onChange(field.id, e.target.checked)}
              />
              <div
                className={`block w-14 h-8 rounded-full transition-colors duration-300 ${value ? "bg-brand-500" : "bg-slate-200 group-hover:bg-slate-300"}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${value ? "translate-x-6" : ""}`}
              ></div>
            </div>
            <span
              className={`ml-4 font-medium transition-colors ${value ? "text-brand-600" : "text-slate-600"}`}
            >
              {value ? "Yes" : "No"}
            </span>
          </label>
        );

      case "date":
        return (
          <div className="relative group">
            <input
              type="date"
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              className={`w-full px-5 py-4 pl-12 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-slate-900 ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-slate-300"}`}
            />
            <Calendar
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"
            />
          </div>
        );

      case "time":
        return (
          <div className="relative group">
            <input
              type="time"
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              className={`w-full px-5 py-4 pl-12 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all duration-300 text-slate-900 ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-slate-300"}`}
            />
            <Clock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors pointer-events-none"
            />
          </div>
        );

      case "range":
        return (
          <div className="px-2 py-6 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-4 px-2">
              <span className="text-sm text-slate-500 font-medium">
                {field.validation?.min || 0}
              </span>
              <span className="text-brand-600 font-bold text-xl bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
                {value ?? field.defaultValue ?? 0}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                {field.validation?.max || 100}
              </span>
            </div>
            <input
              type="range"
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              step={1}
              value={value ?? field.defaultValue ?? 0}
              onChange={(e) => onChange(field.id, Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-600"
            />
          </div>
        );

      case "rating":
        const maxStars = field.validation?.max || 5;
        return (
          <div className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 justify-center sm:justify-start">
            {Array.from({ length: maxStars }).map((_, idx) => {
              const starValue = idx + 1;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(field.id, starValue)}
                  className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    className={`${(value || 0) >= starValue ? "fill-brand-500 text-brand-500 drop-shadow-sm" : "text-slate-300 hover:text-brand-200"}`}
                  />
                </button>
              );
            })}
          </div>
        );

      case "tags":
        return (
          <div
            className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all duration-300 ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 hover:border-slate-300"}`}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-brand-200 text-brand-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm animate-in zoom-in duration-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="hover:text-red-500 transition-colors bg-brand-50 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={
                tags.length === 0
                  ? field.placeholder || "Type and press Enter"
                  : "Add another..."
              }
              className="bg-transparent outline-none w-full text-slate-900 placeholder:text-slate-400"
            />
          </div>
        );

      case "multi-select":
        const selectedMulti = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-3">
            {field.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleMultiSelectChange(opt)}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedMulti.includes(opt) ? "bg-brand-500 text-white border-brand-500 shadow-md transform scale-105" : "bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-500"}`}
              >
                {selectedMulti.includes(opt) ? (
                  <Check size={16} />
                ) : (
                  <Plus size={16} />
                )}{" "}
                {opt}
              </button>
            ))}
          </div>
        );

      case "file":
        return (
          <div
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 group ${error ? "border-red-500 bg-red-50/10" : "border-slate-300 hover:border-brand-500 hover:bg-brand-50/30"}`}
          >
            <input
              type="file"
              id={field.id}
              className="hidden"
              accept={field.validation?.allowedFormats?.join(",")}
              onChange={handleFileChange}
            />
            {value ? (
              <div className="flex items-center gap-4 text-brand-600 w-full justify-between p-4 bg-white rounded-xl shadow-md border border-slate-100 animate-in fade-in-up duration-300">
                <div className="flex items-center gap-4 truncate">
                  <div className="p-3 bg-brand-100 rounded-lg shrink-0">
                    <Upload size={20} />
                  </div>
                  <div className="text-left truncate">
                    <p className="font-bold text-sm truncate max-w-[150px] md:max-w-xs text-slate-900">
                      {value.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(value.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(field.id, null)}
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label
                htmlFor={field.id}
                className="cursor-pointer text-center w-full h-full flex flex-col items-center py-2"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-100">
                  <Upload className="h-8 w-8 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </div>
                <p className="text-slate-900 font-bold text-lg mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500">
                  {`Max ${field.validation?.maxSizeMB || 5}MB`}
                </p>{" "}
                {field.helpText && (
                  <p className="text-red-600 text-xs mt-1.5 ml-1">
                    {field.helpText}
                  </p>
                )}
              </label>
            )}
          </div>
        );

      default:
        return (
          <p className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
            Unsupported field type: {field.type}
          </p>
        );
    }
  };

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
        {field.label}{" "}
        {field.required && <span className="text-brand-500">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1">
          <X size={14} /> {error}
        </p>
      )}
    </div>
  );
};

export default DynamicField;
