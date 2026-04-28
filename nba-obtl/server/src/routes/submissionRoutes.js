import { Router } from "express";
import {
  getCurrentSubmission,
  getDashboardSummary,
  getSubmissionById,
  loadDemoSubmission,
  listSubmissions,
  saveSection
} from "../controllers/submissionController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);
router.get("/dashboard", asyncHandler(getDashboardSummary));
router.get("/current", asyncHandler(getCurrentSubmission));
router.post("/current/load-demo", asyncHandler(loadDemoSubmission));
router.put("/current/section/:sectionKey", asyncHandler(saveSection));
router.get("/", asyncHandler(listSubmissions));
router.get("/:id", asyncHandler(getSubmissionById));

export default router;
