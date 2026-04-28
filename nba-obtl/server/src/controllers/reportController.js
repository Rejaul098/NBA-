import { CriterionSubmission } from "../models/CriterionSubmission.js";
import { buildSubmissionPdf } from "../services/pdfReport.js";

export const exportSubmissionPdf = async (req, res) => {
  const { id } = req.params;
  const submission = await CriterionSubmission.findById(id).populate("teacher", "name email department");

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (req.user.role !== "admin" && String(submission.teacher._id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="criterion-2-${submission.teacher.name.replace(/\s+/g, "-").toLowerCase()}.pdf"`
  );

  buildSubmissionPdf(submission, res);
};
