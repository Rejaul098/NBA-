function FieldRenderer({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <div>
        <label className="label-base">{field.label}</label>
        <textarea
          className="input-base min-h-[110px]"
          value={value || ""}
          placeholder={field.placeholder || ""}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="label-base">{field.label}</label>
        <select className="input-base" value={value || ""} onChange={(event) => onChange(field.name, event.target.value)}>
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="md:col-span-2">
        <label className="label-base">{field.label}</label>
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
          {field.options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label key={option} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange(
                      field.name,
                      checked ? selected.filter((item) => item !== option) : [...selected, option]
                    )
                  }
                />
                {option}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div>
        <label className="label-base">{field.label}</label>
        <input
          type="file"
          accept="application/pdf"
          className="input-base file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium"
          onChange={(event) => onChange(field.name, event.target.files?.[0] || null)}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="label-base">{field.label}</label>
      <input
        type={field.type}
        className="input-base"
        value={value || ""}
        placeholder={field.placeholder || ""}
        onChange={(event) => onChange(field.name, event.target.value)}
      />
    </div>
  );
}

export default FieldRenderer;
