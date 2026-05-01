import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Layers, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  Edit2,
  X,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  Tags
} from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constants";

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              {message}
            </p>
          </div>
          <div className="flex gap-3 w-full mt-4">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-100 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddOns = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Accordion State
  const [openAccordion, setOpenAccordion] = useState("department"); // 'department', 'category', or null

  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    message: "",
    isLoading: false
  });

  // Edit States
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [editDeptName, setEditDeptName] = useState("");
  
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");

  // Department Form State
  const [deptName, setDeptName] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);

  // Category Form State
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/careers/master/departments-with-categories`);
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    try {
      setDeptLoading(true);
      const response = await fetch(`${BASE_URL}/api/careers/master/add-department`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_name: deptName }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success("Department added successfully!");
        setDeptName("");
        fetchDepartments();
        // Optional: close accordion on success
        // setOpenAccordion(null);
      } else {
        toast.error(data.message || "Failed to add department");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeptLoading(false);
    }
  };

  const handleUpdateDepartment = async (id) => {
    if (!editDeptName.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/api/careers/master/update-department/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_name: editDeptName }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Department updated");
        setEditingDeptId(null);
        fetchDepartments();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const openDeleteDepartmentModal = (dept) => {
    setDeleteModal({
      isOpen: true,
      type: 'department',
      id: dept.id,
      title: "Delete Department?",
      message: `Are you sure you want to delete "${dept.department_name}"? This will also permanently delete all associated categories.`,
      isLoading: false
    });
  };

  const handleDeleteDepartment = async (id) => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      const response = await fetch(`${BASE_URL}/api/careers/master/delete-department/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Department deleted");
        setDeleteModal(prev => ({ ...prev, isOpen: false }));
        fetchDepartments();
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !selectedDeptId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setCatLoading(true);
      const response = await fetch(`${BASE_URL}/api/careers/master/add-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          department_id: selectedDeptId,
          category_name: categoryName 
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success("Category added successfully!");
        setCategoryName("");
        fetchDepartments();
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setCatLoading(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editCatName.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/api/careers/master/update-category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: editCatName }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Category updated");
        setEditingCatId(null);
        fetchDepartments();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const openDeleteCategoryModal = (cat) => {
    setDeleteModal({
      isOpen: true,
      type: 'category',
      id: cat.id,
      title: "Delete Category?",
      message: `Are you sure you want to delete "${cat.category_name}"? This action cannot be undone.`,
      isLoading: false
    });
  };

  const handleDeleteCategory = async (id) => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      const response = await fetch(`${BASE_URL}/api/careers/master/delete-category/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Category deleted");
        setDeleteModal(prev => ({ ...prev, isOpen: false }));
        fetchDepartments();
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'department') {
      handleDeleteDepartment(deleteModal.id);
    } else {
      handleDeleteCategory(deleteModal.id);
    }
  };

  const toggleAccordion = (type) => {
    setOpenAccordion(openAccordion === type ? null : type);
  };

  return (
    <div className="flex-1 flex flex-col space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 font-['Inter']">
      
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDelete}
        title={deleteModal.title}
        message={deleteModal.message}
        isLoading={deleteModal.isLoading}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Add-ons & Master Data
          </h1>
          <p className="text-gray-500 font-normal text-sm mt-1">Manage departments and job categories for your careers portal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Accordion Forms */}
        <div className="space-y-4">
          
          {/* Add Department Accordion */}
          <div className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm ${openAccordion === 'department' ? 'border-[#73BF44]/30 ring-4 ring-[#73BF44]/5' : 'border-gray-100 hover:border-gray-200'}`}>
            <button 
              onClick={() => toggleAccordion('department')}
              className="w-full px-8 py-6 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${openAccordion === 'department' ? 'bg-[#73BF44] text-white shadow-lg shadow-[#73BF44]/30' : 'bg-gray-50 text-gray-400 group-hover:text-[#73BF44] group-hover:bg-[#73BF44]/10'}`}>
                  <FolderPlus size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-base font-bold text-gray-900">Add Department</h2>
                  <p className="text-xs text-gray-400 font-normal">Create a new organizational unit</p>
                </div>
              </div>
              <div className={`p-2 rounded-full transition-transform duration-300 ${openAccordion === 'department' ? 'rotate-180 bg-[#73BF44]/10 text-[#73BF44]' : 'text-gray-300'}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openAccordion === 'department' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-8 pb-8 pt-2">
                <form onSubmit={handleAddDepartment} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Department Name</label>
                    <input 
                      type="text"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                      placeholder="e.g. Creative Media"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={deptLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#73BF44] text-white rounded-2xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {deptLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Create Department
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Add Category Accordion */}
          <div className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm ${openAccordion === 'category' ? 'border-[#73BF44]/30 ring-4 ring-[#73BF44]/5' : 'border-gray-100 hover:border-gray-200'}`}>
            <button 
              onClick={() => toggleAccordion('category')}
              className="w-full px-8 py-6 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${openAccordion === 'category' ? 'bg-[#73BF44] text-white shadow-lg shadow-[#73BF44]/30' : 'bg-gray-50 text-gray-400 group-hover:text-[#73BF44] group-hover:bg-[#73BF44]/10'}`}>
                  <Tags size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-base font-bold text-gray-900">Add Category</h2>
                  <p className="text-xs text-gray-400 font-normal">Add sub-specialties to departments</p>
                </div>
              </div>
              <div className={`p-2 rounded-full transition-transform duration-300 ${openAccordion === 'category' ? 'rotate-180 bg-[#73BF44]/10 text-[#73BF44]' : 'text-gray-300'}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openAccordion === 'category' ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-8 pb-8 pt-2">
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Target Department</label>
                    <div className="relative">
                      <select 
                        value={selectedDeptId}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Choose a department...</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                    <input 
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#73BF44]/20 focus:bg-white transition-all text-sm font-normal"
                      placeholder="e.g. UI/UX Design"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={catLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#73BF44] text-white rounded-2xl font-bold text-sm hover:bg-[#62a33a] shadow-lg shadow-[#73BF44]/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {catLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Create Category
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: List */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col h-[calc(100vh-250px)]">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#73BF44] rounded-full"></div>
            Master Structure
          </h2>
          
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-sm font-medium">Syncing structure...</p>
              </div>
            ) : departments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
                <AlertCircle size={32} className="mb-2" />
                <p className="text-sm">No data available</p>
              </div>
            ) : (
              departments.map((dept) => (
                <div key={dept.id} className="group border border-gray-50 rounded-2xl overflow-hidden transition-all hover:border-[#73BF44]/30 bg-white">
                  <div className="bg-gray-50/30 px-6 py-4 flex justify-between items-center border-b border-gray-50/50">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-white rounded-xl text-[#73BF44] shadow-sm shrink-0 border border-gray-100">
                        <Layers size={16} />
                      </div>
                      {editingDeptId === dept.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input 
                            autoFocus
                            value={editDeptName}
                            onChange={(e) => setEditDeptName(e.target.value)}
                            className="bg-white border border-[#73BF44]/30 rounded-lg px-3 py-1.5 text-sm font-bold w-full outline-none focus:ring-2 focus:ring-[#73BF44]/10"
                          />
                          <button onClick={() => handleUpdateDepartment(dept.id)} className="text-[#73BF44] hover:bg-[#73BF44]/10 p-1.5 rounded-lg transition-all"><Check size={18} /></button>
                          <button onClick={() => setEditingDeptId(null)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-all"><X size={18} /></button>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800 text-sm truncate">{dept.department_name}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {editingDeptId !== dept.id && (
                        <>
                          <button 
                            onClick={() => {
                              setEditingDeptId(dept.id);
                              setEditDeptName(dept.department_name);
                            }}
                            className="p-2 text-gray-400 hover:text-[#73BF44] hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => openDeleteDepartmentModal(dept)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      <div className="w-px h-4 bg-gray-200 mx-1"></div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-[#73BF44]/10 text-[#73BF44] rounded-md uppercase tracking-wider whitespace-nowrap">
                        {dept.categories?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-1 gap-2">
                    {dept.categories && dept.categories.length > 0 ? (
                      dept.categories.map((cat) => (
                        <div key={cat.id} className="group/cat flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50/20 rounded-xl text-xs text-gray-600 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#73BF44]/40 shrink-0"></div>
                            {editingCatId === cat.id ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input 
                                  autoFocus
                                  value={editCatName}
                                  onChange={(e) => setEditCatName(e.target.value)}
                                  className="bg-white border border-[#73BF44]/30 rounded-lg px-2 py-1 text-xs w-full outline-none"
                                />
                                <button onClick={() => handleUpdateCategory(cat.id)} className="text-[#73BF44] hover:bg-[#73BF44]/10 p-1 rounded-md transition-all"><Check size={16} /></button>
                                <button onClick={() => setEditingCatId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded-md transition-all"><X size={16} /></button>
                              </div>
                            ) : (
                              <span className="font-medium truncate">{cat.category_name}</span>
                            )}
                          </div>
                          
                          {editingCatId !== cat.id && (
                            <div className="flex items-center gap-1 opacity-0 group-hover/cat:opacity-100 transition-all">
                              <button 
                                onClick={() => {
                                  setEditingCatId(cat.id);
                                  setEditCatName(cat.category_name);
                                }}
                                className="p-1.5 text-gray-400 hover:text-[#73BF44] hover:bg-gray-50 rounded-lg transition-all"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button 
                                onClick={() => openDeleteCategoryModal(cat)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-400 italic px-4 py-2">No categories defined</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOns;
