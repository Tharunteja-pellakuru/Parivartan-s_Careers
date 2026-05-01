import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Shield, 
  Plus, 
  Mail, 
  Key,
  ShieldCheck,
  MoreVertical,
  Trash2,
  Edit2,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const Settings = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [openSection, setOpenSection] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex-1 flex flex-col space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 font-normal text-sm mt-1">Manage your account profile, security preferences, and team members.</p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Admin Profile Section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleSection("profile")}
            className="w-full px-8 py-6 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${openSection === "profile" ? "bg-[#73BF44] text-white" : "bg-[#73BF44]/10 text-[#73BF44]"}`}>
                <User size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Admin Profile</h2>
            </div>
            <div className="flex items-center gap-4">
              {openSection === "profile" && !isEditingProfile && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingProfile(true);
                  }}
                  className="flex items-center gap-2 text-[#73BF44] hover:text-[#62a33a] transition-colors font-bold text-sm"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
              <div className={`text-gray-400 transition-transform duration-300 ${openSection === "profile" ? "rotate-180" : ""}`}>
                <ChevronDown size={20} />
              </div>
            </div>
          </button>
          
          <div className={`transition-all duration-300 ease-in-out ${openSection === "profile" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-normal text-gray-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Careers Admin"
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-3 rounded-xl transition-all text-sm font-normal border ${
                      isEditingProfile 
                      ? "bg-white border-gray-200 focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white" 
                      : "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-500"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-normal text-gray-500 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="careers@eparivartan.com"
                    disabled={!isEditingProfile}
                    className={`w-full px-4 py-3 rounded-xl transition-all text-sm font-normal border ${
                      isEditingProfile 
                      ? "bg-white border-gray-200 focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white" 
                      : "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-500"
                    }`}
                  />
                </div>
              </div>
            </div>
            {isEditingProfile && (
              <div className="px-8 py-4 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="px-8 py-2.5 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95"
                >
                  Save 
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleSection("security")}
            className="w-full px-8 py-6 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${openSection === "security" ? "bg-[#73BF44] text-white" : "bg-[#73BF44]/10 text-[#73BF44]"}`}>
                <Lock size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
            </div>
            <div className="flex items-center gap-4">
              {openSection === "security" && !isEditingSecurity && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingSecurity(true);
                  }}
                  className="flex items-center gap-2 text-[#73BF44] hover:text-[#62a33a] transition-colors font-bold text-sm"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
              <div className={`text-gray-400 transition-transform duration-300 ${openSection === "security" ? "rotate-180" : ""}`}>
                <ChevronDown size={20} />
              </div>
            </div>
          </button>

          <div className={`transition-all duration-300 ease-in-out ${openSection === "security" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-normal text-gray-500 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  disabled={!isEditingSecurity}
                  className={`w-full px-4 py-3 rounded-xl transition-all text-sm font-normal border ${
                    isEditingSecurity 
                    ? "bg-white border-gray-200 focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white" 
                    : "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-500"
                  }`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-normal text-gray-500 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    disabled={!isEditingSecurity}
                    className={`w-full px-4 py-3 rounded-xl transition-all text-sm font-normal border ${
                      isEditingSecurity 
                      ? "bg-white border-gray-200 focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white" 
                      : "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-500"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-normal text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    disabled={!isEditingSecurity}
                    className={`w-full px-4 py-3 rounded-xl transition-all text-sm font-normal border ${
                      isEditingSecurity 
                      ? "bg-white border-gray-200 focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white" 
                      : "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-500"
                    }`}
                  />
                </div>
              </div>
            </div>
            {isEditingSecurity && (
              <div className="px-8 py-4 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-50">
                <button 
                  onClick={() => setIsEditingSecurity(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsEditingSecurity(false)}
                  className="px-8 py-2.5 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95"
                >
                  Update 
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Admin Users Section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleSection("users")}
            className="w-full px-8 py-6 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${openSection === "users" ? "bg-[#73BF44] text-white" : "bg-[#73BF44]/10 text-[#73BF44]"}`}>
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Admin Users</h2>
            </div>
            <div className="flex items-center gap-4">
              {openSection === "users" && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddUserModal(true);
                  }}
                  className="flex items-center gap-2 text-[#73BF44] hover:text-[#62a33a] transition-colors font-bold text-sm"
                >
                  <Plus size={18} /> Add User
                </button>
              )}
              <div className={`text-gray-400 transition-transform duration-300 ${openSection === "users" ? "rotate-180" : ""}`}>
                <ChevronDown size={20} />
              </div>
            </div>
          </button>

          <div className={`transition-all duration-300 ease-in-out ${openSection === "users" ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Name</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Email</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Role</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        Careers Admin
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-black tracking-tight uppercase">You</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-normal text-gray-500">careers@eparivartan.com</td>
                    <td className="px-8 py-5">
                      <span className="px-2.5 py-1 bg-[#73BF44]/10 text-[#73BF44] text-[10px] font-black uppercase tracking-wider rounded-full border border-[#73BF44]/20">
                        Super Admin
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-xs font-bold text-gray-300">You</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setShowAddUserModal(false)}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl z-[101] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Default Password Info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">Default Password:</span>
                <code className="text-sm font-bold text-blue-700 bg-white px-2 py-1 rounded-lg border border-blue-100">Password@123</code>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter user's full name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="relative group">
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal text-gray-900 appearance-none outline-none cursor-pointer">
                      <option>Editor</option>
                      <option>Admin</option>
                      <option>Super Admin</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#73BF44] transition-colors">
                      <Shield size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center gap-4">
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-3 bg-[#73BF44] text-white rounded-xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
