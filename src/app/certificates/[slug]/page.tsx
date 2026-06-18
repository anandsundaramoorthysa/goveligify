import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Target,
  FileText,
  ExternalLink,
  Building2,
  Clock,
  IndianRupee,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Faq } from "@/components/marketing/Faq";
import { AskBotCta } from "@/components/marketing/AskBotCta";
import { SpotIllustration } from "@/components/illustrations/SpotIllustration";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, faqPageLd } from "@/lib/seo/jsonld";
import { levelLabel } from "@/lib/labels";
import { getCertificateBySlug } from "@/lib/data";
import { CERTIFICATES } from "@/data/certificates";

export function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const certificate = await getCertificateBySlug(params.slug);
  if (!certificate)
    return buildMetadata({ title: "Certificate not found", noindex: true });
  return buildMetadata({
    title: certificate.name,
    description: certificate.summary,
    path: `/certificates/${certificate.slug}`,
  });
}

export default async function CertificateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const certificate = await getCertificateBySlug(params.slug);
  if (!certificate) notFound();

  const ld: object[] = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Certificates", path: "/certificates" },
      { name: certificate.name, path: `/certificates/${certificate.slug}` },
    ]),
  ];
  if (certificate.faqs?.length) ld.push(faqPageLd(certificate.faqs));

  const meta = [
    certificate.processingTime && {
      icon: Clock,
      label: "Processing time",
      value: certificate.processingTime,
    },
    certificate.fees && {
      icon: IndianRupee,
      label: "Fees",
      value: certificate.fees,
    },
    certificate.validityPeriod && {
      icon: CalendarClock,
      label: "Validity",
      value: certificate.validityPeriod,
    },
  ].filter((m): m is { icon: typeof Clock; label: string; value: string } => Boolean(m));

  return (
    <>
      <JsonLd data={ld} />

      <article>
        <header className="bg-hero-glow">
          <Container className="py-12 sm:py-16">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
                <li>
                  <Link href="/" className="hover:text-navy">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />
                <li>
                  <Link href="/certificates" className="hover:text-navy">
                    Certificates
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />
                <li className="font-medium text-ink" aria-current="page">
                  {certificate.name}
                </li>
              </ol>
            </nav>

            <div className="mt-6 grid items-start gap-8 sm:grid-cols-[1fr_auto] sm:gap-10">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="navy">{levelLabel(certificate.level)}</Badge>
                </div>

                <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                  {certificate.name}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
                  {certificate.summary}
                </p>

                <div className="mt-7">
                  <a
                    href={certificate.officialPortalUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={buttonClasses({ variant: "saffron", size: "lg" })}
                  >
                    Apply on official portal
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <SpotIllustration
                icon={FileText}
                tone="navy"
                label={certificate.name}
                className="hidden w-28 sm:block lg:w-36"
              />
            </div>
          </Container>
        </header>

        <Container className="grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="font-display text-2xl font-bold text-ink">Overview</h2>
              <p className="mt-3 text-pretty text-ink-muted">
                {certificate.description}
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink">
                What it&rsquo;s used for
              </h2>
              <ul className="mt-4 space-y-3">
                {certificate.purpose.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Target
                      className="mt-0.5 h-5 w-5 shrink-0 text-saffron-deep"
                      aria-hidden="true"
                    />
                    <span className="text-ink">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink">Who can apply</h2>
              <ul className="mt-4 space-y-3">
                {certificate.eligibility.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-green-deep"
                      aria-hidden="true"
                    />
                    <span className="text-ink">
                      <span className="font-semibold">{c.label}:</span> {c.value}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink">
                Required documents
              </h2>
              <ul className="mt-4 space-y-3">
                {certificate.requiredDocuments.map((d) => (
                  <li key={d.name} className="flex items-start gap-3">
                    <FileText
                      className="mt-0.5 h-5 w-5 shrink-0 text-navy"
                      aria-hidden="true"
                    />
                    <span className="text-ink">
                      {d.name}
                      {!d.mandatory && (
                        <span className="ml-2 text-sm text-ink-faint">(optional)</span>
                      )}
                      {d.note && (
                        <span className="block text-sm text-ink-muted">{d.note}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink">
                How to apply
              </h2>
              <ol className="mt-4 space-y-4">
                {certificate.applicationSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-mono text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-ink">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {certificate.faqs?.length ? (
              <section>
                <h2 className="font-display text-2xl font-bold text-ink">
                  Frequently asked
                </h2>
                <div className="mt-4">
                  <Faq items={certificate.faqs} />
                </div>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-navy/10 bg-surface-card p-6">
                <h2 className="font-display text-lg font-bold text-ink">At a glance</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Building2
                      className="mt-0.5 h-5 w-5 shrink-0 text-navy"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-ink-faint">Issuing authority</dt>
                      <dd className="font-medium text-ink">
                        {certificate.issuingAuthority}
                      </dd>
                    </div>
                  </div>
                  {meta.map((m) => (
                    <div key={m.label} className="flex items-start gap-3">
                      <m.icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-navy"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-ink-faint">{m.label}</dt>
                        <dd className="font-medium text-ink">{m.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <a
                  href={certificate.officialPortalUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className={buttonClasses({
                    variant: "saffron",
                    size: "md",
                    className: "mt-6 w-full",
                  })}
                >
                  Apply on official portal
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <p className="mt-3 text-xs text-ink-faint">
                  Issuance varies by state. Always confirm the exact process on your
                  state&rsquo;s official portal.
                </p>
              </div>
            </div>
          </aside>
        </Container>

        <Container className="pb-16">
          <AskBotCta
            title="Need this for a specific scheme?"
            body="Tell the assistant what you're applying for and it will map out the certificates and schemes you need."
            seed={`I need help with a ${certificate.name}`}
          />
        </Container>
      </article>
    </>
  );
}
