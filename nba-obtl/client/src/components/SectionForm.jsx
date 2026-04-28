import { useEffect, useState } from "react";
import { FileCheck2, Plus, Trash2 } from "lucide-react";
import api from "../lib/api";
import FieldRenderer from "./FieldRenderer";

function SectionForm({ section, submission, onUpdated }) {
  const [entries, setEntries] = useState(submission.sections?.[section.key] || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEntries(submission.sections?.[section.key] || []);
  }, [section.key, submission.sections]);

  const addEntry = () => {
    setEntries((current) => [...current, { ...section.emptyEntry }]);
  };

  const removeEntry = (entryIndex) => {
    setEntries((current) => current.filter((_, index) => index !== entryIndex));
  };

  const updateEntry = (entryIndex, fieldName, value) => {
    setEntries((current) =>
      current.map((entry, index) => {
        if (index !== entryIndex) return entry;
        if (fieldName === "proof") {
          return { ...entry, proofFile: value };
        }
        return { ...entry, [fieldName]: value };
      })
    );
  };

  const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/uploads/pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const preparedEntries = [];
      for (const entry of entries) {
        const { proofFile, ...rest } = entry;
        let proof = rest.proof || null;

        if (proofFile instanceof File) {
          proof = await uploadPdf(proofFile);
        }

        preparedEntries.push({
          ...rest,
          proof
        });
      }

      const response = await api.put(`/submissions/current/section/${section.key}`, {
        academicYear: submission.academicYear,
        entries: preparedEntries
      });

      onUpdated(response.data.submission);
      setMessage("Saved successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save section.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{section.description}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Max Marks {section.maxMarks}
          </p>
        </div>
        <button type="button" onClick={addEntry} className="button-secondary gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-slate-500">
          No entries added yet. Use <span className="font-semibold">Add Entry</span> to start this section.
        </div>
      ) : null}

      {entries.map((entry, entryIndex) => (
        <div key={entry._id || `${section.key}-${entryIndex}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Entry {entryIndex + 1}</p>
              {entry.proof?.originalName ? (
                <div className="mt-1 flex items-center gap-2 text-xs text-emerald-700">
                  <FileCheck2 className="h-3.5 w-3.5" />
                  Existing proof: {entry.proof.originalName}
                </div>
              ) : null}
            </div>
            <button type="button" onClick={() => removeEntry(entryIndex)} className="button-secondary gap-2">
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {section.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={field.type === "file" ? entry.proofFile : entry[field.name]}
                onChange={(name, value) => updateEntry(entryIndex, name, value)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{message}</p>
        <button type="button" onClick={handleSave} disabled={saving} className="button-primary">
          {saving ? "Saving..." : "Save Section"}
        </button>
      </div>
    </div>
  );
}

export default SectionForm;
