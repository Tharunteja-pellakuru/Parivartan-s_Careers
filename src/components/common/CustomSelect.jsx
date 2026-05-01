import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A custom-styled dropdown component that matches the application brand identity.
 * Replaces the standard browser select element to allow for custom colors and animations.
 */
const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  icon: Icon, 
  placeholder, 
  className = "",
  variant = "default" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find the selected option to display its label instead of its value
  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );
  
  const displayLabel = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between transition-all duration-300 ${
          variant === "default" 
            ? "bg-[#73BF44]/5 border border-[#73BF44]/10 rounded-xl px-4 py-2.5 hover:bg-[#73BF44]/10" 
            : "bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-[#73BF44]/30"
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-[#73BF44]" size={16} />}
          <span className={`text-sm font-bold ${variant === "default" ? "text-[#73BF44]" : "text-gray-700"}`}>
            {(!value || value === "All") ? placeholder : (displayLabel || value)}
          </span>
        </div>
        <ChevronDown 
          className={`text-[#73BF44] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          size={14} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl shadow-[#73BF44]/10 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const label = typeof option === 'object' ? option.label : option;
              const val = typeof option === 'object' ? option.value : option;
              
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#73BF44]/5 hover:text-[#73BF44] ${
                    value === val ? "bg-[#73BF44]/10 text-[#73BF44] font-bold" : "text-gray-600"
                  }`}
                >
                  {label === "All" ? placeholder : label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
