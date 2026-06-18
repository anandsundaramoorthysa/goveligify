import { CheckCircle2, ExternalLink, FileText, Gift } from "lucide-react";
import type { Scheme } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";

const LEVEL_LABEL: Record<Scheme["level"], string> = {
  central: "Central scheme",
  state: "State scheme",
  "central-state": "Central + State",
};

/** The hero result card: a compact summary of one matched scheme. */
export function SchemeResultCard({ scheme }: { scheme: Scheme }) {
  const eligibility = scheme.eligibility.slice(0, 3);
  const benefits = scheme.benefits.slice(0, 3);
  const documents = scheme.requiredDocuments.slice(0, 4);

  return (
    <article className="overflow-hidden rounded-2xl border border-navy/10 border-l-[3px] border-l-green bg-surface-card shadow-card">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-tight text-navy-deep">
              {scheme.shortName ?? scheme.name}
            </h3>
            {scheme.shortName && (
              <p className="mt-0.5 text-xs text-ink-muted">{scheme.name}</p>
            )}
          </div>
          <Badge tone="navy" className="shrink-0">
            {LEVEL_LABEL[scheme.level]}
          </Badge>
        </div>

        <p className="text-xs leading-relaxed text-ink-muted">{scheme.summary}</p>

        {eligibility.length > 0 && (
          <Section icon={<CheckCircle2 size={14} className="text-green-deep" />} title="Eligibility">
            {eligibility.map((c, i) => (
              <li key={i}>
                <span className="font-medium text-ink">{c.label}:</span> {c.value}
              </li>
            ))}
          </Section>
        )}

        {benefits.length > 0 && (
          <Section icon={<Gift size={14} className="text-saffron-deep" />} title="Benefits">
            {benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </Section>
        )}

        {documents.length > 0 && (
          <Section icon={<FileText size={14} className="text-navy" />} title="Documents">
            {documents.map((d, i) => (
              <li key={i}>{d.name}</li>
            ))}
          </Section>
        )}

        <a
          href={scheme.officialPortalUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={buttonClasses({ variant: "saffron", size: "sm", className: "w-full" })}
        >
          Apply on official portal
          <ExternalLink size={14} aria-hidden="true" />
        </a>

        <p className="text-[11px] leading-snug text-ink-faint">
          GovEligify guides you; the application happens on the official site.
        </p>
      </div>
    </article>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink">
        <span aria-hidden="true">{icon}</span>
        {title}
      </p>
      <ul className="ml-1 list-inside list-disc space-y-0.5 text-xs leading-relaxed text-ink-muted">
        {children}
      </ul>
    </div>
  );
}
