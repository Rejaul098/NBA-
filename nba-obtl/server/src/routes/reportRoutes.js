import { Router } from "express";
import { exportSubmissionPdf } from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/:id/pdf", protect, asyncHandler(exportSubmissionPdf));

export default router;
