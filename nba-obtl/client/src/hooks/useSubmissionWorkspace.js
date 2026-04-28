import { useEffect, useState } from "react";
import api from "../lib/api";
import { criterionSections } from "../lib/constants";

function useSubmissionWorkspace(user) {
  const canEditSections = user?.role !== "admin";
  const [summary, setSummary] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const summaryResponse = await api.get("/submissions/dashboard");
        setSummary(summaryResponse.data.summary);
      } catch (error) {
        setLoadError(error.response?.data?.message || "Unable to load dashboard summary.");
      }

      if (canEditSections) {
        try {
          const submissionResponse = await api.get("/submissions/current");
          setSubmission(submissionResponse.data.submission);
        } catch (error) {
          setLoadError((current) => current || error.response?.data?.message || "Unable to load Criterion 2 sections.");
        }
      } else {
        setSubmission(null);
      }

      try {
        const reportsResponse = await api.get("/submissions");
        setRecent(reportsResponse.data.submissions.slice(0, 5));
      } catch (error) {
        setRecent([]);
        setLoadError((current) => current || error.response?.data?.message || "Unable to load recent submissions.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [canEditSections, user]);

  const updateSubmission = (nextSubmission) => {
    setSubmission(nextSubmission);

    if (canEditSections) {
      const totalSubmissions = criterionSections.reduce(
        (sum, section) => sum + (nextSubmission.sections?.[section.key]?.length || 0),
        0
      );

      setSummary({
        totalSubmissions,
        completion: nextSubmission.scores.completion.percentage,
        totalMarks: nextSubmission.scores.total,
        sectionScores: nextSubmission.scores.sectionScores
      });
    }
  };

  return {
    canEditSections,
    summary,
    submission,
    recent,
    loading,
    loadError,
    updateSubmission
  };
}

export default useSubmissionWorkspace;
