import React from "react";
import { X, AlertCircle, HelpCircle } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // 'danger' or 'warning' or 'info'
}) => {
  if (!isOpen) return null;

  const typeColors = {
    danger: {
      icon: <AlertCircle className="text-red-500" size={24} />,
      bg: "bg-red-50",
      button: "bg-red-500 hover:bg-red-600 shadow-red-200",
      border: "border-red-100"
    },
    warning: {
      icon: <HelpCircle className="text-amber-500" size={24} />,
      bg: "bg-amber-50",
      button: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
      border: "border-amber-100"
    },
    info: {
      icon: <HelpCircle className="text-[#73BF44]" size={24} />,
      bg: "bg-[#73BF44]/5",
      button: "bg-[#73BF44] hover:bg-[#62a33a] shadow-[#73BF44]/20",
      border: "border-[#73BF44]/10"
    }
  };

  const style = typeColors[type] || typeColors.info;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${style.bg} ${style.border} border`}>
              {style.icon}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
