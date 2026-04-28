export const uploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "PDF file is required" });
  }

  const baseUrl = process.env.UPLOAD_BASE_URL || `${req.protocol}://${req.get("host")}`;

  res.status(201).json({
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileUrl: `${baseUrl}/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  });
};
