import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { criterionSections } from "../lib/constants";
import useSubmissionWorkspace from "../hooks/useSubmissionWorkspace";
import StatsCard from "../components/StatsCard";
import ProgressBar from "../components/ProgressBar";
import RecentSubmissionsTable from "../components/RecentSubmissionsTable";

function DashboardPage() {
  const { user } = useAuth();
  const { canEditSections, summary, submission, recent, loading, loadError } = useSubmissionWorkspace(user);

  const teacherCards =
    summary && submission
      ? [
          {
            label: "Total Submissions",
            value: summary.totalSubmissions,
            hint: "Entry count across Criterion 2 sections",
            accent: "from-blue-600 to-cyan-500"
          },
          {
            label: "Completion",
            value: `${summary.completion}%`,
            hint: `${submission.scores.completion.completedSections} of ${submission.scores.completion.totalSections} sections completed`,
            accent: "from-emerald-500 to-teal-500"
          },
          {
            label: "Auto Marks",
            value: `${summary.totalMarks} / 120`,
            hint: "Calculated automatically from evidence and quality indicators",
            accent: "from-amber-500 to-orange-500"
          }
        ]
      : [];

  const adminCards = summary
    ? [
        {
          label: "Total Submissions",
          value: summary.totalSubmissions,
          hint: "All Criterion 2 records",
          accent: "from-blue-600 to-cyan-500"
        },
        {
          label: "Teachers Covered",
          value: summary.totalTeachers,
          hint: "Unique faculty members with submissions",
          accent: "from-violet-500 to-indigo-500"
        },
        {
          label: "Average Score",
          value: `${summary.averageScore} / 120`,
          hint: "Average aggregate marks",
          accent: "from-amber-500 to-orange-500"
        },
        {
          label: "Average Completion",
          value: `${summary.completion}%`,
          hint: "Overall completion rate",
          accent: "from-emerald-500 to-teal-500"
        }
      ]
    : [];

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">
            {user.role === "admin" ? "Criterion 2 oversight" : "Criterion 2 submission workspace"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            {user.role === "admin"
              ? "Monitor faculty activity, completion, and marks across all NBA Criterion 2 sections."
              : "Fill every section in accordion form, upload PDF evidence, and let the platform calculate marks out of 120."}
          </p>
        </div>
        {canEditSections ? (
          <Link to="/criterion-2" className="button-primary gap-2">
            Open Section Forms
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      ) : null}

      <div className={`grid gap-4 ${user.role === "admin" ? "xl:grid-cols-4 md:grid-cols-2" : "lg:grid-cols-3"}`}>
        {(user.role === "admin" ? adminCards : teacherCards).map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {canEditSections && submission ? (
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
              <ClipboardCheck className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold text-ink">Next steps</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Use the dedicated Criterion 2 page to fill accordion forms section by section instead of scrolling through the dashboard.</p>
              <p>Upload proof PDFs where available to improve score quality and strengthen the exported report.</p>
              <p>After each save, come back here to review completion, section performance, and your latest total out of 120.</p>
            </div>
          </div>
        </div>
      ) : null}
      <RecentSubmissionsTable recent={recent} />
    </div>
  );
}

export default DashboardPage;
