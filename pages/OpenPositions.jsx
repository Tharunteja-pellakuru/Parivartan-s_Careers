import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  UserPlus,
  Filter,
  Mail,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  PenTool,
  Code2,
  Megaphone,
  Clapperboard,
  Copy,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationModal from "../components/ApplicationModal";
import { useJobs } from "../context/jobContext";

const ITEMS_PER_PAGE = 10;

const OpenPositions = () => {
  // Add a safety check for jobsList to prevent crashes if it's null
  const { jobsList, isLoading, error } = useJobs();

  console.log(jobsList);

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Ensure jobsList is an array before filtering
  const safeJobsList = Array.isArray(jobsList) ? jobsList : [];

  // Apply department filter
  const departmentFilteredJobs =
    filter === "All"
      ? safeJobsList
      : safeJobsList.filter((job) => job.details?.department === filter);

  // Apply search filter
  const filteredJobs = departmentFilteredJobs.filter((job) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const jobTitle = job.job_title?.toLowerCase() || "";
    const department = job.details?.department?.toLowerCase() || "";
    const location = job.details?.location?.toLowerCase() || "";
    const type = job.details?.type?.toLowerCase() || "";
    const overview = job.description?.overview?.toLowerCase() || "";
    const skills =
      job.description?.requiredSkills?.map((s) => s.toLowerCase()).join(" ") ||
      "";

    return (
      jobTitle.includes(query) ||
      department.includes(query) ||
      location.includes(query) ||
      type.includes(query) ||
      overview.includes(query) ||
      skills.includes(query)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const openApplication = (title) => {
    setSelectedJobTitle(title);
    setIsModalOpen(true);
  };

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCopyLink = async (job) => {
    const shareUrl = `${window.location.origin}/#/positions/${createSlug(job.job_title)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMessage("Job link copied to clipboard!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage("Failed to copy link. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 pb-32 animate-in fade-in duration-500">
      <div className="text-center mb-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up font-heading">
          Current Openings
        </h1>
        <div
          className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <p
          className="text-xl text-slate-500 mt-6 animate-fade-in-up max-w-3xl mx-auto"
          style={{ animationDelay: "0.2s" }}
        >
          Join our team of innovators and change-makers. Find the role that fits
          you best.
        </p>
      </div>

      {/* Search Bar - COMMENTED OUT AS PER ORIGINAL */}

      {/* Filters - COMMENTED OUT AS PER ORIGINAL */}

      {/* Job Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Loading State */}
          {isLoading && (
            <div className="col-span-1 md:col-span-2 flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-500 w-10 h-10" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredJobs.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">
              No open positions found in this category.
            </div>
          )}

          {/* ✅ FIXED: Mapping over currentJobs instead of jobsList */}
          {!isLoading &&
            currentJobs.map((job, index) => (
              <div
                key={job.id || index}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-500 transition-colors font-heading flex-1 pr-4">
                    {job.job_title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(job)}
                      className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-brand-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                      title="Copy job link"
                    >
                      <Copy size={18} />
                    </button>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${
                        job.details?.department === "Design"
                          ? "bg-pink-100 text-pink-700"
                          : job.details?.department === "Development"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {job.details?.department}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 text-sm text-slate-500 font-medium mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-brand-500" />{" "}
                    {job.details?.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-brand-500" />{" "}
                    {job.details?.experienceRange?.min === 0 &&
                    job.details?.experienceRange?.max === 0
                      ? "Fresher"
                      : job.details?.experienceRange?.min +
                        " - " +
                        job.details?.experienceRange?.max +
                        " Years"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-brand-500" />{" "}
                    {job.details?.type}
                  </div>
                  {job.details?.workType && (
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-brand-500" />{" "}
                      {job.details?.workType}
                    </div>
                  )}
                  {job.details?.openings && (
                    <div className="flex items-center gap-2">
                      <UserPlus size={18} className="text-brand-500" />{" "}
                      {job.details.openings} Openings
                    </div>
                  )}
                </div>

                <p className="text-slate-600 mb-8 flex-grow text-md leading-relaxed">
                  {job.description?.overview?.length > 150
                    ? job.description?.overview.slice(0, 150) + "..."
                    : job.description?.overview}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {job.description?.requiredSkills &&
                    job.description.requiredSkills.slice(0, 3).map((tag, i) => (
                      <span
                        key={`${tag}-${i}`}
                        className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-md border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <Link
                  to={`/positions/${createSlug(job.job_title)}`}
                  className="w-full bg-slate-900 hover:bg-brand-500 text-white hover:text-white font-bold py-3 md:py-4 rounded-lg transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2 group-hover:gap-3 text-sm md:text-base"
                >
                  View Details & Apply <ArrowRight size={18} />
                </Link>
              </div>
            ))}
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 animate-fade-in-up">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border transition-all ${
                currentPage === 1
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-300 hover:bg-white hover:text-brand-500 hover:border-brand-500 hover:shadow-md"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full font-bold transition-all ${
                      currentPage === page
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-brand-500 hover:text-brand-500"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full border transition-all ${
                currentPage === totalPages
                  ? "text-slate-300 border-slate-200 cursor-not-allowed"
                  : "text-slate-600 border-slate-300 hover:bg-white hover:text-brand-500 hover:border-brand-500 hover:shadow-md"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* General Application CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-brand-500 rounded-3xl p-12 text-center text-white shadow-2xl hover:shadow-brand-500/40 transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20 group-hover:scale-110 transition-transform duration-500"></div>

          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float relative z-10 backdrop-blur-sm border border-white/20">
            <UserPlus size={36} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 relative z-10 font-heading">
            Don't See Your Role?
          </h2>
          <p className="text-brand-50 text-xl mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            We are always on the lookout for exceptional talent. Submit a
            general application and join our talent pool for future
            opportunities.
          </p>
          <button
            onClick={() => openApplication()}
            className="bg-white text-brand-700 hover:bg-brand-50 font-bold py-3 px-6 md:py-4 md:px-10 rounded-lg transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 mx-auto relative z-10 text-base md:text-lg"
          >
            <Mail size={20} className="md:w-[22px] md:h-[22px]" /> Submit
            General Application
          </button>
        </div>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        positionTitle={selectedJobTitle}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
            <Copy size={18} className="text-brand-400" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenPositions;
