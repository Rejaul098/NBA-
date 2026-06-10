import { sectionMeta, sectionKeys } from "./sectionConfig.js";

const clamp = (value, max) => Number(Math.min(max, value).toFixed(2));
const hasProof = (entry) => Boolean(entry?.proof?.fileUrl);
const listSize = (value) => (Array.isArray(value) ? value.length : 0);
const hasText = (value) => Boolean(value && String(value).trim());
const lowerText = (value) => String(value || "").toLowerCase();
const countEntries = (entries, predicate) => entries.filter(predicate).length;
const distinctCount = (entries, key) => new Set(entries.map((entry) => entry[key]).filter(Boolean)).size;
const anyTextContains = (entries, fields, keywords) =>
  entries.some((entry) =>
    keywords.some((keyword) =>
      fields.some((field) => lowerText(entry[field]).includes(keyword))
    )
  );
const averageImpactWeight = (entries, field, weights) => {
  if (!entries.length) return 0;
  const total = entries.reduce((sum, entry) => sum + (weights[entry[field]] || 0), 0);
  return total / entries.length;
};
const scaleByRatio = (ratio, max) => clamp(ratio * max, max);

const withBreakdown = (breakdown, maxMarks) => ({
  score: clamp(Object.values(breakdown).reduce((sum, value) => sum + value, 0), maxMarks),
  breakdown
});

const scoreTeachingLearning = (entries = []) => {
  const fullEntries = countEntries(
    entries,
    (entry) => hasText(entry.process) && hasText(entry.implementation) && hasText(entry.date)
  );
  const methodDiversity = distinctCount(entries, "methodType");
  const learnerSupport = anyTextContains(
    entries,
    ["methodType", "process", "implementation", "impact"],
    ["slow learner", "fast learner", "advanced learner", "remedial", "bridge", "enrichment"]
  );
  const classroomQualityRatio =
    entries.length === 0
      ? 0
      : entries.filter(
          (entry) =>
            hasText(entry.implementation) &&
            hasText(entry.impact) &&
            (entry.impactQuality === "medium" || entry.impactQuality === "high")
        ).length / entries.length;
  const assessmentEntries = countEntries(entries, (entry) => hasText(entry.assessmentPractice) || hasProof(entry));

  return withBreakdown(
    {
      adherenceToAcademicCalendar: Math.min(4, fullEntries >= 2 ? 4 : fullEntries === 1 ? 3 : entries.length ? 2 : 0),
      pedagogicalInitiatives: Math.min(5, methodDiversity >= 4 ? 5 : methodDiversity === 3 ? 4 : methodDiversity === 2 ? 3 : methodDiversity === 1 ? 2 : 0),
      supportStudentsByAbility: learnerSupport ? (methodDiversity >= 2 ? 4 : 3) : entries.length ? 1.5 : 0,
      classroomTeachingQuality: scaleByRatio(classroomQualityRatio, 4),
      conductOfAssessments: Math.min(3, assessmentEntries >= 2 ? 3 : assessmentEntries === 1 ? 2 : 0)
    },
    sectionMeta.teachingLearning.maxMarks
  );
};

const scoreCapstone = (entries = []) => {
  const guideEntries = countEntries(entries, (entry) => hasText(entry.guideAllocation));
  const relevantEntries = countEntries(
    entries,
    (entry) =>
      hasText(entry.projectType) &&
      hasText(entry.description) &&
      (entry.sustainability === "moderate" || entry.sustainability === "strong" || hasText(entry.standardsConsidered))
  );
  const monitoredEntries = countEntries(entries, (entry) => hasText(entry.monitoringProcess));
  const qualityEntries = countEntries(
    entries,
    (entry) => entry.prototype === "yes" && (hasProof(entry) || entry.sustainability === "strong")
  );

  return withBreakdown(
    {
      identificationAndGuideAllocation: Math.min(5, guideEntries >= 2 ? 5 : guideEntries === 1 ? 3.5 : 0),
      projectTypeAndRelevance: Math.min(10, relevantEntries >= 2 ? 10 : relevantEntries === 1 ? 6 : entries.length ? 3 : 0),
      continuousMonitoring: Math.min(4, monitoredEntries >= 2 ? 4 : monitoredEntries === 1 ? 2.5 : 0),
      qualityOfCompletedProjects: Math.min(6, qualityEntries >= 2 ? 6 : qualityEntries === 1 ? 4 : entries.some((entry) => entry.prototype === "yes") ? 2.5 : 0)
    },
    sectionMeta.capstoneProjects.maxMarks
  );
};

const scoreInternships = (entries = []) => {
  const processEntries = countEntries(
    entries,
    (entry) =>
      (entry.processStructured === "formal" || entry.processStructured === "well-defined") &&
      Number(entry.durationWeeks) >= 2
  );
  const mappingEntries = countEntries(entries, (entry) => listSize(entry.poPso) >= 2);
  const feedbackEntries = countEntries(entries, (entry) => hasText(entry.feedbackAnalysis) || hasProof(entry));

  return withBreakdown(
    {
      internshipProcess: Math.min(3, processEntries >= 2 ? 3 : processEntries === 1 ? 2 : entries.length ? 1 : 0),
      poPsoMapping: Math.min(4, mappingEntries >= 2 ? 4 : mappingEntries === 1 ? 2.5 : 0),
      feedbackAndAnalysis: Math.min(3, feedbackEntries >= 2 ? 3 : feedbackEntries === 1 ? 2 : 0)
    },
    sectionMeta.internships.maxMarks
  );
};

const scoreSeminars = (entries = []) => {
  const seminarMappings = countEntries(
    entries,
    (entry) => entry.seminarType === "Seminar" && listSize(entry.poPso) >= 2
  );
  const projectEntries = countEntries(
    entries,
    (entry) =>
      entry.seminarType !== "Seminar" &&
      listSize(entry.poPso) >= 2 &&
      (entry.projectMagnitude === "high" || entry.projectMagnitude === "medium")
  );

  return withBreakdown(
    {
      seminarPoPsoMapping: Math.min(5, seminarMappings >= 2 ? 5 : seminarMappings === 1 ? 3 : 0),
      miniProjectMagnitudeAndContribution: Math.min(5, projectEntries >= 2 ? 5 : projectEntries === 1 ? 3 : entries.some((entry) => entry.seminarType !== "Seminar") ? 1.5 : 0)
    },
    sectionMeta.seminars.maxMarks
  );
};

const scoreCaseStudies = (entries = []) => {
  const usableEntries = countEntries(
    entries,
    (entry) =>
      hasText(entry.type) &&
      listSize(entry.poPso) >= 2 &&
      (entry.complexityLevel === "medium" || entry.complexityLevel === "high")
  );
  const proofCount = countEntries(entries, (entry) => hasProof(entry));
  const ratio = entries.length === 0 ? 0 : (usableEntries + Math.min(proofCount, entries.length) * 0.25) / entries.length;

  return withBreakdown(
    {
      caseStudiesAndRealLifeExamples: scaleByRatio(Math.min(1, ratio), 10)
    },
    sectionMeta.caseStudies.maxMarks
  );
};

const scoreMoocs = (entries = []) => {
  const certifiedMappedEntries = countEntries(
    entries,
    (entry) => entry.certification === "yes" && Number(entry.learnersCount) > 0 && listSize(entry.poPso) >= 2
  );
  const resourceEntries = countEntries(entries, (entry) => hasText(entry.resourceSupport) || hasProof(entry));

  const certificationStrength = entries.reduce((sum, entry) => {
    if (entry.certification !== "yes") return sum;
    if (Number(entry.learnersCount) >= 30) return sum + 1;
    if (Number(entry.learnersCount) >= 10) return sum + 0.7;
    return sum + 0.4;
  }, 0);

  return withBreakdown(
    {
      moocCertificationAndMapping: Math.min(7, certifiedMappedEntries >= 2 ? 7 : clamp(certificationStrength * 3.5, 7)),
      selfLearningScopeAndFacilities: Math.min(3, resourceEntries >= 2 ? 3 : resourceEntries === 1 ? 2 : 0)
    },
    sectionMeta.moocs.maxMarks
  );
};

const scoreProblemSolving = (entries = []) => {
  const complexEntries = countEntries(
    entries,
    (entry) =>
      hasText(entry.activityType) &&
      listSize(entry.sdgMapping) >= 1 &&
      entry.realWorldContext === "yes" &&
      entry.sustainabilityFocus === "yes" &&
      hasText(entry.outcome)
  );
  const activityDiversity = distinctCount(entries, "activityType");
  const avgSdgCoverage =
    entries.length === 0 ? 0 : entries.reduce((sum, entry) => sum + Math.min(listSize(entry.sdgMapping), 3), 0) / entries.length;
  const proofRatio = entries.length === 0 ? 0 : countEntries(entries, (entry) => hasProof(entry)) / entries.length;
  const ratio =
    entries.length === 0
      ? 0
      : Math.min(1, complexEntries / entries.length * 0.6 + Math.min(activityDiversity, 3) / 3 * 0.2 + avgSdgCoverage / 3 * 0.15 + proofRatio * 0.05);

  return withBreakdown(
    {
      complexEngineeringProblemsTargetingSdgs: scaleByRatio(ratio, 20)
    },
    sectionMeta.problemSolving.maxMarks
  );
};

const scoreIndustryInteraction = (entries = []) => {
  const partialCourseEntries = countEntries(entries, (entry) => entry.activityType === "Partial Course Delivery");
  const trainingEntries = countEntries(entries, (entry) => entry.activityType === "Training");
  const labEntries = countEntries(entries, (entry) => entry.activityType === "Lab Support");
  const expertEntries = countEntries(
    entries,
    (entry) => entry.activityType === "Guest Lecture" || entry.activityType === "Industry Alumni Session"
  );

  return withBreakdown(
    {
      partialDeliveryOfCourses: Math.min(5, partialCourseEntries >= 2 ? 5 : partialCourseEntries === 1 ? 3 : 0),
      industryOfferedCoursesAndTraining: Math.min(4, trainingEntries >= 2 ? 4 : trainingEntries === 1 ? 2.5 : 0),
      industrySupportedLaboratories: Math.min(3, labEntries >= 1 ? 3 : 0),
      industryAndAlumniExperts: Math.min(3, expertEntries >= 2 ? 3 : expertEntries === 1 ? 2 : 0)
    },
    sectionMeta.industryInteraction.maxMarks
  );
};

const scoreMap = {
  teachingLearning: scoreTeachingLearning,
  capstoneProjects: scoreCapstone,
  internships: scoreInternships,
  seminars: scoreSeminars,
  caseStudies: scoreCaseStudies,
  moocs: scoreMoocs,
  problemSolving: scoreProblemSolving,
  industryInteraction: scoreIndustryInteraction
};

export const calculateScores = (sections = {}) => {
  const scores = {};
  const sectionBreakdowns = {};

  for (const sectionKey of sectionKeys) {
    const entries = Array.isArray(sections[sectionKey]) ? sections[sectionKey] : [];
    const result = scoreMap[sectionKey](entries);
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
