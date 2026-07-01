import type { BotTurn, QuickReply, Scheme } from "@/lib/types";
import { searchSchemes } from "@/lib/data";
import { SITE } from "@/lib/site";
import type { ChatEngine } from "./engine";

/**
 * Local, deterministic mock chat engine. No LLM, no network. Recognises
 * student-focused intents by keyword, pulls relevant sample schemes via
 * `searchSchemes`, and replies in plain language. Phase-2 replaces the
 * internals with a real FastAPI + RAG backend behind the same `ChatEngine`
 * interface.
 */

const MAX_RESULTS = 3;

const STARTER_REPLIES: QuickReply[] = [
  { label: "I need a scholarship", send: "I'm a student looking for a scholarship" },
  { label: "I'm in SC/ST category", send: "I'm an SC/ST student looking for education support" },
  { label: "I need an education loan", send: "I need an education loan for my studies" },
  { label: "I'm doing a PhD", send: "I'm a PhD student looking for a fellowship or research grant" },
];

const OFFER = "Would you like me to help with anything else?";

interface Intent {
  keywords: string[];
  reply: string;
  query: string;
  quickReplies?: QuickReply[];
}

const INTENTS: Intent[] = [
  {
    keywords: ["scholarship", "merit", "financial aid", "financial support", "stipend", "award", "bursary"],
    reply:
      "There are several scholarships for students based on merit, income, and category. Here are some that may match your situation:",
    query: "student scholarship merit income education",
    quickReplies: [
      { label: "I'm SC/ST category", send: "I'm an SC/ST student looking for a scholarship" },
      { label: "I'm a girl student", send: "I'm a girl student — are there scholarships for me?" },
      { label: "I need an education loan", send: "I need an education loan to pay my fees" },
    ],
  },
  {
    keywords: ["sc", "st", "scheduled caste", "scheduled tribe", "dalit", "tribal", "obc", "backward class"],
    reply:
      "There are dedicated scholarships and fellowships for SC, ST, and OBC students at every level. These may be relevant:",
    query: "SC ST OBC scholarship post matric fellowship reserved",
    quickReplies: [
      { label: "Post-matric scholarship", send: "Tell me about post matric scholarship for SC students" },
      { label: "PhD fellowship", send: "I'm an SC student doing a PhD — what fellowship can I get?" },
      { label: "Other scholarships", send: "What other scholarships exist for SC ST students?" },
    ],
  },
  {
    keywords: ["minority", "muslim", "christian", "sikh", "buddhist", "parsi", "jain", "maulana azad"],
    reply:
      "Minority community students have access to dedicated scholarships from the Ministry of Minority Affairs. Here are the relevant ones:",
    query: "minority scholarship pre matric post matric merit",
    quickReplies: [
      { label: "Pre-matric", send: "Minority scholarship for class 9 and 10" },
      { label: "Post-matric", send: "Minority scholarship for college students" },
    ],
  },
  {
    keywords: ["girl", "women", "female", "woman student", "girls education", "beti"],
    reply:
      "There are scholarships specifically for girl students and women in higher and technical education. These look relevant:",
    query: "girl women scholarship technical education female student",
    quickReplies: [
      { label: "Engineering / AICTE", send: "Scholarship for girl students in engineering" },
      { label: "General scholarship", send: "General scholarship for girl students" },
    ],
  },
  {
    keywords: ["education loan", "study loan", "loan for studies", "vidya lakshmi", "fee loan", "pay fees"],
    reply:
      "The government offers education loan guarantee schemes that make bank loans accessible for higher education. Here is what may help:",
    query: "education loan student vidya lakshmi bank guarantee",
    quickReplies: [
      { label: "Documents needed", send: "What documents do I need for an education loan?" },
      { label: "Loan limit", send: "How much education loan can I get?" },
    ],
  },
  {
    keywords: ["phd", "mphil", "research", "fellowship", "jrf", "srf", "junior research", "senior research", "ugc fellowship", "csir", "dst"],
    reply:
      "Research scholars and PhD students can access national fellowships from UGC, CSIR, and DST. These are the main options:",
    query: "PhD research fellowship JRF SRF UGC national",
    quickReplies: [
      { label: "UGC fellowship", send: "UGC fellowship for PhD students" },
      { label: "CSIR JRF", send: "CSIR junior research fellowship for science students" },
      { label: "SC PhD fellowship", send: "National fellowship for SC PhD students" },
    ],
  },
  {
    keywords: ["disability", "disabled", "differently abled", "divyang", "saksham", "handicap", "wheelchair", "visually impaired"],
    reply:
      "There are dedicated scholarships and schemes for students with disabilities. Here is what may apply:",
    query: "disability scholarship differently abled student saksham",
    quickReplies: [
      { label: "AICTE Saksham", send: "AICTE Saksham scholarship for disabled students in technical courses" },
      { label: "Other schemes", send: "Other disability scholarships for students" },
    ],
  },
  {
    keywords: ["engineering", "medical", "aicte", "polytechnic", "technical", "diploma", "b.tech", "mbbs", "btech"],
    reply:
      "AICTE has dedicated scholarships for students in technical and professional courses. These look relevant:",
    query: "AICTE technical engineering scholarship merit student",
    quickReplies: [
      { label: "Girl student", send: "Scholarship for girl students in engineering (Pragati)" },
      { label: "Disabled student", send: "Scholarship for disabled students in technical courses (Saksham)" },
    ],
  },
  {
    keywords: ["northeast", "north east", "assam", "manipur", "meghalaya", "tripura", "mizoram", "nagaland", "ishan uday", "hill area", "tribal area"],
    reply:
      "Students from North-East states and hill areas have access to the Ishan Uday scholarship for higher education. Here is more:",
    query: "Ishan Uday northeast scholarship hill area higher education",
    quickReplies: [
      { label: "Ishan Uday details", send: "Tell me more about Ishan Uday scholarship" },
      { label: "Other scholarships", send: "What other scholarships are available for NE students?" },
    ],
  },
  {
    keywords: ["postgraduate", "pg", "masters", "mtech", "mba", "msc", "ma ", "post graduation"],
    reply:
      "Postgraduate students can access merit-based scholarships and fellowships for continued education. Here are some options:",
    query: "postgraduate scholarship PG masters fellowship merit",
    quickReplies: [
      { label: "Fellowship options", send: "Fellowship for postgraduate students" },
      { label: "SC/ST PG support", send: "Scholarship for SC ST postgraduate students" },
    ],
  },
];

function lookup(query: string): Scheme[] {
  return searchSchemes(query).slice(0, MAX_RESULTS);
}

function intentTurn(intent: Intent): BotTurn {
  const schemes = lookup(intent.query);
  const lead = schemes.length
    ? intent.reply
    : "I understand. I don't have a matching sample scheme on hand just yet, but here are some starting points.";
  return {
    messages: [{ content: `${lead}\n\n${OFFER}` }],
    schemeResults: schemes.length ? schemes : undefined,
    quickReplies: intent.quickReplies ?? STARTER_REPLIES,
  };
}

function fallbackTurn(): BotTurn {
  return {
    messages: [
      {
        content:
          "I'm here to help you find scholarships, fellowships, education loans, and grants. Tell me a bit about yourself — your course level, state, social category, or what kind of support you're looking for — and I'll find what you may be eligible for.\n\n" +
          "You can also tap one of the options below to get started. " +
          OFFER,
      },
    ],
    quickReplies: STARTER_REPLIES,
  };
}

export const mockEngine: ChatEngine = {
  greeting(): BotTurn {
    return {
      messages: [
        {
          content:
            `Hello, I'm the **${SITE.name} Assistant**. I help Indian students discover government scholarships, fellowships, education loans, and grants they are eligible for.\n\n` +
            "Tell me about yourself — your course, year, state, social category, or what kind of support you need — and I'll help you find what you may be entitled to, the documents required, and where to apply.\n\n" +
            "A quick note: CheckMyEligibility is an independent guide, **not affiliated with any government**, and **we never submit applications for you** — we point you to the official portal.\n\n" +
            "Who are you, or what support are you looking for today?",
        },
      ],
      quickReplies: STARTER_REPLIES,
    };
  },

  async send(input: string): Promise<BotTurn> {
    const text = input.toLowerCase().trim();
    if (!text) return fallbackTurn();

    const matched = INTENTS.find((intent) =>
      intent.keywords.some((kw) => text.includes(kw)),
    );
    if (matched) return intentTurn(matched);

    const loose = lookup(text);
    if (loose.length) {
      return {
        messages: [{ content: `Here's what I found based on what you said.\n\n${OFFER}` }],
        schemeResults: loose,
        quickReplies: STARTER_REPLIES,
      };
    }

    return fallbackTurn();
  },
};
