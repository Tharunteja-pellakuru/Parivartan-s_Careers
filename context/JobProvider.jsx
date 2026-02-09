import { useEffect, useState } from "react";
import { JobContext } from "./jobContext";
import { BASE_URL } from "../constants";

export const JobProvider = ({ children }) => {
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/jobs`);

      const data = await response.json();

      const validJobs = Array.isArray(data) ? data : data.jobs || [];
      // Filter out closed jobs globally
      const openJobs = validJobs.filter(
        (job) => job.details.status?.toLowerCase() !== "closed",
      );
      setJobsList(openJobs);
      setError(null);
    } catch (err) {
      setJobsList([]);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const value = {
    jobsList,
    isLoading,
    error,
    refreshJobs: fetchJobs,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
