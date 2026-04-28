function StatsCard({ label, value, hint, accent = "from-blue-500 to-cyan-500" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className={`inline-flex rounded-2xl bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold text-white`}>
        {label}
      </div>
      <p className="mt-4 text-3xl font-bold text-ink">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

export default StatsCard;
