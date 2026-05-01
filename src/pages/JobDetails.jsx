import React, { useEffect, useState } from "react";
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
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const fetchJob = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/jobs`);
      const data = await response.json();
      
      if (data.success) {
        const foundJob = data.data.find(j => j.job_slug === slug);
        if (foundJob) {
          // Parse JSON fields
          foundJob.required_skills = typeof foundJob.required_skills === 'string' ? JSON.parse(foundJob.required_skills) : foundJob.required_skills;
          foundJob.nice_to_have_skills = typeof foundJob.nice_to_have_skills === 'string' ? JSON.parse(foundJob.nice_to_have_skills) : foundJob.nice_to_have_skills;
          foundJob.responsibilities = typeof foundJob.responsibilities === 'string' ? JSON.parse(foundJob.responsibilities) : foundJob.responsibilities;
          setJob(foundJob);
        }
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [slug]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <Loader2 className="animate-spin text-[#73BF44] w-10 h-10 mb-4" />
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
          className="bg-[#73BF44] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#62a33a] transition-colors"
        >
          Back to Positions
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    navigate(`/apply/${job.job_slug}`);
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
            className="hover:text-[#73BF44] transition-colors"
          >
            Current Positions
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#73BF44] font-medium">{job.job_title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 mb-10 border border-slate-100">
          <Link
            to="/positions"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#73BF44] mb-6 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </Link>

          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-heading">
              {job.job_title}
            </h1>
            <div className="flex flex-wrap gap-3 md:gap-6 text-slate-600 font-medium">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <MapPin size={18} className="text-[#73BF44]" />{" "}
                {job.location}
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <Briefcase size={18} className="text-[#73BF44]" />{" "}
                {job.employment_type}
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <Clock size={18} className="text-[#73BF44]" />{" "}
                {job.min_experience === 0 && job.max_experience === 0
                  ? "Fresher"
                  : `${job.min_experience} - ${job.max_experience} Years`}
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                <Building2 size={18} className="text-[#73BF44]" />{" "}
                {job.work_type}
              </div>
              {job.openings && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm md:text-base">
                  <UserPlus size={18} className="text-[#73BF44]" />{" "}
                  {job.openings} Openings
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
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                {job.job_description}
              </p>
            </section>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                  Key Responsibilities
                </h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed"
                    >
                      <CheckCircle className="h-6 w-6 text-[#73BF44] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.required_skills && job.required_skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                  Required Skills
                </h2>
                <ul className="space-y-4">
                  {job.required_skills.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#73BF44] mt-2.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.nice_to_have_skills && job.nice_to_have_skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                  Nice to Have Skills
                </h2>
                <ul className="space-y-4">
                  {job.nice_to_have_skills.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-600 text-lg leading-relaxed"
                    >
                      <div className="h-2 w-2 rounded-full bg-slate-400 mt-2.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Summary Box */}
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 font-heading border-b border-slate-200 pb-4">
                  Job Summary
                </h3>
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-sm text-slate-500">Department</p>
                    <p className="font-medium text-slate-900">
                      {job.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">
                      {job.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="font-medium text-slate-900">
                      {job.min_experience === 0 && job.max_experience === 0
                        ? "Fresher"
                        : `${job.min_experience} - ${job.max_experience} Years`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Job Type</p>
                    <p className="font-medium text-slate-900">
                      {job.employment_type}
                    </p>
                  </div>
                  {job.openings && (
                    <div>
                      <p className="text-sm text-slate-500">Openings</p>
                      <p className="font-medium text-slate-900">
                        {job.openings}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    className="w-full bg-[#73BF44] hover:bg-[#62a33a] text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-[#73BF44]/20"
                  >
                    Apply for this Job
                  </button>
                </div>
              </div>

              {/* Share & Copy */}
              <div className="flex gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium hover:text-[#73BF44] transition-colors py-2 rounded-lg"
                >
                  <Share2 size={16} /> Share
                </button>
                <div className="w-px bg-slate-200 my-2"></div>
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 text-slate-500 text-sm font-medium hover:text-[#73BF44] transition-colors py-2 rounded-lg"
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
