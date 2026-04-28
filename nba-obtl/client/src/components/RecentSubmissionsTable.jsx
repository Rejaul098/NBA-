function RecentSubmissionsTable({ recent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-ink">Recent submissions</h3>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3">Teacher</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Academic Year</th>
              <th className="pb-3">Completion</th>
              <th className="pb-3">Marks</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item) => (
              <tr key={item._id} className="border-t border-slate-100 text-slate-700">
                <td className="py-3">{item.teacher?.name || "N/A"}</td>
                <td className="py-3">{item.department || item.teacher?.department || "N/A"}</td>
                <td className="py-3">{item.academicYear}</td>
                <td className="py-3">{item.scores?.completion?.percentage || 0}%</td>
                <td className="py-3">{item.scores?.total || 0}/120</td>
              </tr>
            ))}
            {recent.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-500">
                  No submissions available yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentSubmissionsTable;
