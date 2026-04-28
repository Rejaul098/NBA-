function ProgressBar({ value }) {
  return (
    <div className="overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-brand via-sky-500 to-accent transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export default ProgressBar;
