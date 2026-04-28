import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Share2,
  ChevronRight,
  Copy,
  Building2,
  UserPlus,
} from "lucide-react";

import { BASE_URL } from "../constants/index.js";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const JobDetails = () => {
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens
  };

  const job = jobsList.find(
    (j) => createSlug(j.job_title) === slug || String(j.uuid) === String(slug), // Fallback to ID check just in case
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <Loader2 className="animate-spin text-brand-500 w-10 h-10 mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">
          Loading job details...
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Job Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          The position you are looking for does not exist or has been filled.
        </p>
        <Link
          to="/positions"
          className="bg-brand-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-600 transition-colors"
        >
          Back to Positions
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    navigate(`/apply/${createSlug(job.job_title)}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Apply for ${job.job_title} at Parivartan`,
      text: `Check out this ${job.job_title} position at Parivartan!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to copy if share not supported
      handleCopy();
    }
  };

  return (
    <div className="bg-white min-h-screen pt-10 pb-32 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/positions"
            className="hover:text-brand-500 transition-colors"
          >
            Open Positions
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-500 font-medium">{job.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 mb-10 border border-slate-100">
          <Link
            to="/positions"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-500 mb-6 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </Link>

          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-heading">
              {job.job_title}
            </h1>
            <div className="flex flex-wrap gap-3 md:gap-6 text-slate-600 font-medium">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <MapPin size={18} className="text-brand-500" />{" "}
                {job.details.location}
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <Briefcase size={18} className="text-brand-500" />{" "}
                {job.details.type}
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <Clock size={18} className="text-brand-500" />{" "}
                {job.details.experienceRange.min === 0 &&
                job.details.experienceRange.max === 0
                  ? "Fresher"
                  : job.details.experienceRange.min +
                    " - " +
                    job.details.experienceRange.max +
                    " Years"}
              </div>
              {job.details.workType && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                  <Building2 size={18} className="text-brand-500" />{" "}
                  {job.details.workType}
                </div>
              )}
              {job.details?.openings && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                  <UserPlus size={18} className="text-brand-500" />{" "}
                  {job.details.openings} Openings
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-8 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 font-heading">
                About the Role
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {job.description?.overview}
              </p>
            </section>

            {job.description.responsibilities && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                  Key Responsibilities
                </h2>
                <ul className="space-y-4">
                  {job.description.responsibilities
                    .split("\n")
                    .map((item) => item.replace("- ", ""))
                    .map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed"
                      >
                        <CheckCircle className="h-6 w-6 text-brand-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {job.description.requiredSkills && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                  Required Skills
                </h2>
                <ul className="space-y-4">
                  {job.description.requiredSkills.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed"
                    >
                      <div className="h-2 w-2 rounded-full bg-brand-500 mt-2.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.description.niceToHaveSkills && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                  Nice to Have Skills
                </h2>
                <ul className="space-y-4">
                  {job.description.niceToHaveSkills.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed"
                    >
                      <div className="h-2 w-2 rounded-full bg-brand-300 mt-2.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Sidebar - Visible on all screens */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Summary Box */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 font-heading border-b border-slate-200 pb-4">
                  Job Summary
                </h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-sm text-slate-500">Department</p>
                    <p className="font-medium text-slate-900">
                      {job.details.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">
                      {job.details.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="font-medium text-slate-900">
                      {job.details.experienceRange.min === 0 &&
                      job.details.experienceRange.max === 0
                        ? "Fresher"
                        : job.details.experienceRange.min +
                          " - " +
                          job.details.experienceRange.max +
                          " Years"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Job Type</p>
                    <p className="font-medium text-slate-900">
                      {job.details.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Openings </p>
                    <p className="font-medium text-slate-900">
                      {job.details.openings}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-brand-500/20"
                  >
                    Apply for this Job
                  </button>
                </div>
              </div>

              {/* Share */}
              {/* Share & Copy */}
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium hover:text-brand-500 cursor-pointer transition-colors py-2 rounded-lg hover:bg-slate-50"
                >
                  <Share2 size={16} /> Share
                </button>
                <div className="w-px bg-slate-200 my-2"></div>
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium hover:text-brand-500 cursor-pointer transition-colors py-2 rounded-lg hover:bg-white"
                >
                  <Copy size={16} /> Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
