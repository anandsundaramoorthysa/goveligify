/**
 * Domain + chat contracts. These are the spine of the data seam: Phase-1 data
 * lives in src/data as typed objects; Phase-2 swaps in a real pipeline/API that
 * conforms to these same interfaces, so UI and bot code never change.
 */

/* ----------------------------- taxonomy ----------------------------------- */

export type SchemeCategory =
  | "agriculture"
  | "education"
  | "health"
  | "employment"
  | "housing"
  | "women-child"
  | "senior-citizen"
  | "disability"
  | "finance-credit"
  | "social-welfare"
  | "skill-development";

export type LevelOfGovernment = "central" | "state" | "central-state";

/** "all-india" denotes a central scheme available nationwide. */
export type IndianState =
  | "all-india"
  | "andhra-pradesh"
  | "assam"
  | "bihar"
  | "delhi"
  | "gujarat"
  | "karnataka"
  | "kerala"
  | "madhya-pradesh"
  | "maharashtra"
  | "odisha"
  | "punjab"
  | "rajasthan"
  | "tamil-nadu"
  | "telangana"
  | "uttar-pradesh"
  | "west-bengal";

/* ----------------------------- schemes ------------------------------------ */

export interface EligibilityCriterion {
  label: string; // "Annual family income"
  value: string; // "below ₹2,50,000"
  type:
    | "income"
    | "age"
    | "gender"
    | "occupation"
    | "residence"
    | "caste-category"
    | "land-holding"
    | "education"
    | "other";
}

export interface RequiredDocument {
  name: string; // "Aadhaar Card"
  mandatory: boolean;
  note?: string;
}

export interface Scheme {
  id: string; // stable key (future pipeline primary key)
  slug: string; // url segment
  name: string;
  shortName?: string; // "PM-KISAN"
  summary: string; // 1-2 lines — cards + meta description
  description: string;
  category: SchemeCategory;
  level: LevelOfGovernment;
  states: IndianState[]; // ["all-india"] for central
  eligibility: EligibilityCriterion[];
  benefits: string[];
  requiredDocuments: RequiredDocument[];
  officialPortalUrl: string; // canonical .gov.in link (outbound)
  ministry?: string;
  applicationMode?: ("online" | "offline" | "csc")[];
  tags?: string[];
  faqs?: { q: string; a: string }[];
  /** Provenance — present for pipeline-sourced records, omitted for samples. */
  lastVerified?: string; // ISO date
  source?: "myscheme" | "data.gov.in" | "state-portal" | "sample";
}

/* --------------------------- certificates --------------------------------- */

export interface Certificate {
  id: string;
  slug: string;
  name: string; // "Income Certificate"
  summary: string;
  description: string;
  category: SchemeCategory;
  issuingAuthority: string; // "Revenue Department / Tahsildar"
  level: LevelOfGovernment;
  states: IndianState[];
  eligibility: EligibilityCriterion[];
  purpose: string[]; // "scholarship applications", "fee concessions"
  requiredDocuments: RequiredDocument[];
  applicationSteps: string[];
  officialPortalUrl: string;
  processingTime?: string; // "7-15 working days"
  fees?: string; // "₹60" | "Free"
  validityPeriod?: string;
  faqs?: { q: string; a: string }[];
  lastVerified?: string;
  source?: "state-portal" | "sample";
}

/* ------------------------------- chat ------------------------------------- */

export type LangCode =
  | "en"
  | "ta"
  | "hi"
  | "ml"
  | "kn"
  | "te"
  | "mr"
  | "ur"
  | "sa"
  | "bn";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: LangCode;
  createdAt: number;
  error?: boolean;
  replyTo?: string;
  /** Scheme result cards attached to an assistant turn (rich results). */
  schemeResults?: Scheme[];
}

export interface QuickReply {
  label: string;
  /** Text sent as the user's next message when the chip is clicked. */
  send: string;
}

/** One bot turn produced by a ChatEngine (mock now, real API later). */
export interface BotTurn {
  messages: Pick<Message, "content">[];
  schemeResults?: Scheme[];
  quickReplies?: QuickReply[];
}
