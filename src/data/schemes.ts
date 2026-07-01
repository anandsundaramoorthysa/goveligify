import type { Scheme } from "@/lib/types";

/**
 * Phase-1 sample catalogue of Indian government education schemes
 * (scholarships, fellowships, loans, grants) for students.
 * Every record is labelled `source: "sample"`. A Phase-2 pipeline will
 * replace these with verified, dated records from the FastAPI backend.
 */
export const SCHEMES: Scheme[] = [
  /* ---------------------- central sector scholarship ----------------------- */
  {
    id: "css-college",
    slug: "central-sector-scheme-scholarships",
    name: "Central Sector Scheme of Scholarships for College and University Students",
    shortName: "CSS Scholarship",
    summary:
      "Merit scholarship of ₹10,000–₹20,000 per year for top 20% students of Class 12 board exams pursuing higher education.",
    description:
      "The Central Sector Scheme of Scholarships targets students from families with annual income below ₹8 lakh who score in the top 20 percentile in their Class 12 board examination. The scholarship supports students pursuing regular courses at degree and postgraduate level and is disbursed through the National Scholarship Portal.",
    category: "education",
    level: "central",
    states: ["all-india"],
    eligibility: [
      { label: "Academic score", value: "Top 20 percentile in Class 12 board exam", type: "education" },
      { label: "Annual family income", value: "Below ₹8,00,000", type: "income" },
      { label: "Course", value: "Regular degree / postgraduate course — not correspondence or distance", type: "education" },
    ],
    benefits: [
      "₹10,000 per year for undergraduate students",
      "₹20,000 per year for postgraduate students",
      "Paid directly into student's bank account via DBT",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Class 12 marksheet", mandatory: true },
      { name: "Income certificate (below ₹8 lakh)", mandatory: true },
      { name: "Bank account details (student's own account)", mandatory: true },
      { name: "College / university admission proof", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "Ministry of Education",
    applicationMode: ["online"],
    tags: ["scholarship", "merit", "undergraduate", "postgraduate", "income", "NSP"],
    faqs: [
      {
        q: "When does the application window open?",
        a: "Applications typically open in August–September each year on scholarships.gov.in.",
      },
      {
        q: "Can I apply if I scored in the top 20 percentile in my state but not nationally?",
        a: "Yes — eligibility is determined by the top 20 percentile of your respective state board, not a national rank.",
      },
    ],
    source: "sample",
  },

  /* ------------------- post matric scholarship SC -------------------------- */
  {
    id: "pms-sc",
    slug: "post-matric-scholarship-sc-students",
    name: "Post Matric Scholarship for Scheduled Caste Students",
    shortName: "PMS-SC",
    summary:
      "Scholarship covering tuition, maintenance allowance, and other charges for SC students studying at post-matriculation level.",
    description:
      "PMS-SC is a central government scheme administered by the Ministry of Social Justice and Empowerment. It covers course fees, maintenance allowance, book allowance, and other study charges for SC students pursuing post-matric courses (Class 11 onwards up to PhD).",
    category: "education",
    level: "central-state",
    states: ["all-india"],
    eligibility: [
      { label: "Social category", value: "Scheduled Caste (SC)", type: "caste-category" },
      { label: "Annual family income", value: "Below ₹2,50,000", type: "income" },
      { label: "Course level", value: "Class 11 and above — including graduation, PG, and PhD", type: "education" },
      { label: "Institution", value: "Must be a government-recognised institution", type: "other" },
    ],
    benefits: [
      "Maintenance allowance (varies by course level and hosteller / day-scholar status)",
      "Course / tuition fee reimbursement",
      "Book allowance and study charges",
      "Additional allowances for thesis typing, study tours, etc.",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "SC certificate issued by competent authority", mandatory: true },
      { name: "Income certificate (below ₹2.5 lakh)", mandatory: true },
      { name: "Previous year marksheet", mandatory: true },
      { name: "Bank account details", mandatory: true },
      { name: "Bonafide certificate from institution", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "Ministry of Social Justice and Empowerment",
    applicationMode: ["online"],
    tags: ["scholarship", "SC", "scheduled caste", "post matric", "fees", "NSP"],
    faqs: [
      {
        q: "Does this cover engineering and medical courses?",
        a: "Yes — the scheme covers professional courses including engineering, medical, law, and management, often with higher benefit amounts.",
      },
      {
        q: "Is there an income limit?",
        a: "The parental income ceiling is ₹2,50,000 per year for most states. Some states have higher limits — check your state scholarship portal.",
      },
    ],
    source: "sample",
  },

  /* ------------------- post matric scholarship ST -------------------------- */
  {
    id: "pms-st",
    slug: "post-matric-scholarship-st-students",
    name: "Post Matric Scholarship for Scheduled Tribe Students",
    shortName: "PMS-ST",
    summary:
      "Full scholarship covering fees and maintenance for ST students in post-matriculation courses, funded by the Ministry of Tribal Affairs.",
    description:
      "PMS-ST is the central scheme for Scheduled Tribe students pursuing any post-matric level course (Class 11 onwards). It reimburses tuition fees and provides a maintenance allowance. The scheme is funded by the Ministry of Tribal Affairs and implemented through state governments.",
    category: "education",
    level: "central-state",
    states: ["all-india"],
    eligibility: [
      { label: "Social category", value: "Scheduled Tribe (ST)", type: "caste-category" },
      { label: "Annual family income", value: "Below ₹2,50,000", type: "income" },
      { label: "Course level", value: "Class 11 and above — all post-matric courses", type: "education" },
    ],
    benefits: [
      "Full tuition fee reimbursement",
      "Maintenance allowance based on course type and day-scholar / hosteller status",
      "Book and stationery allowance",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "ST certificate from competent authority", mandatory: true },
      { name: "Income certificate (below ₹2.5 lakh)", mandatory: true },
      { name: "Previous exam marksheet", mandatory: true },
      { name: "Bank account details", mandatory: true },
      { name: "Bonafide certificate from institution", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "Ministry of Tribal Affairs",
    applicationMode: ["online"],
    tags: ["scholarship", "ST", "scheduled tribe", "tribal", "post matric", "fees", "NSP"],
    faqs: [
      {
        q: "Can I apply if I study in a private college?",
        a: "Yes, as long as the institution is recognised by the government or a university.",
      },
    ],
    source: "sample",
  },

  /* ---------------------- AICTE Pragati ------------------------------------ */
  {
    id: "aicte-pragati",
    slug: "aicte-pragati-scholarship-girl-students",
    name: "AICTE Pragati Scholarship for Girl Students",
    shortName: "AICTE Pragati",
    summary:
      "₹50,000 per year scholarship for girl students admitted to AICTE-approved degree or diploma technical courses.",
    description:
      "AICTE Pragati is a scholarship for girl students pursuing degree or diploma courses in AICTE-approved technical institutions. Up to 4,000 scholarships are awarded each year. The scheme aims to promote technical education among women and reduce the dropout rate due to financial constraints.",
    category: "education",
    level: "central",
    states: ["all-india"],
    eligibility: [
      { label: "Gender", value: "Girl student (female)", type: "gender" },
      { label: "Course", value: "First year of AICTE-approved degree or diploma technical programme", type: "education" },
      { label: "Annual family income", value: "Below ₹8,00,000", type: "income" },
      { label: "Restriction", value: "One scholarship per family", type: "other" },
    ],
    benefits: [
      "₹50,000 per year for up to 4 years (degree) or 3 years (diploma)",
      "Covers tuition fee, books, equipment, software, laptop costs",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Class 12 or 10 marksheet (as applicable)", mandatory: true },
      { name: "Income certificate (below ₹8 lakh)", mandatory: true },
      { name: "Bank account details (student's own)", mandatory: true },
      { name: "AICTE institution admission proof", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "All India Council for Technical Education (AICTE)",
    applicationMode: ["online"],
    tags: ["scholarship", "girl", "women", "engineering", "technical", "AICTE", "Pragati", "diploma"],
    faqs: [
      {
        q: "Does Pragati cover MBA and MCA courses?",
        a: "Yes — MBA and MCA at AICTE-approved institutions are covered under Pragati.",
      },
      {
        q: "Can a family apply for both Pragati and Saksham?",
        a: "A family can only receive one Pragati scholarship. Saksham (for differently-abled students) is a separate scheme and can be applied independently.",
      },
    ],
    source: "sample",
  },

  /* ---------------------- AICTE Saksham ------------------------------------ */
  {
    id: "aicte-saksham",
    slug: "aicte-saksham-scholarship-differently-abled",
    name: "AICTE Saksham Scholarship for Differently Abled Students",
    shortName: "AICTE Saksham",
    summary:
      "₹50,000 per year scholarship for students with disabilities (≥40% disability) enrolled in AICTE-approved technical programmes.",
    description:
      "AICTE Saksham provides financial support to differently-abled students in AICTE-approved technical institutions. A student must have at least 40% disability certified by a government-recognised medical authority. The scholarship covers tuition fees, books, equipment, and other education-related costs.",
    category: "education",
    level: "central",
    states: ["all-india"],
    eligibility: [
      { label: "Disability", value: "Minimum 40% disability, certified by competent medical authority", type: "other" },
      { label: "Course", value: "First year of AICTE-approved degree or diploma technical programme", type: "education" },
      { label: "Annual family income", value: "Below ₹8,00,000", type: "income" },
    ],
    benefits: [
      "₹50,000 per year for the duration of the course",
      "Covers tuition fee, books, equipment, software, and laptop",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Disability certificate (≥40%) from recognised medical board", mandatory: true },
      { name: "Income certificate (below ₹8 lakh)", mandatory: true },
      { name: "AICTE institution admission proof", mandatory: true },
      { name: "Bank account details", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "All India Council for Technical Education (AICTE)",
    applicationMode: ["online"],
    tags: ["scholarship", "disability", "differently abled", "divyang", "AICTE", "Saksham", "technical"],
    faqs: [
      {
        q: "What types of disability are covered?",
        a: "Visual impairment, hearing impairment, locomotor disability, and other conditions with at least 40% permanent disability as certified by a government medical authority.",
      },
    ],
    source: "sample",
  },

  /* --------------- National Fellowship for SC Students (PhD) --------------- */
  {
    id: "nfsc",
    slug: "national-fellowship-sc-students",
    name: "National Fellowship for Scheduled Caste Students",
    shortName: "NFSC",
    summary:
      "UGC fellowship of ₹31,000–₹35,000 per month for SC students pursuing MPhil and PhD programmes.",
    description:
      "The National Fellowship for SC Students is administered by the University Grants Commission (UGC) on behalf of the Ministry of Social Justice and Empowerment. It provides financial support to SC students pursuing full-time MPhil and PhD programmes at universities and institutions recognised by UGC. Up to 2,000 fellowships are awarded each year.",
    category: "education",
    level: "central",
    states: ["all-india"],
    eligibility: [
      { label: "Social category", value: "Scheduled Caste (SC)", type: "caste-category" },
      { label: "Course", value: "Full-time MPhil or PhD at a UGC-recognised institution", type: "education" },
      { label: "Age", value: "Below 35 years at the time of application", type: "age" },
      { label: "Annual family income", value: "No income limit", type: "income" },
    ],
    benefits: [
      "₹31,000 per month for JRF (first 2 years)",
      "₹35,000 per month for SRF (from 3rd year onwards)",
      "Contingency grant of ₹10,000 per year (Humanities/Social Sciences) or ₹12,000 per year (Sciences)",
      "HRA as per institution norms",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "SC certificate from competent authority", mandatory: true },
      { name: "Admission letter from UGC-recognised university for MPhil / PhD", mandatory: true },
      { name: "NET / SET / GATE score card (if applicable)", mandatory: false },
      { name: "Bank account details", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "University Grants Commission (UGC) / Ministry of Social Justice and Empowerment",
    applicationMode: ["online"],
    tags: ["fellowship", "PhD", "MPhil", "SC", "research", "UGC", "JRF", "SRF"],
    faqs: [
      {
        q: "Do I need to qualify NET or GATE to apply?",
        a: "No — NET/GATE qualification is not mandatory for NFSC. Admission to an MPhil/PhD programme at a UGC-recognised institution is sufficient.",
      },
      {
        q: "Can I hold this fellowship and another fellowship at the same time?",
        a: "No — a student cannot hold NFSC along with any other UGC fellowship or scholarship simultaneously.",
      },
    ],
    source: "sample",
  },

  /* -------------- Begum Hazrat Mahal Scholarship (Minority Girls) ---------- */
  {
    id: "bhm-scholarship",
    slug: "begum-hazrat-mahal-national-scholarship",
    name: "Begum Hazrat Mahal National Scholarship for Minorities",
    shortName: "BHM Scholarship",
    summary:
      "Scholarship of ₹5,000–₹6,000 per year for meritorious girl students from minority communities in Class 9–12.",
    description:
      "The Begum Hazrat Mahal National Scholarship is for meritorious girl students from minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi/Zoroastrian) studying in Class 9 to 12. The scheme is run by the Maulana Azad Education Foundation under the Ministry of Minority Affairs.",
    category: "education",
    level: "central",
    states: ["all-india"],
    eligibility: [
      { label: "Gender", value: "Girl student", type: "gender" },
      { label: "Minority community", value: "Muslim, Christian, Sikh, Buddhist, Jain, or Parsi/Zoroastrian", type: "caste-category" },
      { label: "Class", value: "Class 9, 10, 11, or 12", type: "education" },
      { label: "Academic score", value: "Minimum 50% marks in previous class", type: "education" },
      { label: "Annual family income", value: "Below ₹2,00,000", type: "income" },
    ],
    benefits: [
      "₹5,000 per year for Class 9 and 10 students",
      "₹6,000 per year for Class 11 and 12 students",
      "Paid directly into the student's or guardian's bank account",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Community / minority certificate from competent authority", mandatory: true },
      { name: "Income certificate (below ₹2 lakh)", mandatory: true },
      { name: "Previous year marksheet (minimum 50%)", mandatory: true },
      { name: "Bank account details", mandatory: true },
      { name: "School bonafide certificate", mandatory: true },
    ],
    officialPortalUrl: "https://maef.nic.in",
    ministry: "Maulana Azad Education Foundation / Ministry of Minority Affairs",
    applicationMode: ["online"],
    tags: ["scholarship", "minority", "girl", "Muslim", "Christian", "Sikh", "Class 9", "Class 10", "Class 11", "Class 12"],
    faqs: [
      {
        q: "Can a student apply from a private school?",
        a: "Yes — the school must be recognised by the State / Union Territory government. Private recognised schools are eligible.",
      },
      {
        q: "Is there a renewal process?",
        a: "Yes — students must re-apply each year and maintain a minimum attendance and academic performance as specified.",
      },
    ],
    source: "sample",
  },

  /* ------------------- Pradhan Mantri Vidya Lakshmi ------------------------ */
  {
    id: "pm-vidya-lakshmi",
    slug: "pradhan-mantri-vidya-lakshmi",
    name: "Pradhan Mantri Vidya Lakshmi Karyakram",
    shortName: "Vidya Lakshmi",
    summary:
      "Single-window portal to apply for education loans and scholarship from multiple banks and government schemes, with interest subsidy for economically weaker section students.",
    description:
      "The Pradhan Mantri Vidya Lakshmi Karyakram is a single-window portal where students can apply for education loans from 38+ banks and government scholarship schemes. Students from the Economically Weaker Section (EWS) get full interest subsidy during the moratorium period. The Central Scheme of Interest Subsidy (CSIS) waives interest during the study period + 12 months or 6 months after getting a job, whichever is earlier.",
    category: "education",
    level: "central",
    states: ["all-india"],
    eligibility: [
      { label: "Course", value: "Professional / technical courses at recognised institutions in India", type: "education" },
      { label: "Interest subsidy eligibility", value: "Annual family income below ₹4,50,000 (EWS)", type: "income" },
      { label: "Loan amount", value: "Up to ₹7.5 lakh without collateral; higher amounts require collateral", type: "other" },
    ],
    benefits: [
      "Access to education loans from 38+ banks through one portal",
      "Full interest subsidy during study + 12 months moratorium (for EWS students)",
      "Collateral-free loans up to ₹7.5 lakh",
      "Can also apply for scholarship schemes through the same portal",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Admission letter from institution", mandatory: true },
      { name: "Income certificate (for interest subsidy)", mandatory: true },
      { name: "Previous year marksheet", mandatory: true },
      { name: "Passport-size photograph", mandatory: true },
      { name: "Co-applicant (parent / guardian) documents", mandatory: true },
    ],
    officialPortalUrl: "https://www.vidyalakshmi.co.in",
    ministry: "Ministry of Finance / Ministry of Education / Ministry of HRD",
    applicationMode: ["online"],
    tags: ["education loan", "student loan", "interest subsidy", "EWS", "Vidya Lakshmi", "bank loan", "fees"],
    faqs: [
      {
        q: "How many banks are available on the Vidya Lakshmi portal?",
        a: "Currently 38+ scheduled banks are registered on the portal. You can compare loan offers and apply to multiple banks with a single application form.",
      },
      {
        q: "What is the interest rate for education loans?",
        a: "Interest rates vary by bank, typically between 8.5% and 15% per annum. EWS students receive full interest subsidy during the moratorium period under the CSIS scheme.",
      },
    ],
    source: "sample",
  },

  /* ------------------- Ishan Uday (NE Region) ------------------------------ */
  {
    id: "ishan-uday",
    slug: "ishan-uday-special-scholarship-northeast",
    name: "Ishan Uday — Special Scholarship Scheme for North Eastern Region",
    shortName: "Ishan Uday",
    summary:
      "₹5,400–₹7,800 per month scholarship for students from North-East states pursuing undergraduate and professional courses outside their home state.",
    description:
      "Ishan Uday provides scholarships to students from the 8 North-Eastern states (Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, Sikkim) who pursue general and professional degree courses at recognised institutions outside the NE region. The scheme is implemented through the University Grants Commission (UGC).",
    category: "education",
    level: "central",
    states: ["assam"],
    eligibility: [
      { label: "State of domicile", value: "Any of the 8 North-Eastern states", type: "residence" },
      { label: "Course", value: "Regular undergraduate or professional degree course", type: "education" },
      { label: "Institution", value: "Any recognised college / university (preferably outside NE region)", type: "other" },
      { label: "Annual family income", value: "Below ₹4,50,000", type: "income" },
    ],
    benefits: [
      "₹5,400 per month for general degree courses",
      "₹7,800 per month for technical / professional / medical courses",
      "Paid for up to 10 months per year",
    ],
    requiredDocuments: [
      { name: "Aadhaar Card", mandatory: true },
      { name: "Domicile / residence certificate from NE state", mandatory: true },
      { name: "Income certificate (below ₹4.5 lakh)", mandatory: true },
      { name: "Class 12 marksheet", mandatory: true },
      { name: "Admission proof at institution", mandatory: true },
      { name: "Bank account details", mandatory: true },
    ],
    officialPortalUrl: "https://scholarships.gov.in",
    ministry: "University Grants Commission (UGC)",
    applicationMode: ["online"],
    tags: ["scholarship", "northeast", "NE", "Assam", "Manipur", "Ishan Uday", "UGC", "undergraduate"],
    faqs: [
      {
        q: "Do I have to study outside the NE region to be eligible?",
        a: "Preference is given to students studying outside the NE region, but students studying within NE are also eligible in some cases. Check current UGC guidelines.",
      },
    ],
    source: "sample",
  },
];
