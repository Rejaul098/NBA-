import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

function ReportsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: ""
  });

  useEffect(() => {
    const load = async () => {
      const response = await api.get("/submissions", { params: filters });
      setSubmissions(response.data.submissions);
    };
    load();
  }, [filters]);

  const departments = [...new Set(submissions.map((item) => item.department || item.teacher?.department).filter(Boolean))].sort();

  const downloadPdf = async (submissionId) => {
    const response = await api.get(`/reports/${submissionId}/pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `criterion-2-${submissionId}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Reports</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">
          {user.role === "admin" ? "Admin reporting panel" : "My submission reports"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Search, filter, review, and export Criterion 2 reports as PDF.
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_220px_220px]">
        <label className="relative">
          <span className="label-base">Search</span>
          <Search className="pointer-events-none absolute left-4 top-[3.1rem] h-4 w-4 text-slate-400" />
          <input
            className="input-base pl-11"
            placeholder="Teacher, email, academic year"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
        </label>

        <label>
          <span className="label-base">Department</span>
          <select
            className="input-base"
            value={filters.department}
            onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value }))}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="label-base">Status</span>
          <select
            className="input-base"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4">Teacher</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Year</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Completion</th>
                <th className="px-5 py-4">Marks</th>
                <th className="px-5 py-4 text-right">Export</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{submission.teacher?.name || "N/A"}</p>
                    <p className="text-xs text-slate-500">{submission.teacher?.email || ""}</p>
                  </td>
                  <td className="px-5 py-4">{submission.department || submission.teacher?.department || "N/A"}</td>
                  <td className="px-5 py-4">{submission.academicYear}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{submission.scores?.completion?.percentage || 0}%</td>
                  <td className="px-5 py-4">{submission.scores?.total || 0}/120</td>
                  <td className="px-5 py-4 text-right">
                    <button type="button" onClick={() => downloadPdf(submission._id)} className="button-secondary gap-2">
                      <Download className="h-4 w-4" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-slate-500">
                    No matching submissions found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
