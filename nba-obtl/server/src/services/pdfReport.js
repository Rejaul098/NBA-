import PDFDocument from "pdfkit";
import { sectionMeta, sectionKeys } from "../utils/sectionConfig.js";

export const buildSubmissionPdf = (submission, stream) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(stream);

  doc.fontSize(20).fillColor("#11284b").text("NBA Criterion 2 Report");
  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .fillColor("#334155")
    .text(`Teacher: ${submission.teacher?.name || "N/A"}`)
    .text(`Email: ${submission.teacher?.email || "N/A"}`)
    .text(`Department: ${submission.department || submission.teacher?.department || "N/A"}`)
    .text(`Academic Year: ${submission.academicYear}`)
    .text(`Total Marks: ${submission.scores.total} / 120`)
    .text(`Completion: ${submission.scores.completion.percentage}%`);

  doc.moveDown();

  for (const sectionKey of sectionKeys) {
    const meta = sectionMeta[sectionKey];
    const entries = submission.sections?.[sectionKey] || [];
    const score = submission.scores?.sectionScores?.[sectionKey] || 0;

    doc
      .fontSize(14)
      .fillColor("#0f172a")
      .text(`${meta.code} ${meta.title} (${score}/${meta.maxMarks})`, { underline: true });

    if (entries.length === 0) {
      doc.moveDown(0.3).fontSize(10).fillColor("#64748b").text("No entries submitted.");
      doc.moveDown();
      continue;
    }

    entries.forEach((entry, index) => {
      doc.moveDown(0.4).fontSize(11).fillColor("#1e293b").text(`Entry ${index + 1}`);
      Object.entries(entry.toObject ? entry.toObject() : entry).forEach(([key, value]) => {
        if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return;
        if (key === "proof" && value?.fileUrl) {
          doc.fontSize(9).fillColor("#475569").text(`Proof: ${value.originalName || value.fileName}`);
          return;
        }
        if (Array.isArray(value) && value.length) {
          doc.fontSize(9).fillColor("#475569").text(`${key}: ${value.join(", ")}`);
          return;
        }
        if (value) {
          doc.fontSize(9).fillColor("#475569").text(`${key}: ${value}`);
        }
      });
    });

    doc.moveDown();
  }

  doc.end();
};
