/** Single source of truth for site-wide constants (brand, nav, links). */

export const SITE = {
  name: "CheckMyEligibility",
  shortName: "CheckMyEligibility",
  url: "https://checkmyeligibility.in",
  tagline: "Find what you're entitled to.",
  description:
    "CheckMyEligibility is a free AI assistant that helps Indian students discover scholarships, fellowships, education loans, and grants they are eligible for. Describe your situation in plain language and find out what you qualify for, the documents you need, and exactly where to apply — on official portals.",
  locale: "en-IN",
  email: "hello@checkmyeligibility.in",
  github: "https://github.com/anandsundaramoorthysa/checkmyeligibility",
  license: "MIT",
  institution: "Dept. of Data Science, Loyola College, Chennai",
  // Independence disclaimer shown in footer + chat (legal/trust safety).
  disclaimer:
    "CheckMyEligibility is an independent guide and is not affiliated with, endorsed by, or operated by any government body. We help you find schemes and direct you to official portals — we never submit applications on your behalf.",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

// Header nav order. The "Check my eligibility" CTA sits separately on the right.
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Explore", href: "/explore" },
  { label: "Certificates", href: "/certificates" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Explore schemes", href: "/explore" },
      { label: "Certificates", href: "/certificates" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Ask the bot", href: "/chat" },
    ],
  },
  {
    title: "Project",
    items: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "GitHub", href: "https://github.com/anandsundaramoorthysa/checkmyeligibility" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
