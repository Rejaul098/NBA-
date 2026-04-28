import { sectionMeta, sectionKeys } from "./sectionConfig.js";

const clamp = (value, max) => Number(Math.min(max, value).toFixed(2));
const hasProof = (entry) => Boolean(entry?.proof?.fileUrl);
const textScore = (value, weight) => (value && String(value).trim() ? weight : 0);
const listSize = (value) => (Array.isArray(value) ? value.length : 0);

const scoreTeachingLearning = (entries = []) => {
  const diversity = new Set(entries.map((entry) => entry.methodType).filter(Boolean)).size;
  const total = entries.reduce((sum, entry) => {
    const impactWeights = { low: 1, medium: 2, high: 3 };
    return (
      sum +
      2 +
      (impactWeights[entry.impactQuality] || 0) +
      textScore(entry.process, 1) +
      textScore(entry.implementation, 1) +
      textScore(entry.impact, 1) +
      (hasProof(entry) ? 1 : 0)
    );
  }, 0);

  return clamp(total + diversity * 1.5, sectionMeta.teachingLearning.maxMarks);
};

const scoreCapstone = (entries = []) => {
  const total = entries.reduce((sum, entry) => {
    const sustainabilityWeights = { none: 0, moderate: 2, strong: 4 };
    return (
      sum +
      3 +
      (sustainabilityWeights[entry.sustainability] || 0) +
      (entry.prototype === "yes" ? 3 : 0) +
      Math.min(listSize(entry.poPso), 4) +
      (hasProof(entry) ? 2 : 0)
    );
  }, 0);

  return clamp(total, sectionMeta.capstoneProjects.maxMarks);
};

const scoreInternships = (entries = []) => {
  const total = entries.reduce((sum, entry) => {
    const durationScore =
      Number(entry.durationWeeks) >= 8 ? 3 : Number(entry.durationWeeks) >= 4 ? 2 : 1;
    return (
      sum +
      durationScore +
      (entry.completed === "yes" ? 2 : 0) +
      textScore(entry.skills, 1) +
      (hasProof(entry) ? 2 : 0)
    );
  }, 0);

  return clamp(total, sectionMeta.internships.maxMarks);
};

const scoreSeminars = (entries = []) => {
  const diversity = new Set(entries.map((entry) => entry.course).filter(Boolean)).size;
  const total = entries.reduce((sum, entry) => {
    return sum + 2 + Math.min(listSize(entry.poPso), 3) + (hasProof(entry) ? 1 : 0);
  }, 0);

  return clamp(total + diversity, sectionMeta.seminars.maxMarks);
};

const scoreCaseStudies = (entries = []) => {
  const complexityWeights = { low: 1, medium: 2, high: 3 };
  const total = entries.reduce((sum, entry) => {
    return sum + 2 + (complexityWeights[entry.complexityLevel] || 0) + (hasProof(entry) ? 1 : 0);
  }, 0);

  return clamp(total, sectionMeta.caseStudies.maxMarks);
};

const scoreMoocs = (entries = []) => {
  const total = entries.reduce((sum, entry) => {
    return (
      sum +
      2 +
      (entry.certification === "yes" ? 3 : 0) +
      (Number(entry.learnersCount) >= 30 ? 2 : Number(entry.learnersCount) > 0 ? 1 : 0) +
      Math.min(listSize(entry.poPso), 2) +
      (hasProof(entry) ? 1 : 0)
    );
  }, 0);

  return clamp(total, sectionMeta.moocs.maxMarks);
};

const scoreProblemSolving = (entries = []) => {
  const total = entries.reduce((sum, entry) => {
    const sdgCount = listSize(entry.sdgMapping);
    return (
      sum +
      3 +
      (entry.realWorldContext === "yes" ? 3 : 0) +
      (entry.sustainabilityFocus === "yes" ? 3 : 0) +
      Math.min(sdgCount, 4) +
      (hasProof(entry) ? 1 : 0)
    );
  }, 0);

  return clamp(total, sectionMeta.problemSolving.maxMarks);
};

const scoreIndustryInteraction = (entries = []) => {
  const qualityWeights = { emerging: 1, active: 2, strategic: 3 };
  const total = entries.reduce((sum, entry) => {
    return (
      sum +
      2 +
      (qualityWeights[entry.collaborationQuality] || 0) +
      textScore(entry.outcome, 2) +
      (hasProof(entry) ? 1 : 0)
    );
  }, 0);

  return clamp(total, sectionMeta.industryInteraction.maxMarks);
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

  for (const sectionKey of sectionKeys) {
    const entries = Array.isArray(sections[sectionKey]) ? sections[sectionKey] : [];
    scores[sectionKey] = scoreMap[sectionKey](entries);
  }

  const total = clamp(
    Object.values(scores).reduce((sum, value) => sum + value, 0),
    Object.values(sectionMeta).reduce((sum, meta) => sum + meta.maxMarks, 0)
  );

  const completedSections = sectionKeys.filter((sectionKey) => (sections[sectionKey] || []).length > 0).length;

  return {
    sectionScores: scores,
    total,
    completion: {
      completedSections,
      totalSections: sectionKeys.length,
      percentage: Math.round((completedSections / sectionKeys.length) * 100)
    }
  };
};
