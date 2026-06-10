export const poPsoOptions = [
  "PO1",
  "PO2",
  "PO3",
  "PO4",
  "PO5",
  "PO6",
  "PO7",
  "PO8",
  "PO9",
  "PO10",
  "PO11",
  "PO12",
  "PSO1",
  "PSO2",
  "PSO3"
];

export const sdgOptions = [
  "SDG 3 Good Health",
  "SDG 4 Quality Education",
  "SDG 6 Clean Water",
  "SDG 7 Affordable Energy",
  "SDG 8 Decent Work",
  "SDG 9 Industry Innovation",
  "SDG 11 Sustainable Cities",
  "SDG 12 Responsible Consumption",
  "SDG 13 Climate Action"
];

export const criterionSections = [
  {
    key: "teachingLearning",
    code: "2.1",
    title: "Teaching Learning Process",
    maxMarks: 20,
    description:
      "Document quality-focused teaching processes, pedagogy, implementation evidence, and measurable impact.",
    rubric: [
      "Adherence to academic calendar (4)",
      "Pedagogical initiatives (5)",
      "Support for students based on ability (4)",
      "Quality of classroom teaching (4)",
      "Conduct of assessments (3)"
    ],
    emptyEntry: {
      title: "",
      process: "",
      methodType: "",
      implementation: "",
      impact: "",
      impactQuality: "",
      assessmentPractice: "",
      date: "",
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "title", label: "Title", type: "text", placeholder: "Academic calendar adherence" },
      {
        name: "methodType",
        label: "Method Type",
        type: "select",
        options: [
          "Collaborative Learning",
          "Real-world Examples",
          "Laboratory Innovation",
          "Slow Learner Support",
          "Fast Learner Enrichment",
          "Project-based Learning"
        ]
      },
      { name: "process", label: "Process", type: "textarea", placeholder: "Describe the process followed" },
      { name: "implementation", label: "Implementation", type: "textarea", placeholder: "How was it implemented?" },
      { name: "impact", label: "Impact", type: "textarea", placeholder: "Observed student impact" },
      { name: "impactQuality", label: "Impact Quality", type: "select", options: ["low", "medium", "high"] },
      {
        name: "assessmentPractice",
        label: "Assessment Practice",
        type: "textarea",
        placeholder: "How were quizzes, assignments, or classroom assessments conducted?"
      },
      { name: "date", label: "Date", type: "date" },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  },
  {
    key: "capstoneProjects",
    code: "2.2",
    title: "Capstone Projects",
    maxMarks: 25,
    description:
      "Capture project quality, sustainability integration, working prototypes, and PO/PSO coverage.",
    rubric: [
      "Project identification and guide allocation (5)",
      "Project type and relevance to sustainability/standards (10)",
      "Continuous monitoring process (4)",
      "Quality of completed projects or prototypes (6)"
    ],
    emptyEntry: {
      title: "",
      projectType: "",
      sustainability: "",
      prototype: "",
      description: "",
      guideAllocation: "",
      standardsConsidered: "",
      monitoringProcess: "",
      poPso: [],
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "title", label: "Project Title", type: "text" },
      {
        name: "projectType",
        label: "Project Type",
        type: "select",
        options: ["Application", "Product", "Research", "Review", "Simulation"]
      },
      {
        name: "sustainability",
        label: "Sustainability",
        type: "select",
        options: ["none", "moderate", "strong"]
      },
      { name: "prototype", label: "Prototype Available", type: "select", options: ["yes", "no"] },
      { name: "description", label: "Project Description", type: "textarea" },
      {
        name: "guideAllocation",
        label: "Guide Allocation / Allotment",
        type: "textarea",
        placeholder: "Mention guide allotment, project identification, or team allocation process"
      },
      {
        name: "standardsConsidered",
        label: "Standards / Constraints Considered",
        type: "textarea",
        placeholder: "Mention environment, safety, ethics, cost, standards, or sustainability considerations"
      },
      {
        name: "monitoringProcess",
        label: "Monitoring Process",
        type: "textarea",
        placeholder: "Describe review meetings, milestones, or continuous monitoring"
      },
      { name: "poPso", label: "PO / PSO", type: "multiselect", options: poPsoOptions },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  },
  {
    key: "internships",
    code: "2.3",
    title: "Internship / Industrial Training",
    maxMarks: 10,
    description: "Track company, duration, student skills, completion, and certificate evidence.",
    rubric: [
      "Internship / industrial training process (3)",
      "PO / PSO mapping of training (4)",
      "Student feedback and analysis (3)"
    ],
    emptyEntry: {
      company: "",
      durationWeeks: "",
      skills: "",
      completed: "",
      processStructured: "",
      poPso: [],
      feedbackAnalysis: "",
      startDate: "",
      endDate: "",
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "company", label: "Company", type: "text" },
      { name: "durationWeeks", label: "Duration (Weeks)", type: "number" },
      { name: "skills", label: "Skills Developed", type: "textarea" },
      { name: "completed", label: "Completed", type: "select", options: ["yes", "no"] },
      {
        name: "processStructured",
        label: "Training Process",
        type: "select",
        options: ["well-defined", "formal", "basic"]
      },
      { name: "poPso", label: "PO / PSO", type: "multiselect", options: poPsoOptions },
      {
        name: "feedbackAnalysis",
        label: "Student Feedback / Analysis",
        type: "textarea",
        placeholder: "Summarize internship feedback or analysis from students"
      },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "proof", label: "Certificate / PDF Proof", type: "file" }
    ]
  },
  {
    key: "seminars",
    code: "2.4",
    title: "Seminar / Mini Projects",
    maxMarks: 10,
    description: "Add seminar or mini-project activities with course mapping and PO/PSO alignment.",
    rubric: [
      "Seminar mapping with POs / PSOs (5)",
      "Magnitude and contribution of mini / micro projects (5)"
    ],
    emptyEntry: {
      topic: "",
      course: "",
      seminarType: "",
      projectMagnitude: "",
      poPso: [],
      eventDate: "",
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "topic", label: "Topic", type: "text" },
      { name: "course", label: "Course", type: "text" },
      {
        name: "seminarType",
        label: "Type",
        type: "select",
        options: ["Seminar", "Mini Project", "Micro Project"]
      },
      {
        name: "projectMagnitude",
        label: "Project Magnitude",
        type: "select",
        options: ["low", "medium", "high"]
      },
      { name: "poPso", label: "PO / PSO", type: "multiselect", options: poPsoOptions },
      { name: "eventDate", label: "Date", type: "date" },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  },
  {
    key: "caseStudies",
    code: "2.5",
    title: "Case Studies / Real-Life Examples",
    maxMarks: 10,
    description: "Highlight real-life case usage with complexity and outcome-oriented mapping.",
    rubric: ["Use of case studies / real-life examples with PO / PSO mapping (10)"],
    emptyEntry: {
      title: "",
      type: "",
      complexityLevel: "",
      summary: "",
      poPso: [],
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "title", label: "Case Study Title", type: "text" },
      { name: "type", label: "Type", type: "text", placeholder: "Case study / Real-life example" },
      {
        name: "complexityLevel",
        label: "Complexity Level",
        type: "select",
        options: ["low", "medium", "high"]
      },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "poPso", label: "PO / PSO", type: "multiselect", options: poPsoOptions },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  },
  {
    key: "moocs",
    code: "2.6",
    title: "SWAYAM / NPTEL / MOOC",
    maxMarks: 10,
    description: "Capture platform usage, certifications, student participation, and PO/PSO mapping.",
    rubric: [
      "Students certified in MOOCs with PO / PSO mapping (7)",
      "Scope for self-learning and facilities / resources (3)"
    ],
    emptyEntry: {
      platform: "",
      courseName: "",
      certification: "",
      learnersCount: "",
      resourceSupport: "",
      poPso: [],
      proof: null,
      proofFile: null
    },
    fields: [
      {
        name: "platform",
        label: "Platform",
        type: "select",
        options: ["SWAYAM", "NPTEL", "Coursera", "edX", "Other"]
      },
      { name: "courseName", label: "Course Name", type: "text" },
      { name: "certification", label: "Certification", type: "select", options: ["yes", "no"] },
      { name: "learnersCount", label: "Learners Count", type: "number" },
      {
        name: "resourceSupport",
        label: "Self-learning Resources / Support",
        type: "textarea",
        placeholder: "Describe facilities, mentoring, or resources provided for self-learning"
      },
      { name: "poPso", label: "PO / PSO", type: "multiselect", options: poPsoOptions },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  },
  {
    key: "problemSolving",
    code: "2.7",
    title: "Complex Engineering Problem Solving",
    maxMarks: 20,
    description:
      "Document problem-based learning, hackathons, SDG mapping, and real-world sustainability outcomes.",
    rubric: ["Use of complex engineering problems from courses / activities along with targeted SDGs (20)"],
    emptyEntry: {
      title: "",
      activityType: "",
      sdgMapping: [],
      sustainabilityFocus: "",
      realWorldContext: "",
      outcome: "",
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "title", label: "Activity Title", type: "text" },
      {
        name: "activityType",
        label: "Activity Type",
        type: "select",
        options: ["PBL", "Hackathon", "Integrated Design Project", "Mini Project", "Capstone"]
      },
      { name: "sdgMapping", label: "SDG Mapping", type: "multiselect", options: sdgOptions },
      { name: "sustainabilityFocus", label: "Sustainability Focus", type: "select", options: ["yes", "no"] },
      { name: "realWorldContext", label: "Real-world Context", type: "select", options: ["yes", "no"] },
      { name: "outcome", label: "Outcome", type: "textarea" },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  },
  {
    key: "industryInteraction",
    code: "2.8",
    title: "Industry Institute Interaction",
    maxMarks: 15,
    description: "Track collaborations, training, expert sessions, and quality of industry partnership outcomes.",
    rubric: [
      "Industry involvement in partial delivery of regular courses (5)",
      "Industry offered courses / training (4)",
      "Industry supported laboratories (3)",
      "Industry / alumni as experts (3)"
    ],
    emptyEntry: {
      industryName: "",
      activityType: "",
      outcome: "",
      collaborationQuality: "",
      interactionDate: "",
      proof: null,
      proofFile: null
    },
    fields: [
      { name: "industryName", label: "Industry Name", type: "text" },
      {
        name: "activityType",
        label: "Activity Type",
        type: "select",
        options: [
          "Guest Lecture",
          "Training",
          "Lab Support",
          "Joint Project",
          "Partial Course Delivery",
          "Industry Alumni Session"
        ]
      },
      { name: "outcome", label: "Outcome", type: "textarea" },
      {
        name: "collaborationQuality",
        label: "Collaboration Quality",
        type: "select",
        options: ["emerging", "active", "strategic"]
      },
      { name: "interactionDate", label: "Date", type: "date" },
      { name: "proof", label: "PDF Proof", type: "file" }
    ]
  }
];
