import type { Metadata } from "next";
import Link from "next/link";
import {
  MessagesSquare,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonClasses } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroCta } from "@/components/marketing/HeroCta";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { StepCard } from "@/components/marketing/StepCard";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { SituationDemo } from "@/components/marketing/SituationDemo";
import { StatBand } from "@/components/marketing/StatBand";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Faq } from "@/components/marketing/Faq";
import { CitizensBand } from "@/components/marketing/CitizensBand";
import { HeroArt } from "@/components/illustrations/HeroArt";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { organizationLd, websiteLd, faqPageLd } from "@/lib/seo/jsonld";
import { FAQS } from "@/data/faq";

export const metadata: Metadata = buildMetadata({ path: "/" });

const HOME_FAQS = FAQS.slice(0, 4);

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd(), faqPageLd(HOME_FAQS)]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-glow">
        <Container className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-saffron-deep">
              Government schemes, made simple
            </p>
            <h1 className="mt-5 text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Find what you&rsquo;re <span className="text-navy">entitled</span> to.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted lg:mx-0">
              Describe your situation in plain language and discover the schemes,
              subsidies, and certificates you qualify for — with the documents you
              need and exactly where to apply, on official portals.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <HeroCta
                label="Check my eligibility"
                variant="saffron"
                size="lg"
              />
              <Link
                href="/how-it-works"
                className={buttonClasses({ variant: "outline", size: "lg" })}
              >
                See how it works
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-faint">
              Free to use &middot; No login &middot; We never submit applications for you.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroArt />
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="py-12 sm:py-16">
        <Container>
          <TrustStrip />
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three simple steps to your benefits"
            lead="No paperwork to start. Just tell us about your situation and we point you the right way."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StepCard step={1} icon={MessagesSquare} tone="navy" title="Tell us about you">
              Describe your situation in plain language — your work, age, state, or
              what you&rsquo;re looking for. No forms, no jargon.
            </StepCard>
            <StepCard step={2} icon={Sparkles} tone="saffron" title="We match the schemes">
              We compare your details against scheme eligibility and surface the ones
              most likely to fit, with the documents you&rsquo;ll need.
            </StepCard>
            <StepCard step={3} icon={ExternalLink} tone="green" title="You apply, officially">
              We hand you a direct link to the genuine government portal. You apply
              there yourself — we never submit anything for you.
            </StepCard>
          </div>
        </Container>
      </section>

      {/* Category grid */}
      <section className="bg-surface-subtle py-20 sm:py-28">
        <div className="tricolor-rule mb-16 mx-auto max-w-6xl" aria-hidden="true" />
        <Container>
          <SectionHeading
            eyebrow="Explore by need"
            title="Browse schemes by category"
            lead="From farming to housing to education — find the area that fits your life."
          />
          <div className="mt-14">
            <CategoryGrid />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 font-semibold text-navy hover:text-navy-light"
            >
              See all schemes
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Situation demo — tinted full-bleed band */}
      <section className="bg-saffron-soft/50 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Try it"
            title="Describe your situation"
            lead="Type a sentence about yourself, or pick a starting point. We&rsquo;ll take it from there."
          />
          <div className="mt-12">
            <SituationDemo />
          </div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="py-20 sm:py-28">
        <Container>
          <StatBand />
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Why people use us"
            title="Benefits, finally within reach"
          />
          <div className="mt-14">
            <Testimonials />
          </div>
        </Container>
      </section>

      {/* FAQ teaser */}
      <section className="bg-surface-subtle py-20 sm:py-28">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions" title="The basics, answered" />
          <div className="mt-12">
            <Faq items={HOME_FAQS} />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 font-semibold text-navy hover:text-navy-light"
            >
              See all FAQs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Citizens celebratory band */}
      <CitizensBand
        eyebrow="For every student"
        title="Scholarships that belong to you"
        lead="From merit scholarships and SC/ST fellowships to education loans and research grants — government support for students is your right. We help you find it."
      />

      {/* Footer CTA band */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-navy-gradient px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <h2 className="mx-auto max-w-2xl text-balance font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Stop leaving benefits on the table.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/80">
              Thousands of schemes go unclaimed every year. Find out what&rsquo;s
              yours in a few minutes — for free.
            </p>
            <div className="mt-9 flex justify-center">
              <HeroCta label="Check my eligibility" variant="saffron" size="lg" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
