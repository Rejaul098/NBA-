import { sectionMeta, sectionKeys } from "./sectionConfig.js";

const clamp = (value, max) => Number(Math.min(max, value).toFixed(2));
const hasText = (value) => Boolean(value && String(value).trim());
const hasValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  return hasText(value);
};

const sectionRequirements = {
  teachingLearning: ["title", "process", "methodType", "implementation", "impact", "impactQuality", "assessmentPractice", "date"],
  capstoneProjects: [
    "title",
    "projectType",
    "sustainability",
    "prototype",
    "description",
    "guideAllocation",
    "standardsConsidered",
    "monitoringProcess",
    "poPso"
  ],
  internships: [
    "company",
    "durationWeeks",
    "skills",
    "completed",
    "processStructured",
    "poPso",
    "feedbackAnalysis",
    "startDate",
    "endDate"
  ],
  seminars: ["topic", "course", "seminarType", "projectMagnitude", "poPso", "eventDate"],
  caseStudies: ["title", "type", "complexityLevel", "summary", "poPso"],
  moocs: ["platform", "courseName", "certification", "learnersCount", "resourceSupport", "poPso"],
  problemSolving: ["title", "activityType", "sdgMapping", "sustainabilityFocus", "realWorldContext", "outcome"],
  industryInteraction: ["industryName", "activityType", "outcome", "collaborationQuality", "interactionDate"]
};

const buildBreakdown = (entryCount, filledFields, totalFields, maxMarks) => {
  const completionRatio = totalFields === 0 ? 0 : filledFields / totalFields;
  const score = clamp(completionRatio * maxMarks, maxMarks);

  return {
    score,
    breakdown: {
      entriesAdded: entryCount,
      filledFields,
      totalFields,
      missingFields: Math.max(totalFields - filledFields, 0),
      completionPercent: Math.round(completionRatio * 100)
    }
  };
};

const scoreSectionByCompletion = (entries = [], sectionKey) => {
  const requirements = sectionRequirements[sectionKey] || [];

  if (!entries.length || !requirements.length) {
    return buildBreakdown(0, 0, requirements.length, sectionMeta[sectionKey].maxMarks);
  }

  let filledFields = 0;
  const totalFields = requirements.length * entries.length;

  for (const entry of entries) {
    for (const field of requirements) {
      if (hasValue(entry?.[field])) {
        filledFields += 1;
      }
    }
  }

  return buildBreakdown(entries.length, filledFields, totalFields, sectionMeta[sectionKey].maxMarks);
};

export const calculateScores = (sections = {}) => {
  const scores = {};
  const sectionBreakdowns = {};

  for (const sectionKey of sectionKeys) {
    const entries = Array.isArray(sections[sectionKey]) ? sections[sectionKey] : [];
    const result = scoreSectionByCompletion(entries, sectionKey);
    scores[sectionKey] = result.score;
    sectionBreakdowns[sectionKey] = result.breakdown;
  }

  const total = clamp(
    Object.values(scores).reduce((sum, value) => sum + value, 0),
    Object.values(sectionMeta).reduce((sum, meta) => sum + meta.maxMarks, 0)
  );

  const completedSections = sectionKeys.filter((sectionKey) => (sections[sectionKey] || []).length > 0).length;

  return {
    sectionScores: scores,
    sectionBreakdowns,
    total,
    completion: {
      completedSections,
      totalSections: sectionKeys.length,
      percentage: Math.round((completedSections / sectionKeys.length) * 100)
    }
  };
};
