import { CriterionSubmission } from "../models/CriterionSubmission.js";
import { calculateScores } from "../utils/scoreCriterion.js";
import { sectionMeta, sectionKeys } from "../utils/sectionConfig.js";

const currentAcademicYear = () => {
  const year = new Date().getFullYear();
  return `${year}-${year + 1}`;
};

const createEmptySections = () =>
  sectionKeys.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

const createDemoSections = () => ({
  teachingLearning: [
    {
      title: "Academic Calendar Adherence and Active Learning",
      process: "Weekly lesson planning was aligned to the academic calendar and course outcomes with internal review checkpoints.",
      methodType: "Collaborative Learning",
      implementation: "Peer-learning groups, flipped classroom discussions, and guided worksheets were used in core theory classes.",
      impact: "Student participation improved, slower learners received support, and unit test performance increased steadily across the semester.",
      impactQuality: "high",
      date: "2026-02-12"
    },
    {
      title: "Real-world Example Integration in Core Courses",
      process: "Faculty mapped each unit with at least one real industrial or social problem relevant to the syllabus.",
      methodType: "Real-world Examples",
      implementation: "Case snippets from manufacturing, IoT systems, and software deployment were used during lectures and tutorials.",
      impact: "Students connected abstract concepts with practical application and produced stronger analytical responses in assessments.",
      impactQuality: "high",
      date: "2026-03-03"
    }
  ],
  capstoneProjects: [
    {
      title: "Smart Water Quality Monitoring System",
      projectType: "Product",
      sustainability: "strong",
      prototype: "yes",
      description: "Final-year team developed an IoT-enabled prototype to monitor pH, turbidity, and temperature for sustainable water usage.",
      poPso: ["PO1", "PO3", "PO5", "PO7", "PSO1"]
    },
    {
      title: "Campus Energy Analytics Dashboard",
      projectType: "Application",
      sustainability: "strong",
      prototype: "yes",
      description: "Students built a data dashboard to analyze classroom energy usage and recommend energy-saving actions.",
      poPso: ["PO2", "PO4", "PO7", "PO10", "PSO2"]
    }
  ],
  internships: [
    {
      company: "Tata Consultancy Services",
      durationWeeks: 8,
      skills: "Web application development, agile workflow, API integration, documentation, testing",
      completed: "yes",
      startDate: "2025-05-20",
      endDate: "2025-07-15"
    },
    {
      company: "Infosys Springboard Industry Training",
      durationWeeks: 6,
      skills: "Cloud fundamentals, Python automation, team collaboration, presentation",
      completed: "yes",
      startDate: "2025-06-10",
      endDate: "2025-07-25"
    }
  ],
  seminars: [
    {
      topic: "Design Thinking for Smart Manufacturing",
      course: "Industry 4.0",
      seminarType: "Seminar",
      poPso: ["PO3", "PO9", "PO10"],
      eventDate: "2026-01-18"
    },
    {
      topic: "Mini Project on Automated Attendance Analytics",
      course: "Database Management Systems",
      seminarType: "Mini Project",
      poPso: ["PO1", "PO2", "PO5", "PSO2"],
      eventDate: "2026-02-28"
    }
  ],
  caseStudies: [
    {
      title: "Failure Analysis of Urban Drainage Monitoring System",
      type: "Real-life example",
      complexityLevel: "high",
      summary: "Students analyzed sensor, data-loss, and maintenance issues in a smart city drainage alert system and proposed redesign actions.",
      poPso: ["PO2", "PO4", "PO7", "PSO1"]
    },
    {
      title: "Software Scalability in Online Examination Platforms",
      type: "Case study",
      complexityLevel: "medium",
      summary: "The class reviewed performance bottlenecks, user load handling, and security tradeoffs from a live exam system scenario.",
      poPso: ["PO2", "PO5", "PO8", "PO12"]
    }
  ],
  moocs: [
    {
      platform: "NPTEL",
      courseName: "Introduction to Industry 4.0 and Industrial Internet of Things",
      certification: "yes",
      learnersCount: 42,
      poPso: ["PO1", "PO5", "PO12", "PSO1"]
    },
    {
      platform: "SWAYAM",
      courseName: "Project Management for Engineers",
      certification: "yes",
      learnersCount: 35,
      poPso: ["PO9", "PO10", "PO11"]
    }
  ],
  problemSolving: [
    {
      title: "Project-based Learning on Smart Waste Segregation",
      activityType: "PBL",
      sdgMapping: ["SDG 9 Industry Innovation", "SDG 11 Sustainable Cities", "SDG 12 Responsible Consumption"],
      sustainabilityFocus: "yes",
      realWorldContext: "yes",
      outcome: "Students designed a working concept and evaluation framework for automated waste classification in urban environments."
    },
    {
      title: "Hackathon on Rural Healthcare Monitoring",
      activityType: "Hackathon",
      sdgMapping: ["SDG 3 Good Health", "SDG 9 Industry Innovation"],
      sustainabilityFocus: "yes",
      realWorldContext: "yes",
      outcome: "Teams proposed low-cost connected health solutions and presented deployment tradeoffs for rural settings."
    }
  ],
  industryInteraction: [
    {
      industryName: "Bosch",
      activityType: "Guest Lecture",
      outcome: "Experts delivered sessions on embedded systems trends and project expectations for industry-ready graduates.",
      collaborationQuality: "active",
      interactionDate: "2026-01-22"
    },
    {
      industryName: "Wipro",
      activityType: "Training",
      outcome: "A structured training program improved student readiness in aptitude, software engineering workflow, and interview practice.",
      collaborationQuality: "strategic",
      interactionDate: "2026-03-10"
    }
  ]
});

const sanitizeEntries = (entries = []) =>
  entries.map((entry) => {
    const cleaned = {};
    Object.entries(entry || {}).forEach(([key, value]) => {
      if (["_id", "createdAt", "updatedAt", "__v", "proofFile"].includes(key)) {
        return;
      }
      if (key === "proof") {
        cleaned[key] = value && typeof value === "object" ? value : undefined;
        return;
      }
      if (Array.isArray(value)) {
        cleaned[key] = value.filter(Boolean);
        return;
      }
      cleaned[key] = value ?? "";
    });
    return cleaned;
  });

const getOrCreateSubmission = async (user, academicYear) => {
  let submission = await CriterionSubmission.findOne({
    teacher: user._id,
    academicYear
  }).populate("teacher", "name email role department");

  if (!submission) {
    const scores = calculateScores(createEmptySections());
    submission = await CriterionSubmission.create({
      teacher: user._id,
      academicYear,
      department: user.department,
      sections: createEmptySections(),
      scores
    });
    submission = await submission.populate("teacher", "name email role department");
  }

  return submission;
};

export const getCurrentSubmission = async (req, res) => {
  const academicYear = req.query.academicYear || currentAcademicYear();
  const submission = await getOrCreateSubmission(req.user, academicYear);
  res.json({ submission, sectionMeta });
};

export const saveSection = async (req, res) => {
  const { sectionKey } = req.params;
  const academicYear = req.body.academicYear || currentAcademicYear();

  if (!sectionKeys.includes(sectionKey)) {
    return res.status(400).json({ message: "Invalid section key" });
  }

  const submission = await getOrCreateSubmission(req.user, academicYear);
  submission.set(`sections.${sectionKey}`, sanitizeEntries(req.body.entries || []));
  submission.status = req.body.status === "submitted" ? "submitted" : "draft";
  submission.department = req.user.department;
  submission.scores = calculateScores(submission.sections);
  await submission.save();
  await submission.populate("teacher", "name email role department");

  res.json({
    message: `${sectionMeta[sectionKey].title} saved successfully`,
    submission
  });
};

export const loadDemoSubmission = async (req, res) => {
  const academicYear = req.body.academicYear || currentAcademicYear();
  const submission = await getOrCreateSubmission(req.user, academicYear);
  const demoSections = createDemoSections();

  for (const sectionKey of sectionKeys) {
    submission.set(`sections.${sectionKey}`, sanitizeEntries(demoSections[sectionKey] || []));
  }

  submission.status = "submitted";
  submission.department = req.user.department;
  submission.scores = calculateScores(submission.sections);
  await submission.save();
  await submission.populate("teacher", "name email role department");

  res.json({
    message: "Demo data loaded successfully",
    submission
  });
};

export const getDashboardSummary = async (req, res) => {
  if (req.user.role === "admin") {
    const submissions = await CriterionSubmission.find().populate("teacher", "name email department role");
    const totalSubmissions = submissions.length;
    const totalTeachers = new Set(submissions.map((item) => String(item.teacher?._id))).size;
    const averageScore = totalSubmissions
      ? Number(
          (
            submissions.reduce((sum, item) => sum + (item.scores?.total || 0), 0) / totalSubmissions
          ).toFixed(2)
        )
      : 0;
    const completion = totalSubmissions
      ? Math.round(
          submissions.reduce((sum, item) => sum + (item.scores?.completion?.percentage || 0), 0) / totalSubmissions
        )
      : 0;

    return res.json({
      summary: {
        totalSubmissions,
        totalTeachers,
        averageScore,
        completion
      }
    });
  }

  const submission = await getOrCreateSubmission(req.user, req.query.academicYear || currentAcademicYear());

  res.json({
    summary: {
      totalSubmissions: sectionKeys.reduce(
        (sum, key) => sum + (submission.sections[key]?.length || 0),
        0
      ),
      completion: submission.scores.completion.percentage,
      totalMarks: submission.scores.total,
      sectionScores: submission.scores.sectionScores
    }
  });
};

export const listSubmissions = async (req, res) => {
  const { search = "", department = "", status = "" } = req.query;
  const filters = {};

  if (status) {
    filters.status = status;
  }

  let query = CriterionSubmission.find(filters).populate("teacher", "name email department");
  const submissions = await query.sort({ updatedAt: -1 });

  const filtered = submissions.filter((submission) => {
    const teacher = submission.teacher || {};
    const matchesSearch =
      !search ||
      [teacher.name, teacher.email, submission.academicYear]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesDepartment =
      !department || (submission.department || teacher.department || "").toLowerCase() === department.toLowerCase();

    if (req.user.role === "teacher") {
      return String(submission.teacher?._id) === String(req.user._id) && matchesSearch && matchesDepartment;
    }

    return matchesSearch && matchesDepartment;
  });

  res.json({ submissions: filtered });
};

export const getSubmissionById = async (req, res) => {
  const submission = await CriterionSubmission.findById(req.params.id).populate(
    "teacher",
    "name email department role"
  );

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (req.user.role !== "admin" && String(submission.teacher._id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({ submission });
};
