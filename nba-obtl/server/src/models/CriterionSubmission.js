import mongoose from "mongoose";

const proofSchema = new mongoose.Schema(
  {
    fileName: String,
    originalName: String,
    fileUrl: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date
  },
  { _id: false }
);

const commonOptions = { _id: true, timestamps: true };

const teachingLearningSchema = new mongoose.Schema(
  {
    title: String,
    process: String,
    methodType: String,
    implementation: String,
    impact: String,
    impactQuality: String,
    date: String,
    proof: proofSchema
  },
  commonOptions
);

const capstoneSchema = new mongoose.Schema(
  {
    title: String,
    projectType: String,
    sustainability: String,
    prototype: String,
    description: String,
    poPso: [String],
    proof: proofSchema
  },
  commonOptions
);

const internshipSchema = new mongoose.Schema(
  {
    company: String,
    durationWeeks: Number,
    skills: String,
    completed: String,
    startDate: String,
    endDate: String,
    proof: proofSchema
  },
  commonOptions
);

const seminarSchema = new mongoose.Schema(
  {
    topic: String,
    course: String,
    seminarType: String,
    poPso: [String],
    eventDate: String,
    proof: proofSchema
  },
  commonOptions
);

const caseStudySchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    complexityLevel: String,
    summary: String,
    poPso: [String],
    proof: proofSchema
  },
  commonOptions
);

const moocSchema = new mongoose.Schema(
  {
    platform: String,
    courseName: String,
    certification: String,
    learnersCount: Number,
    poPso: [String],
    proof: proofSchema
  },
  commonOptions
);

const problemSolvingSchema = new mongoose.Schema(
  {
    title: String,
    activityType: String,
    sdgMapping: [String],
    sustainabilityFocus: String,
    realWorldContext: String,
    outcome: String,
    proof: proofSchema
  },
  commonOptions
);

const industryInteractionSchema = new mongoose.Schema(
  {
    industryName: String,
    activityType: String,
    outcome: String,
    collaborationQuality: String,
    interactionDate: String,
    proof: proofSchema
  },
  commonOptions
);

const criterionSubmissionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft"
    },
    sections: {
      teachingLearning: { type: [teachingLearningSchema], default: [] },
      capstoneProjects: { type: [capstoneSchema], default: [] },
      internships: { type: [internshipSchema], default: [] },
      seminars: { type: [seminarSchema], default: [] },
      caseStudies: { type: [caseStudySchema], default: [] },
      moocs: { type: [moocSchema], default: [] },
      problemSolving: { type: [problemSolvingSchema], default: [] },
      industryInteraction: { type: [industryInteractionSchema], default: [] }
    },
    scores: {
      sectionScores: {
        teachingLearning: { type: Number, default: 0 },
        capstoneProjects: { type: Number, default: 0 },
        internships: { type: Number, default: 0 },
        seminars: { type: Number, default: 0 },
        caseStudies: { type: Number, default: 0 },
        moocs: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        industryInteraction: { type: Number, default: 0 }
      },
      total: { type: Number, default: 0 },
      completion: {
        completedSections: { type: Number, default: 0 },
        totalSections: { type: Number, default: 8 },
        percentage: { type: Number, default: 0 }
      }
    }
  },
  { timestamps: true }
);

criterionSubmissionSchema.index({ teacher: 1, academicYear: 1 }, { unique: true });

export const CriterionSubmission = mongoose.model("CriterionSubmission", criterionSubmissionSchema);
