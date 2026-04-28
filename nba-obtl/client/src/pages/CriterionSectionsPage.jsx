import { useState } from "react";
import { ClipboardCheck, DatabaseZap, Lock, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { criterionSections } from "../lib/constants";
import useSubmissionWorkspace from "../hooks/useSubmissionWorkspace";
import ProgressBar from "../components/ProgressBar";
import AccordionSection from "../components/AccordionSection";
import SectionForm from "../components/SectionForm";

function CriterionSectionsPage() {
  const { user } = useAuth();
  const { canEditSections, submission, loading, loadError, updateSubmission } = useSubmissionWorkspace(user);
  const [openKey, setOpenKey] = useState("teachingLearning");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");

  const handleLoadDemo = async () => {
    if (!submission) return;

    setDemoLoading(true);
    setDemoMessage("");

    try {
      const response = await api.post("/submissions/current/load-demo", {
        academicYear: submission.academicYear
      });
      updateSubmission(response.data.submission);
      setDemoMessage("Demo data loaded. All sections now have realistic sample entries.");
    } catch (error) {
      setDemoMessage(error.response?.data?.message || "Unable to load demo data.");
    } finally {
      setDemoLoading(false);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading Criterion 2 sections...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Criterion 2 Sections</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Structured NBA submission forms</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Fill every section in a dedicated workspace, add multiple entries, upload proof PDFs, and save section-wise evidence cleanly.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      ) : null}

      {!canEditSections ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-brand" />
            <h3 className="text-lg font-semibold text-ink">Admin accounts cannot edit section forms</h3>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Use a teacher account to fill Criterion 2 sections. Admins can review saved submissions and export reports.
          </p>
        </div>
      ) : null}

      {canEditSections && submission ? (
        <>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-ink">Demo-ready sample dataset</p>
                <p className="mt-1 text-sm text-slate-500">
                  Load realistic entries across all eight sections instantly so the dashboard, reports, and marks look presentation-ready.
                </p>
              </div>
              <button type="button" onClick={handleLoadDemo} disabled={demoLoading} className="button-primary gap-2">
                <DatabaseZap className="h-4 w-4" />
                {demoLoading ? "Loading Demo..." : "Load Demo Data"}
              </button>
            </div>
            {demoMessage ? <p className="mt-3 text-sm text-slate-600">{demoMessage}</p> : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-ink">Section-wise completion</h3>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Academic Year {submission.academicYear} • Auto-calculated total {submission.scores.total} / 120
              </p>
              <div className="mt-5">
                <ProgressBar value={submission.scores.completion.percentage} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {criterionSections.map((section) => (
                  <div key={section.key} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {section.code} {section.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {(submission.sections?.[section.key] || []).length} entries
                        </p>
                      </div>
                      <span className="rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                        {submission.scores.sectionScores?.[section.key] || 0}/{section.maxMarks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-ink">Scoring signals</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Marks improve with more valid entries, richer quality selections, mapped PO/PSO, and uploaded PDF proof.</p>
                <p>Sections 2.2, 2.6, and 2.7 give extra weight to prototypes, certifications, SDG mapping, and sustainability.</p>
                <p>Every save recalculates section marks immediately, so this page stays aligned with the latest evidence.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {criterionSections.map((section) => (
              <AccordionSection
                key={section.key}
                title={`${section.code} ${section.title}`}
                subtitle={section.description}
                score={submission.scores.sectionScores?.[section.key] || 0}
                maxMarks={section.maxMarks}
                isOpen={openKey === section.key}
                onToggle={() => setOpenKey((current) => (current === section.key ? "" : section.key))}
              >
                <SectionForm section={section} submission={submission} onUpdated={updateSubmission} />
              </AccordionSection>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default CriterionSectionsPage;
