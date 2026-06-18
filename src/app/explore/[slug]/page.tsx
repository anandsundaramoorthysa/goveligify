import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Gift,
  FileText,
  ExternalLink,
  Building2,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Faq } from "@/components/marketing/Faq";
import { AskBotCta } from "@/components/marketing/AskBotCta";
import { SpotIllustration } from "@/components/illustrations/SpotIllustration";
import { getCategoryArt } from "@/components/illustrations/registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  governmentServiceLd,
  breadcrumbLd,
  faqPageLd,
} from "@/lib/seo/jsonld";
import { levelLabel, statesHint } from "@/lib/labels";
import { getSchemeBySlug } from "@/lib/data";
import { getCategory } from "@/data/categories";
import { SCHEMES } from "@/data/schemes";

export function generateStaticParams() {
  return SCHEMES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const scheme = await getSchemeBySlug(params.slug);
  if (!scheme) return buildMetadata({ title: "Scheme not found", noindex: true });
  return buildMetadata({
    title: scheme.name,
    description: scheme.summary,
    path: `/explore/${scheme.slug}`,
  });
}

export default async function SchemeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const scheme = await getSchemeBySlug(params.slug);
  if (!scheme) notFound();

  const category = getCategory(scheme.category);
  const art = getCategoryArt(scheme.category);

  const ld: object[] = [
    governmentServiceLd(scheme),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Explore", path: "/explore" },
      { name: scheme.name, path: `/explore/${scheme.slug}` },
    ]),
  ];
  if (scheme.faqs?.length) ld.push(faqPageLd(scheme.faqs));

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
                  <Link href="/explore" className="hover:text-navy">
                    Explore
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />
                <li className="font-medium text-ink" aria-current="page">
                  {scheme.shortName ?? scheme.name}
                </li>
              </ol>
            </nav>

            <div className="mt-6 grid items-start gap-8 sm:grid-cols-[1fr_auto] sm:gap-10">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="navy">{levelLabel(scheme.level)}</Badge>
                  {category && <Badge tone="saffron">{category.title}</Badge>}
                  {scheme.shortName && <Badge tone="neutral">{scheme.shortName}</Badge>}
                </div>

                <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                  {scheme.name}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
                  {scheme.summary}
                </p>

                <div className="mt-7">
                  <a
                    href={scheme.officialPortalUrl}
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
                icon={art.Icon}
                tone={art.tone}
                label={category ? category.title : scheme.name}
                className="hidden w-28 sm:block lg:w-36"
              />
            </div>
          </Container>
        </header>

        <Container className="grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="font-display text-2xl font-bold text-ink">
                About this scheme
              </h2>
              <p className="mt-3 text-pretty text-ink-muted">{scheme.description}</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink">Eligibility</h2>
              <ul className="mt-4 space-y-3">
                {scheme.eligibility.map((c) => (
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
              <h2 className="font-display text-2xl font-bold text-ink">Benefits</h2>
              <ul className="mt-4 space-y-3">
                {scheme.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Gift
                      className="mt-0.5 h-5 w-5 shrink-0 text-saffron-deep"
                      aria-hidden="true"
                    />
                    <span className="text-ink">{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-ink">
                Required documents
              </h2>
              <ul className="mt-4 space-y-3">
                {scheme.requiredDocuments.map((d) => (
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

            {scheme.faqs?.length ? (
              <section>
                <h2 className="font-display text-2xl font-bold text-ink">
                  Frequently asked
                </h2>
                <div className="mt-4">
                  <Faq items={scheme.faqs} />
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
                  {scheme.ministry && (
                    <div className="flex items-start gap-3">
                      <Building2
                        className="mt-0.5 h-5 w-5 shrink-0 text-navy"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-ink-faint">Ministry</dt>
                        <dd className="font-medium text-ink">{scheme.ministry}</dd>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 h-5 w-5 shrink-0 text-navy"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-ink-faint">Coverage</dt>
                      <dd className="font-medium text-ink">
                        {statesHint(scheme.states)}
                      </dd>
                    </div>
                  </div>
                </dl>
                <a
                  href={scheme.officialPortalUrl}
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
                  You apply directly on the government portal. GovEligify never
                  submits applications for you.
                </p>
              </div>
            </div>
          </aside>
        </Container>

        <Container className="pb-16">
          <AskBotCta
            title="Looking for more schemes like this?"
            body="Tell the assistant about your situation and discover everything else you may qualify for."
            seed={`Schemes similar to ${scheme.name}`}
          />
        </Container>
      </article>
    </>
  );
}
